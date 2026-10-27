import test from "node:test";
import assert from "node:assert/strict";
import { allocations, percent } from "../base44/shared/dealerMath.ts";
import {
  stockFromRecords,
  fifoAllocation,
} from "../base44/shared/dealerInventory.ts";
import { shipment, complete } from "../base44/shared/dealerSales.ts";
import { postSettlement } from "../base44/shared/dealerSettlement.ts";
import { catalog } from "../base44/shared/commerce.ts";
import { earnedSummary } from "../base44/shared/earnedBalance.ts";
import { db } from "./database.mjs";
import {
  changeDealerPolicy,
  readDealerPolicy,
  resolvePartnerFunding,
} from "../base44/shared/dealerPolicy.ts";
import { reconcileStock } from "../base44/shared/dealerInventoryMigration.ts";
import { peerRewardPreview } from "../src/components/globest/agency/dealerRewards.js";

const id = (n) => String(n).padStart(24, "0");
const seller = { user_id: id(100), tier: "agent" };
const parents = [
  { user_id: id(200), tier: "official" },
  { user_id: id(300), tier: "partner" },
];
const refs = [400, 500, 600, 700].map((n) => ({
  user_id: id(n),
  tier: "agent",
}));
const admin = { id: id(900), role: "admin" };
const sum = (rows, uid, component) =>
  rows
    .filter(
      (r) => r.user_id === uid && (!component || r.component === component),
    )
    .reduce((n, r) => n + r.amount_cents, 0);

for (const tier of ["partner", "official", "agent"])
  test(`${tier}: channel share and gross margin match the worked example`, () => {
    const s = { user_id: "seller", tier },
      p =
        tier === "partner"
          ? []
          : tier === "official"
            ? [{ user_id: "p", tier: "partner" }]
            : [
                { user_id: "o", tier: "official" },
                { user_id: "p", tier: "partner" },
              ];
    const rows = allocations({
      seller: s,
      parents: p,
      received: 100000,
      cost: 60000,
      category: "general",
      first: false,
    });
    assert.equal(sum(rows, "seller", "margin"), 40000);
    assert.equal(
      sum(rows, "seller", "rebate"),
      { partner: 30000, official: 20000, agent: 10000 }[tier],
    );
    assert.equal(
      rows
        .filter((r) => ["share", "rebate"].includes(r.component))
        .reduce((n, r) => n + r.amount_cents, 0),
      30000,
    );
  });
test("agent: first-sale 8% is experience-hall-funded; 5/3/2 balance their official payer exactly", () => {
  const rows = allocations({
    seller,
    parents,
    referrers: refs,
    received: 53000,
    cost: 43000,
    category: "general",
    first: true,
  });
  assert.equal(sum(rows, seller.user_id), 15300);
  assert.equal(sum(rows, parents[0].user_id, "share"), 5300);
  assert.equal(sum(rows, parents[0].user_id, "reward_cost"), -5300);
  assert.equal(sum(rows, parents[1].user_id), 5300);
  assert.deepEqual(
    refs.map((r) => sum(rows, r.user_id)),
    [6890, 1590, 1060, 0],
  );
  assert.equal(
    rows.find((r) => r.component === "referral").payer_kind,
    "experience_hall",
  );
  assert.equal(
    rows.reduce((n, r) => n + r.amount_cents, 0),
    30140,
  );
});
test("official: the referred official's own partner funds all three peer rewards", () => {
  const rows = allocations({
    seller: { user_id: "s", tier: "official" },
    parents: [{ user_id: "p", tier: "partner" }],
    referrers: [1, 2, 3].map((i) => ({ user_id: `r${i}`, tier: "official" })),
    received: 100000,
    cost: 30000,
    category: "genecells",
    first: false,
  });
  assert.equal(sum(rows, "p"), -10000);
  assert.equal(
    rows
      .filter((r) => r.component === "downline")
      .reduce((n, r) => n + r.amount_cents, 0),
    10000,
  );
  assert.ok(
    rows
      .filter((r) => r.component === "downline")
      .every((r) => r.payer_user_id === "p"),
  );
  assert.ok(
    !rows.some((r) => ["rebate", "share", "referral"].includes(r.component)),
  );
});
test("no referral chain, no referral award; missing mandatory payer blocks rather than inventing funding", () => {
  const plain = allocations({
    seller,
    received: 53000,
    cost: 43000,
    category: "genecells",
    first: true,
  });
  assert.deepEqual(
    plain.map((r) => r.component),
    ["margin"],
  );
  assert.throws(
    () =>
      allocations({
        seller,
        referrers: refs,
        received: 53000,
        cost: 43000,
        category: "genecells",
        first: true,
      }),
    /直属上级/,
  );
});
test("invalid hierarchy, self referral, nonfinite and fractional cents are rejected", () => {
  const base = {
    seller,
    parents,
    referrers: refs,
    received: 53000,
    cost: 43000,
    category: "general",
    first: true,
  };
  for (const received of [NaN, Infinity, -1, 1.2])
    assert.throws(() => allocations({ ...base, received }));
  assert.throws(() =>
    allocations({ ...base, parents: [{ user_id: "bad", tier: "agent" }] }),
  );
  assert.throws(() => allocations({ ...base, referrers: [seller] }));
  assert.throws(() => allocations({ ...base, category: "unknown" }));
});
test("cent rounding is half-up per recipient and the payer debit equals rounded credits", () => {
  assert.equal(percent(5, 10), 1);
  assert.equal(percent(1, 5), 0);
  assert.equal(percent(99999999999, 30), 30000000000);
  for (let n = 1; n < 20000; n += 13) {
    for (const rate of [2, 3, 5, 8, 10, 20, 30])
      assert.equal(percent(n, rate), Math.floor((n * rate + 50) / 100));
    assert.deepEqual(
      peerRewardPreview(n / 100).rewards,
      [5, 3, 2].map((rate) => percent(n, rate) / 100),
    );
    const rows = allocations({
      seller,
      parents,
      referrers: refs,
      received: n,
      cost: 0,
      category: "general",
      first: false,
    });
    assert.equal(
      sum(rows, parents[0].user_id, "reward_cost") +
        rows
          .filter((r) => r.component === "downline")
          .reduce((s, r) => s + r.amount_cents, 0),
      0,
    );
  }
});

test("only the configured super admin may switch partner funding; policy writes are idempotent", async () => {
  const c = business();
  c.seed("User", { ...admin, finance_state: { balance: 0, lifetime: 0 } });
  const input = {
    action: "set_mode",
    mode: "headquarters",
    confirmed: true,
    reason: "Finance approved headquarters funding",
    ref: "policy-headquarters",
  };
  await assert.rejects(
    changeDealerPolicy(c, { id: id(901), role: "admin" }, admin.id, input),
    /超级管理员/,
  );
  await assert.rejects(
    changeDealerPolicy(c, { ...admin, role: "user" }, admin.id, input),
    /超级管理员/,
  );
  await assert.rejects(changeDealerPolicy(c, admin, "", input), /超级管理员/);
  await changeDealerPolicy(c, admin, admin.id, input);
  await changeDealerPolicy(c, admin, admin.id, input);
  assert.equal((await readDealerPolicy(c, admin.id)).version, 1);
  const partner = { user_id: parents[1].user_id, tier: "partner" };
  const hq = await resolvePartnerFunding(c, partner, admin.id);
  assert.equal(hq.referral_funding, "headquarters");
  await changeDealerPolicy(c, admin, admin.id, {
    ...input,
    mode: "designated",
    ref: "policy-designated",
  });
  await assert.rejects(resolvePartnerFunding(c, partner, admin.id), /先指定/);
});

test("partner switch affects future settlements only, with equal recipient credits in both modes", async () => {
  const c = business();
  c.seed("User", { ...admin, finance_state: { balance: 0, lifetime: 0 } });
  for (const p of [seller, ...refs])
    await c.entities.DealerAccount.update(`account-${p.user_id}`, {
      tier: "partner",
      parent_user_id: "",
    });
  const input = {
    confirmed: true,
    reason: "Finance approved funding arrangement",
  };
  await changeDealerPolicy(c, admin, admin.id, {
    ...input,
    action: "set_mode",
    mode: "headquarters",
    ref: "partner-hq-mode",
  });
  const user = { id: seller.user_id },
    options = { superAdminId: admin.id };
  const a = await shipment(c, user, {
    product_id: id(800),
    qty: 1,
    kind: "sale",
    amount: "530",
    idempotency_key: "partner-sale-one",
  });
  await complete(
    c,
    admin,
    { order_id: a.order_id, received_amount: "530", receipt_confirmed: true },
    options,
  );
  const old = (await c.entities.ShipOrder.get(a.order_id)).settlement_snapshot;
  assert.ok(!old.some((r) => r.component === "reward_cost"));
  await changeDealerPolicy(c, admin, admin.id, {
    ...input,
    action: "assign_payer",
    user_id: seller.user_id,
    payer_user_id: parents[1].user_id,
    ref: "partner-set-payer",
  });
  await changeDealerPolicy(c, admin, admin.id, {
    ...input,
    action: "set_mode",
    mode: "designated",
    ref: "partner-upper-mode",
  });
  const b = await shipment(c, user, {
    product_id: id(800),
    qty: 1,
    kind: "sale",
    amount: "530",
    idempotency_key: "partner-sale-two",
  });
  await complete(
    c,
    admin,
    { order_id: b.order_id, received_amount: "530", receipt_confirmed: true },
    options,
  );
  const next = (await c.entities.ShipOrder.get(b.order_id)).settlement_snapshot;
  assert.equal(sum(next, parents[1].user_id, "reward_cost"), -5300);
  assert.deepEqual(
    next.filter((r) => r.component === "downline").map((r) => r.amount_cents),
    old.filter((r) => r.component === "downline").map((r) => r.amount_cents),
  );
  await postSettlement(c, a.order_id);
  assert.deepEqual(
    (await c.entities.ShipOrder.get(a.order_id)).settlement_snapshot,
    old,
  );
  assert.equal((await earnedSummary(c, parents[1].user_id)).total, -5300);
});

test("historical stock migration requires exact reviewed lots and does not rewrite existing costs", async () => {
  const c = db(),
    userId = "dealer";
  c.seed("User", { id: userId, finance_state: { balance: 0, lifetime: 0 } });
  c.seed("PurchaseOrder", {
    ...purchase("a", 100, 2),
    status: "received",
    user_id: userId,
  });
  c.seed("ShipOrder", {
    id: "legacy",
    dealer_user_id: userId,
    product_id: "p",
    status: "completed",
    qty: 1,
    cost_amount: 100,
  });
  const input = {
    orders: [
      {
        id: "legacy",
        stock_allocations: [{ lot_id: "a:0", qty: 1, unit_cost_cents: 10000 }],
      },
    ],
    confirmed: true,
    reason: "Verified supplier invoice and delivery record",
    ref: "review-inventory",
  };
  await assert.rejects(
    reconcileStock(c, { role: "user" }, userId, input),
    /管理员/,
  );
  await reconcileStock(c, admin, userId, input);
  await reconcileStock(c, admin, userId, input);
  assert.equal((await c.entities.ShipOrder.get("legacy")).cost_amount, 100);
  assert.equal(
    (await c.entities.ShipOrder.get("legacy")).stock_allocations[0].lot_id,
    "a:0",
  );
});
const purchase = (id, price, qty = 1) => ({
  id,
  transaction_id: "op",
  received_at: `2026-10-${id === "a" ? "01" : "02"}`,
  items: [
    {
      product_id: "p",
      name: "Product",
      qty,
      price,
      sale_category: "genecells",
    },
  ],
});
const sell = (id, allocation, status = "shipped") => ({
  id,
  product_id: "p",
  qty: allocation.allocations.reduce((n, r) => n + r.qty, 0),
  cost_amount: allocation.cost / 100,
  stock_allocations: allocation.allocations,
  status,
});
test("cancelling an older reservation releases its exact cheap lot without changing later order cost", () => {
  const purchases = [purchase("a", 100), purchase("b", 200)];
  const a = fifoAllocation(stockFromRecords(purchases, [])[0], 1);
  const b = fifoAllocation(stockFromRecords(purchases, [sell("A", a)])[0], 1);
  assert.equal(a.cost, 10000);
  assert.equal(b.cost, 20000);
  const restored = stockFromRecords(purchases, [
    sell("A", a, "cancelled"),
    sell("B", b, "completed"),
  ])[0];
  assert.equal(restored.qty, 1);
  assert.equal(fifoAllocation(restored, 1).cost, 10000);
  assert.equal(fifoAllocation(restored, 1).allocations[0].lot_id, "a:0");
});
test("cross-lot costs, out-of-order completion, oversell and historical mismatches", () => {
  const purchases = [purchase("a", 160, 1), purchase("b", 300, 2)],
    stock = stockFromRecords(purchases, [])[0];
  const a = fifoAllocation(stock, 2);
  assert.equal(a.cost, 46000);
  const b = fifoAllocation(stockFromRecords(purchases, [sell("A", a)])[0], 1);
  const rest = stockFromRecords(purchases, [
    sell("B", b, "completed"),
    sell("A", a),
  ])[0];
  assert.equal(rest.qty, 0);
  assert.equal(rest.on_hand, 2);
  assert.equal(rest.reserved, 2);
  assert.throws(() => fifoAllocation(rest, 1));
  assert.throws(
    () => stockFromRecords(purchases, [{ ...sell("A", a), cost_amount: 1 }]),
    /成本不一致/,
  );
  assert.throws(
    () =>
      stockFromRecords(purchases, [
        { ...sell("A", a), stock_allocations: undefined },
      ]),
    /缺少成本批次/,
  );
});
test("all three dealer price tiers come from verified server fields, never the retail price or request", async () => {
  const c = db();
  c.seed("Product", {
    id: "p",
    name_zh: "Photon",
    price: 530,
    approval_status: "published",
    is_demo: false,
    dealer_enabled: true,
    dealer_sale_category: "genecells",
    dealer_price_partner: 160,
    dealer_price_official: 300,
    dealer_price_agent: 430,
  });
  for (const [tier, price] of [
    ["partner", 160],
    ["official", 300],
    ["agent", 430],
  ])
    assert.equal(
      (await catalog(c, [{ product_id: "p", qty: 1, price: 0.01 }], tier))[0]
        .price,
      price,
    );
  await c.entities.Product.update("p", { dealer_price_agent: undefined });
  await assert.rejects(catalog(c, [{ product_id: "p", qty: 1 }], "agent"));
});

function business() {
  const c = db(),
    people = [seller, ...parents, ...refs];
  for (const p of people)
    c.seed("User", {
      id: p.user_id,
      email: `${p.user_id}@test.local`,
      finance_state: { balance: 0, lifetime: 0 },
    });
  for (const p of people)
    c.seed("DealerAccount", {
      id: `account-${p.user_id}`,
      ...p,
      active: true,
      parent_user_id:
        p.user_id === seller.user_id
          ? parents[0].user_id
          : p.user_id === parents[0].user_id
            ? parents[1].user_id
            : "",
      referrer_user_id:
        p.user_id === seller.user_id
          ? refs[0].user_id
          : refs.findIndex((r) => r.user_id === p.user_id) >= 0
            ? refs[refs.findIndex((r) => r.user_id === p.user_id) + 1]
                ?.user_id || ""
            : "",
    });
  c.seed("PurchaseOrder", {
    id: "stock",
    user_id: seller.user_id,
    transaction_id: "op",
    transaction_status: "posted",
    status: "received",
    received_at: "2026-10-01",
    items: [
      {
        product_id: id(800),
        name: "Product",
        price: 430,
        qty: 5,
        sale_category: "general",
      },
    ],
  });
  return c;
}
test("two concurrent first sales award 8% once; replay never doubles any account or funding debit", async () => {
  const c = business(),
    user = { id: seller.user_id };
  const a = await shipment(c, user, {
    product_id: id(800),
    qty: 1,
    kind: "sale",
    amount: "530",
    idempotency_key: "shipment-one",
  });
  const b = await shipment(c, user, {
    product_id: id(800),
    qty: 1,
    kind: "sale",
    amount: "530",
    idempotency_key: "shipment-two",
  });
  const input = (o) => ({
    order_id: o.order_id,
    received_amount: "530",
    receipt_confirmed: true,
    sale_category: "general",
  });
  await Promise.all([
    complete(c, admin, input(a)),
    complete(c, admin, input(b)),
  ]);
  await complete(c, admin, input(a));
  await postSettlement(c, a.order_id);
  const posted = c
    .rows("Earning")
    .filter((r) => r.transaction_status === "posted");
  assert.equal(posted.filter((r) => r.component === "referral").length, 1);
  assert.equal(posted.find((r) => r.component === "referral").payer_kind, "experience_hall");
  assert.equal((await c.entities.ShipOrder.get(a.order_id)).settlement_rule_version, "dealer-v4-2026-10-27");
  assert.equal(
    posted
      .filter((r) => r.component === "reward_cost")
      .reduce((n, r) => n + r.amount, 0),
    -106,
  );
  assert.equal((await earnedSummary(c, refs[0].user_id)).total, 9540);
  assert.equal((await earnedSummary(c, parents[0].user_id)).total, 0);
  assert.equal(
    c
      .rows("ShipOrder")
      .filter((r) => r.transaction_status === "posted" && r.first_paid_sale)
      .length,
    1,
  );
});
test("settlement resumes after a recipient write fails without paying the payer or recipient twice", async () => {
  const c = business(),
    user = { id: seller.user_id };
  const order = await shipment(c, user, {
    product_id: id(800),
    qty: 1,
    kind: "sale",
    amount: "530",
    idempotency_key: "shipment-fault",
  });
  let failed = false;
  c.fault = (name, q, u, stage) =>
    name === "Earning" && stage === "after" && !failed
      ? (failed = true)
      : false;
  const input = {
    order_id: order.order_id,
    received_amount: "530",
    receipt_confirmed: true,
    sale_category: "general",
  };
  await assert.rejects(complete(c, admin, input), /lost response/);
  await Promise.all([
    postSettlement(c, order.order_id),
    postSettlement(c, order.order_id),
  ]);
  const posted = c
    .rows("Earning")
    .filter((r) => r.transaction_status === "posted");
  assert.equal(posted.filter((r) => r.component === "reward_cost").length, 1);
  assert.equal(posted.filter((r) => r.component === "referral").length, 1);
  assert.equal((await earnedSummary(c, refs[0].user_id)).total, 6890);
});
test("settlement category is immutable from procurement; client cannot replace it at completion", async () => {
  const c = business(),
    user = { id: seller.user_id };
  const order = await shipment(c, user, {
    product_id: id(800),
    qty: 1,
    kind: "sale",
    amount: "530",
    idempotency_key: "shipment-category",
  });
  await assert.rejects(
    complete(c, admin, {
      order_id: order.order_id,
      received_amount: "530",
      receipt_confirmed: true,
      sale_category: "genecells",
    }),
    /采购批次/,
  );
  assert.equal(c.rows("Earning").length, 0);
});

test("a zero-receipt completion keeps the loss and does not consume the first paid-sale bonus", async () => {
  const c = business(),
    user = { id: seller.user_id };
  for (const [key, amount] of [
    ["zero-receipt-sale", "0"],
    ["first-paid-after-zero", "530"],
  ]) {
    const order = await shipment(c, user, {
      product_id: id(800),
      qty: 1,
      kind: "sale",
      amount,
      idempotency_key: key,
    });
    await complete(c, admin, {
      order_id: order.order_id,
      received_amount: amount,
      receipt_confirmed: true,
    });
  }
  const rows = c
    .rows("Earning")
    .filter((r) => r.transaction_status === "posted");
  assert.equal(rows.filter((r) => r.component === "referral").length, 1);
  assert.equal(rows.find((r) => r.component === "referral").amount, 42.4);
  assert.ok(rows.some((r) => r.component === "margin" && r.amount === -430));
});
