import test from "node:test";
import assert from "node:assert/strict";
import { points, tickets, dealerFinance } from "../base44/shared/commerce.ts";
import {
  snapshot,
  transact,
  ledger,
  finish,
} from "../base44/shared/transactions.ts";
import { applyMembership, plans } from "../base44/shared/membership.ts";
import { quota } from "../base44/shared/quota.ts";
import { postSettlement } from "../base44/shared/dealerSettlement.ts";
import { reviewRetail } from "../base44/shared/retail.ts";
import { earnedBalance } from "../base44/shared/earnedBalance.ts";

import { db } from './database.mjs';
const user = { id: "user1", email: "one@example.com", role: "user" };
function account(balance = 100) {
  const c = db();
  c.seed("User", { ...user, finance_state: { balance, lifetime: 0 } });
  return c;
}
const ref = () => crypto.randomUUID();

test("legacy points require explicit reconciliation before any spending", async () => {
  const c = db();
  c.seed("User", user);
  c.seed("PointsLedger", { id: "legacy", user_id: user.id, amount: 999999, type: "game" });
  await assert.rejects(snapshot(c, "User", user.id), /历史积分尚未核对/);
  assert.equal((await snapshot(c, "User", user.id, true)).state.balance, 999999);
});

test("checkout rejects a changed quoted total before debiting", async () => {
  const c = account();
  c.seed("Product", { id: "p", price: 5, approval_status: "published", is_demo: false, name_zh: "Product" });
  await assert.rejects(points(c, user, { action: "checkout", items: [{ id: "p", quantity: 1 }], expected_total: 4, ref: ref() }));
  assert.equal((await snapshot(c, "User", user.id)).state.balance, 100);
  assert.equal(c.rows("SalesOrder").length, 0);
});

test("withdrawable income waits for complete settlement and includes its negative entries", async () => {
  const c = account();
  c.seed("Earning", { id: "income", user_id: user.id, amount: 100, posting_status: "posted", transaction_status: "posted", transaction_id: "op", source_order_id: "sale" });
  c.seed("ShipOrder", { id: "sale", finance_pending: "op", settlement_state: "posted", settlement_snapshot: [{ user_id: user.id, amount_cents: 10000 }, { user_id: user.id, amount_cents: -8000 }] });
  await assert.rejects(earnedBalance(c, user.id), /分润尚未完成/);
  await c.entities.ShipOrder.update("sale", { finance_pending: "" });
  assert.equal(await earnedBalance(c, user.id), 2000);
});
test("concurrent debits cannot overspend", async () => {
  const c = account();
  const results = await Promise.allSettled(
    [1, 2].map((i) =>
      transact(c, "User", user.id, `spend-test-${i}`, {}, (s) => ({
        drafts: [ledger(s, user.id, -80, "redeem", `spend-test-${i}`, "test")],
      })),
    ),
  );
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal((await snapshot(c, "User", user.id)).state.balance, 20);
  assert.equal(
    c.rows("PointsLedger").filter((r) => r.transaction_status === "posted")
      .length,
    1,
  );
});
test("same request races publish once and return the same receipt", async () => {
  const c = account();
  const results = await Promise.all(
    Array.from({ length: 8 }, () =>
      points(c, user, {
        action: "redeem",
        gift_id: "tea",
        ref: "same-request-1",
      }),
    ),
  );
  assert.equal(new Set(results.map((r) => r.ticket_id)).size, 1);
  assert.equal((await snapshot(c, "User", user.id)).state.balance, 50);
  assert.equal(
    c.rows("Ticket").filter((t) => t.transaction_status === "posted").length,
    1,
  );
  await assert.rejects(
    points(c, user, {
      action: "redeem",
      gift_id: "assessment",
      ref: "same-request-1",
    }),
    /请求编号/,
  );
});
test("failure after debit before effects is recovered without another charge", async () => {
  const c = account();
  let once = true;
  c.fault = (name, q, u, stage) =>
    name === "Ticket" && stage === "before" && once
      ? ((once = false), true)
      : false;
  const input = { action: "redeem", gift_id: "tea", ref: "failure-test-1" };
  await assert.rejects(points(c, user, input), /injected/);
  assert.equal(c.rows("User")[0].finance_state.balance, 50);
  const result = await points(c, user, input);
  assert.ok(result.ticket_id);
  assert.equal((await snapshot(c, "User", user.id)).state.balance, 50);
  assert.equal(
    c.rows("Ticket").filter((t) => t.transaction_status === "posted").length,
    1,
  );
});
test("lost CAS response is recovered from the account outbox", async () => {
  const c = account();
  let once = true;
  c.fault = (name, q, u, stage) =>
    name === "User" && u.$set.finance_state && stage === "after" && once
      ? ((once = false), true)
      : false;
  const input = { action: "redeem", gift_id: "tea", ref: "lost-response-1" };
  await assert.rejects(points(c, user, input), /lost response/);
  await points(c, user, input);
  assert.equal((await snapshot(c, "User", user.id)).state.balance, 50);
});
test("client spend/SGD and invented article IDs never mint credit", async () => {
  const c = account();
  await assert.rejects(
    points(c, user, { action: "spend", points: 1, sgd: 1000000 }),
    /订单/,
  );
  await assert.rejects(
    points(c, user, { action: "earn", key: "read-invented" }),
    /阅读/,
  );
  await assert.rejects(
    points(c, user, { action: "game", amount: 50, ref: ref() }),
    /移动/,
  );
  assert.equal(c.rows("User")[0].finance_state.balance, 100);
});
test("game ignores supplied reward and requires an actual server board merge", async () => {
  const c = account();
  const result = await points(c, user, {
    action: "game",
    move: "move",
    from: 0,
    to: 1,
    amount: 50000,
    ref: ref(),
  });
  assert.equal(result.amount, 2);
  assert.equal(result.board[1], 2);
  assert.equal((await snapshot(c, "User", user.id)).state.balance, 102);
});
test("checkout reprices catalog and cannot turn a failed payment into an order", async () => {
  const c = account();
  c.seed("Product", {
    id: "p1",
    price: 20,
    approval_status: "published",
    is_demo: false,
    name_zh: "商品",
  });
  await assert.rejects(
    points(c, user, {
      action: "checkout",
      items: [{ id: "p1", quantity: 1, price: 0.01 }],
      ref: ref(),
    }),
    /不足/,
  );
  assert.equal(c.rows("SalesOrder").length, 0);
  c.seed("Product", {
    id: "p2",
    price: 5,
    approval_status: "published",
    is_demo: false,
    name_zh: "商品2",
  });
  const result = await points(c, user, {
    action: "checkout",
    items: [{ id: "p2", quantity: 1, price: 0.01 }],
    sgd: 1000000,
    ref: ref(),
  });
  assert.equal(result.total, 5);
  assert.equal(result.back, 2);
  assert.equal((await snapshot(c, "User", user.id)).state.balance, 52);
});
test("failed recipient credit can be retried without double debit", async () => {
  const c = account();
  c.seed("User", {
    id: "user2",
    email: "two@example.com",
    finance_state: { balance: 0, lifetime: 0 },
  });
  let once = true;
  c.fault = (name, q, u, stage) =>
    name === "User" && q.id === "user2" && stage === "before" && once
      ? ((once = false), true)
      : false;
  const input = {
    action: "transfer",
    email: "two@example.com",
    amount: 80,
    ref: "transfer-test-1",
  };
  await assert.rejects(points(c, user, input), /injected/);
  await points(c, user, input);
  await points(c, user, input);
  assert.equal((await snapshot(c, "User", "user1")).state.balance, 20);
  assert.equal((await snapshot(c, "User", "user2")).state.balance, 80);
});
test("simultaneous opposite transfers terminate and preserve total funds", async () => {
  const c = account();
  const u2 = { id: "user2", email: "two@example.com" };
  c.seed("User", { ...u2, finance_state: { balance: 100, lifetime: 0 } });
  await Promise.all([
    points(c, user, {
      action: "transfer",
      email: u2.email,
      amount: 80,
      ref: "opposite-one",
    }),
    points(c, u2, {
      action: "transfer",
      email: user.email,
      amount: 70,
      ref: "opposite-two",
    }),
  ]);
  assert.equal((await snapshot(c, "User", "user1")).state.balance, 90);
  assert.equal((await snapshot(c, "User", "user2")).state.balance, 110);
});
test("withdrawals reject negative/nonfinite values and foreign bank cards", async () => {
  const c = account();
  c.seed("BankCard", {
    id: "bank",
    created_by_id: user.id,
    bank: "Bank",
    last4: "1234",
  });
  c.seed("Earning", {
    id: "income",
    user_id: user.id,
    amount: 100,
    posting_status: "posted",
  });
  for (const amount of [-1000, Infinity, NaN, 0, 50.001])
    await assert.rejects(
      dealerFinance(c, user, {
        action: "withdraw",
        amount,
        bank_id: "bank",
        ref: ref(),
      }),
    );
  c.seed("BankCard", { id: "otherbank", created_by_id: "other" });
  await assert.rejects(
    dealerFinance(c, user, {
      action: "withdraw",
      amount: 50,
      bank_id: "otherbank",
      ref: ref(),
    }),
    /银行卡/,
  );
  const results = await Promise.allSettled(
    [1, 2].map(() =>
      dealerFinance(c, user, {
        action: "withdraw",
        amount: 80,
        bank_id: "bank",
        ref: ref(),
      }),
    ),
  );
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
});
test("purchase prices and first-order credits come from server; approval does not fund balance", async () => {
  const c = account();
  c.seed("DealerAccount", {
    id: "d",
    user_id: user.id,
    active: true,
    tier: "agent",
  });
  c.seed("Product", {
    id: "p",
    price: 2000,
    dealer_enabled: true,
    dealer_sale_category: "general",
    dealer_price_agent: 1600,
    dealer_price_partner: 1200,
    dealer_price_official: 1400,
    is_demo: false,
    approval_status: "published",
  });
  const r = await dealerFinance(c, user, {
    action: "purchase",
    items: [{ product_id: "p", qty: 1, price: -1 }],
    balance_credit: 99999,
    ref: ref(),
  });
  const row = await c.entities.PurchaseOrder.get(r.order_id);
  assert.equal(row.amount, 1600);
  assert.equal(row.balance_credit, 100);
  assert.equal(row.items[0].price, 1600);
  const admin = { id: "admin", role: "admin" };
  await dealerFinance(c, admin, {
    action: "review_purchase",
    id: row.id,
    status: "approved",
    ref: ref(),
  });
  const next = await dealerFinance(c, user, {
    action: "purchase",
    items: [{ product_id: "p", qty: 1 }],
    use_balance: true,
    ref: ref(),
  });
  assert.equal(
    (await c.entities.PurchaseOrder.get(next.order_id)).balance_used,
    0,
  );
});
test("event capacity serializes across different users and venue overlaps fail", async () => {
  const c = account();
  c.seed("SalonEvent", {
    id: "event",
    title: "Event",
    status: "open",
    start_at: new Date(Date.now() + 86400000).toISOString(),
    capacity: 1,
    fee: 20,
  });
  const results = await Promise.allSettled(
    [user, { id: "user2" }].map((u) =>
      tickets(c, u, {
        action: "issue_ticket",
        kind: "event",
        ref_id: "event",
        ref: ref(),
      }),
    ),
  );
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  c.seed("Venue", {
    id: "venue",
    name: "Venue",
    available: true,
    price_per_hour: 10,
  });
  const date = new Date(Date.now() + 86400000).toISOString();
  await tickets(c, user, {
    action: "issue_ticket",
    kind: "venue",
    ref_id: "venue",
    date,
    hours: 2,
    ref: ref(),
  });
  await assert.rejects(
    tickets(
      c,
      { id: "user2" },
      {
        action: "issue_ticket",
        kind: "venue",
        ref_id: "venue",
        date,
        hours: 1,
        ref: ref(),
      },
    ),
    /已预定/,
  );
});
test("ticket redemption requires issued provenance, authorization and receipt", async () => {
  const c = account();
  c.seed("Ticket", {
    id: "forged",
    user_id: user.id,
    code: "FAKE",
    status: "unused",
    transaction_status: "posted",
  });
  await assert.rejects(
    tickets(
      c,
      { id: "admin", role: "admin" },
      { action: "verify_ticket", code: "FAKE" },
    ),
    /历史票券/,
  );
  const result = await points(c, user, {
      action: "redeem",
      gift_id: "tea",
      ref: ref(),
    }),
    t = await c.entities.Ticket.get(result.ticket_id);
  await assert.rejects(
    tickets(c, user, { action: "verify_ticket", code: t.code }),
    /无权/,
  );
  await tickets(c, user, { action: "cancel_ticket", ticket_id: t.id });
  await tickets(c, user, { action: "cancel_ticket", ticket_id: t.id });
  assert.equal((await snapshot(c, "User", user.id)).state.balance, 100);
});
test("membership validates price/app/buyer; test purchase cannot downgrade live tier", async () => {
  const c = account();
  const session = (id, tier, live) => ({
    id,
    mode: "payment",
    payment_status: "paid",
    currency: "sgd",
    amount_total: plans[tier].fee * 100,
    livemode: live,
    created: Date.now() / 1000,
    client_reference_id: user.id,
    metadata: {
      base44_app_id: "app",
      membership_tier: tier,
      membership_user_id: user.id,
    },
  });
  const lines = (tier) => [{ price: { id: plans[tier].price }, quantity: 1 }];
  await assert.rejects(
    applyMembership(
      c,
      user,
      session("bad", "vip", true),
      lines("standard"),
      "app",
    ),
    /price/,
  );
  await applyMembership(
    c,
    user,
    session("live", "prestige", true),
    lines("prestige"),
    "app",
  );
  await applyMembership(
    c,
    user,
    session("test", "standard", false),
    lines("standard"),
    "app",
  );
  await applyMembership(
    c,
    user,
    session("old", "standard", true),
    lines("standard"),
    "app",
  );
  assert.equal(
    (await snapshot(c, "User", user.id)).state.membership.tier,
    "prestige",
  );
  assert.equal(
    c.rows("MemberProfile").filter((r) => r.transaction_status === "posted")
      .length,
    1,
  );
});
test("AI quota is atomic across concurrent requests", async () => {
  const c = account();
  const r = await Promise.allSettled(
    Array.from({ length: 5 }, () => quota(c, user, "chat", 30)),
  );
  assert.equal(r.filter((x) => x.status === "fulfilled").length, 1);
});

test("stale finalization cannot reapply an effect after status cycles", async () => {
  const c = account();
  c.seed("Ticket", { id: "ticket", status: "unused" });
  const transition = (key, status) =>
    transact(c, "User", user.id, key, { status }, async () => {
      const row = await c.entities.Ticket.get("ticket");
      return {
        effects: [
          {
            entity: "Ticket",
            id: "ticket",
            expected: { status: row.status },
            values: { status },
          },
        ],
      };
    });
  await transition("cycle-first", "used");
  const effect = c
    .rows("FinancialOperation")
    .find((o) => o.key === "cycle-first").effects[0];
  await transition("cycle-second", "unused");
  const changed = await c.entities.Ticket.updateMany(
    { id: effect.id, ...effect.expected },
    { $set: effect.values },
  );
  assert.equal(changed.updated, 0);
  assert.equal((await c.entities.Ticket.get("ticket")).status, "unused");
});
test("retail refund is idempotent and reverses the shopping reward", async () => {
  const c = account();
  c.seed("Product", {
    id: "p",
    price: 5,
    approval_status: "published",
    is_demo: false,
    name_zh: "Product",
  });
  const order = await points(c, user, {
    action: "checkout",
    items: [{ id: "p", quantity: 1 }],
    ref: ref(),
  });
  const input = {
    action: "review_order",
    id: order.order_id,
    status: "cancelled",
    refund_confirmed: true,
    ref: "refund-request-one",
  };
  await assert.rejects(reviewRetail(c, user, input), /管理员/);
  await reviewRetail(c, { id: "admin", role: "admin" }, input);
  await reviewRetail(c, { id: "admin", role: "admin" }, input);
  assert.equal((await snapshot(c, "User", user.id)).state.balance, 100);
  assert.equal((await snapshot(c, "User", user.id)).state.lifetime, 0);
});
test("settlement races and lost publication recover without duplicate earnings", async () => {
  const c = account();
  c.seed("ShipOrder", {
    id: "sale",
    status: "completed",
    dealer_user_id: user.id,
    cost_amount: 10,
    received_amount: 15,
    completed_at: new Date().toISOString(),
    name: "Product",
    qty: 1,
    settlement_state: "pending",
    settlement_rule_version: "dealer-v3-2026-10-27",
    settlement_snapshot: [
      {
        user_id: user.id,
        component: "margin",
        amount_cents: 500,
        rate: 0,
        note: "Margin",
      },
    ],
  });
  let once = true;
  c.fault = (name, q, u, stage) =>
    name === "Earning" && stage === "before" && once
      ? ((once = false), true)
      : false;
  await assert.rejects(postSettlement(c, "sale"), /injected/);
  await Promise.all([postSettlement(c, "sale"), postSettlement(c, "sale")]);
  const rows = c.rows("Earning").filter((r) => r.posting_status === "posted");
  assert.equal(rows.length, 1);
  assert.equal(rows[0].amount, 5);
  assert.equal((await c.entities.ShipOrder.get("sale")).finance_pending, "");
});
