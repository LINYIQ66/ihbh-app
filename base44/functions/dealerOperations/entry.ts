import { transact, requireThat } from "../../shared/transactions.ts";
import { shipment, complete } from "../../shared/dealerSales.ts";
import { createClientFromRequest } from "npm:@base44/sdk@0.8.57";
import { secrets } from "base44:runtime";
import {
  cents,
  allocations,
  getAccount,
  postedQuery,
  componentTypes,
  acquire,
  release,
  FinanceError,
} from "../../shared/dealerMath.ts";
import { fifoCost, stockFromRecords } from "../../shared/dealerInventory.ts";
import { dealerOverview } from "../../shared/dealerOverview.ts";
import {
  dealerPerformance,
  singaporeDay,
} from "../../shared/dealerReporting.ts";

import { dealerFinance } from "../../shared/commerce.ts";

const idValid = (id) => typeof id === "string" && /^[a-f0-9]{24}$/.test(id);
const tiers = ["partner", "official", "agent"];
async function loadOrder(client, entity, id) {
  if (!idValid(id)) throw new FinanceError("订单编号无效");
  const order = await client.entities[entity]
    .get(id)
    .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
  if (!order) throw new FinanceError("订单不存在", 404);
  return order;
}
async function configure(client, input) {
  if (
    !idValid(input.user_id) ||
    !tiers.includes(input.tier) ||
    typeof input.active !== "boolean"
  )
    throw new FinanceError("请选择用户、等级与启用状态");
  const user = await client.entities.User.get(input.user_id).catch((e) =>
    e.status === 404 ? null : Promise.reject(e),
  );
  if (!user) throw new FinanceError("用户不存在", 404);
  const values = {
    user_id: input.user_id,
    tier: input.tier,
    active: input.active,
    parent_user_id: input.parent_user_id || "",
    referrer_user_id: input.referrer_user_id || "",
  };
  for (const field of ["parent_user_id", "referrer_user_id"]) {
    if (!values[field]) continue;
    if (!idValid(values[field]) || values[field] === values.user_id)
      throw new FinanceError("不能将本人设为上级或介绍人");
    const related = await getAccount(client, values[field]);
    if (
      field === "parent_user_id" &&
      tiers.indexOf(related.tier) >= tiers.indexOf(values.tier)
    )
      throw new FinanceError("渠道上级必须为更高经销等级");
    if (field === "referrer_user_id" && related.tier !== values.tier)
      throw new FinanceError("介绍人必须与经销商同级");
    let next = related;
    const seen = new Set([values.user_id]);
    let depth = 0;
    while (next) {
      if (seen.has(next.user_id)) throw new FinanceError("关系不能形成循环");
      if (++depth > 32) throw new FinanceError("关系链过长，请先核对介绍关系");
      seen.add(next.user_id);
      next = next[field] ? await getAccount(client, next[field]) : null;
    }
  }
  const old = await getAccount(client, input.user_id, false);
  if (old && old.tier !== values.tier) {
    const links = await client.entities.DealerAccount.count({
      $or: [
        { parent_user_id: input.user_id },
        { referrer_user_id: input.user_id },
      ],
    });
    if (links)
      throw new FinanceError("请先调整关联下级及同级介绍关系，再变更等级", 409);
  }
  if (
    !values.active &&
    (await client.entities.DealerAccount.count({
      active: true,
      $or: [
        { parent_user_id: input.user_id },
        { referrer_user_id: input.user_id },
      ],
    }))
  )
    throw new FinanceError("请先调整关联中的上级或介绍人，再停用身份", 409);
  if (old) {
    const token = await acquire(client, "DealerAccount", old, "operation");
    try {
      await client.entities.DealerAccount.update(old.id, values);
    } finally {
      await release(client, "DealerAccount", old.id, "operation", token);
    }
  } else
    await client.entities.DealerAccount.create({
      ...values,
      operation_until: 0,
      operation_token: "",
    });
  return { saved: true };
}
function calculationCheck() {
  const seller = { user_id: "seller", tier: "agent" };
  const parents = [
    { user_id: "official", tier: "official" },
    { user_id: "partner", tier: "partner" },
  ];
  const referrers = [1, 2, 3].map((i) => ({
    user_id: `ref${i}`,
    tier: "agent",
  }));
  const rows = allocations({
    seller,
    parents,
    referrers,
    received: cents("530.00"),
    cost: cents("430.00"),
    category: "general",
    first: true,
  });
  const total = rows.reduce((sum, row) => sum + row.amount_cents, 0);
  const genecells = allocations({
    seller,
    parents,
    referrers,
    received: 53000,
    cost: 43000,
    category: "genecells",
    first: false,
  });
  const loss = allocations({
    seller,
    received: 100,
    cost: 200,
    category: "genecells",
    first: false,
  });
  const fifo = fifoCost(
    {
      qty: 3,
      lots: [
        { lot_id: "a", qty: 1, cost: 16000, sale_category: "general" },
        { lot_id: "b", qty: 2, cost: 30000, sale_category: "general" },
      ],
    },
    2,
  );
  const fixture = {
    id: "purchase",
    transaction_id: "op",
    received_at: "2026-10-01",
    items: [
      {
        product_id: "stock-check",
        name: "test",
        qty: 10,
        price: 1,
        sale_category: "general",
      },
    ],
  };
  const shipment = {
    product_id: "stock-check",
    qty: 3,
    cost_amount: 3,
    stock_allocations: [{ lot_id: "purchase:0", qty: 3, unit_cost_cents: 100 }],
  };
  const held = stockFromRecords(
    [fixture],
    [{ ...shipment, status: "shipped" }],
  )[0];
  const sold = stockFromRecords(
    [fixture],
    [{ ...shipment, status: "completed" }],
  )[0];
  const cancelled = stockFromRecords(
    [fixture],
    [{ ...shipment, status: "cancelled" }],
  )[0];
  const stockChecked =
    held.on_hand === 10 &&
    held.reserved === 3 &&
    held.qty === 7 &&
    sold.on_hand === 7 &&
    sold.reserved === 0 &&
    sold.qty === 7 &&
    cancelled.qty === 10;
  if (
    !stockChecked ||
    singaporeDay("2026-10-25T16:30:00.000Z") !== "2026-10-26"
  )
    throw new Error("库存预留、成交扣减或新加坡日期校验失败");
  if (
    fifo !== 46000 ||
    total !== 30140 ||
    genecells.some((row) =>
      ["rebate", "share", "referral"].includes(row.component),
    ) ||
    loss[0].amount_cents !== -100 ||
    cents("0.01") !== 1 ||
    Math.round((101 * 5) / 100) !== 5
  )
    throw new Error("财务计算校验失败");
  return {
    checked: true,
    base: 530,
    cost: 430,
    stacked_total: total / 100,
    entries: rows,
    genecells_entries: genecells,
    fifo_cost: fifo / 100,
    loss_preserved: true,
    stock_checked: stockChecked,
    singapore_day_checked: true,
  };
}
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth
      .me()
      .catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
    const input = await req.json().catch(() => ({}));
    const action = input.action || "overview";
    if (
      ["configure", "complete", "cancel", "calculationCheck"].includes(
        action,
      ) &&
      user.role !== "admin"
    )
      return Response.json({ error: "仅管理员可执行此操作" }, { status: 403 });
    const client = base44.asServiceRole;
    if (action === "ledger") {
      requireThat(
        !input.component ||
          input.component === "all" ||
          Object.hasOwn(componentTypes, input.component),
        "收益项目无效",
      );
      const page = await client.entities.Earning.filter(
        {
          ...postedQuery(user.id),
          ...(input.component && input.component !== "all"
            ? { component: input.component }
            : {}),
        },
        {
          sort: "-created_date",
          limit: 20,
          ...(input.cursor ? { cursor: input.cursor } : {}),
        },
      );
      const ready = new Map();
      for (const row of page.items)
        if (
          row.transaction_id &&
          row.source_order_id &&
          !ready.has(row.source_order_id)
        ) {
          const source = await client.entities.ShipOrder.get(
            row.source_order_id,
          );
          ready.set(
            source.id,
            source.settlement_state === "posted" && !source.finance_pending,
          );
        }
      return Response.json({
        ...page,
        items: page.items.filter(
          (row) =>
            !row.transaction_id ||
            !row.source_order_id ||
            ready.get(row.source_order_id),
        ),
      });
    }
    if (action === "overview") {
      const offset = Number(input.offset || 0);
      if (!Number.isInteger(offset) || offset < 0 || offset > 100000)
        return Response.json({ error: "分页参数无效" }, { status: 400 });
      return Response.json(await dealerOverview(client, user, offset));
    }
    if (action === "performance")
      return Response.json(
        await dealerPerformance(client, user, Number(input.days ?? 30)),
      );
    if (action === "configure")
      return Response.json(await configure(client, input));
    if (action === "ship")
      return Response.json(await shipment(client, user, input));
    if (action === "complete")
      return Response.json(
        await complete(client, user, input, {
          superAdminId: secrets.get("SUPER_ADMIN_USER_ID"),
        }),
      );
    if (action === "receive")
      return Response.json(
        await dealerFinance(client, user, {
          action: "receive_purchase",
          id: input.order_id,
          ref: `receive:${input.order_id}`,
        }),
      );
    if (action === "cancel") {
      const row = await loadOrder(client, "ShipOrder", input.order_id);
      return Response.json(
        await transact(
          client,
          "User",
          row.dealer_user_id,
          `cancel:${row.id}`,
          input,
          async () => {
            const order = await loadOrder(client, "ShipOrder", row.id);
            requireThat(
              order.status === "shipped",
              "只能取消未完成的出货单",
              409,
            );
            return {
              effects: [
                {
                  entity: "ShipOrder",
                  id: order.id,
                  expected: { status: "shipped" },
                  values: { status: "cancelled" },
                },
              ],
              result: { cancelled: true },
            };
          },
        ),
      );
    }
    if (action === "calculationCheck") return Response.json(calculationCheck());
    return Response.json({ error: "操作无效" }, { status: 400 });
  } catch (error) {
    console.error("经销商账务操作失败", error.message);
    return Response.json(
      { error: error.message },
      { status: error.status || 500 },
    );
  }
}
