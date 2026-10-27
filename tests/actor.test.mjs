import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const source = fs.readFileSync(
  new URL("../base44/actors/LiveBroadcast/entry.ts", import.meta.url),
  "utf8",
);
const js = ts.transpileModule(
  source
    .replace("import { Actor } from 'base44:runtime/actors';", "")
    .replace(
      "export default class LiveBroadcast",
      "globalThis.LiveBroadcast = class LiveBroadcast",
    ),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.None,
    },
  },
).outputText;
function setup() {
  const room = { id: "room", host_user_id: "owner", status: "ended" },
    sent = [];
  let banned = false;
  class Actor {
    instanceId = "room";
    storage = { get: async () => null, put: async () => {} };
    client = {
      asServiceRole: {
        entities: {
          LiveRoom: {
            get: async () => ({ ...room }),
            update: async (_, v) => Object.assign(room, v),
          },
          LiveBan: { count: async () => (banned ? 1 : 0) },
        },
      },
    };
    broadcast(m) {
      sent.push(m);
    }
    getConnections() {
      return connections;
    }
  }
  const connections = [];
  const context = vm.createContext({ Actor, Map, Set, Date, Promise, console });
  vm.runInContext(js, context);
  const actor = new context.LiveBroadcast();
  const connect = async (id, uid) => {
    const conn = {
      id,
      identity: { type: "authenticated", userId: uid },
      send: (m) => sent.push(m),
      reject: () => {
        conn.rejected = true;
      },
    };
    connections.push(conn);
    await actor.handleConnect(conn);
    return conn;
  };
  return {
    actor,
    room,
    sent,
    connect,
    ban: () => {
      banned = true;
    },
  };
}
test("actor denies forged ownership and wrong instance IDs", async () => {
  const s = setup(),
    other = await s.connect("x", "intruder");
  await s.actor.handleMessage(other, {
    type: "host_start",
    registryId: "room",
  });
  assert.equal(s.room.status, "ended");
  const owner = await s.connect("h", "owner");
  await s.actor.handleMessage(owner, {
    type: "host_start",
    registryId: "another-room",
  });
  assert.equal(s.room.status, "ended");
});
test("actor denies banned starts and ends an active ban on its managed tick", async () => {
  const s = setup(),
    owner = await s.connect("h", "owner");
  await s.actor.handleMessage(owner, {
    type: "host_start",
    registryId: "room",
  });
  assert.equal(s.room.status, "live");
  s.ban();
  await s.actor.handleTick();
  assert.equal(s.room.status, "ended");
  assert.equal(s.actor.hostSeat, null);
  await s.actor.handleMessage(owner, {
    type: "host_start",
    registryId: "room",
  });
  assert.equal(s.room.status, "ended");
});
test("actor rejects reconnecting a connection id with a different identity", async () => {
  const s = setup();
  await s.connect("same", "owner");
  const intruder = await s.connect("same", "intruder");
  assert.equal(intruder.rejected, true);
});
test("concurrent host starts admit one host", async () => {
  const s = setup(),
    a = await s.connect("a", "owner"),
    b = await s.connect("b", "owner");
  await Promise.all([
    s.actor.handleMessage(a, { type: "host_start", registryId: "room" }),
    s.actor.handleMessage(b, { type: "host_start", registryId: "room" }),
  ]);
  assert.equal(
    [...s.actor.users.values()].filter((u) => u.role === "host").length,
    1,
  );
});
