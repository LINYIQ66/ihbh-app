import { all, requireThat } from "./transactions.ts";
import { postedQuery } from "./dealerMath.ts";

// All views and withdrawals use the same complete immutable source snapshots.
export async function settledEntries(client, userId, extraQuery = {}) {
  const rows = await all(client, "Earning", {
    ...postedQuery(userId),
    ...extraQuery,
  });
  const result = [],
    sources = new Set();
  for (const row of rows) {
    if (row.transaction_id && row.source_order_id) {
      if (sources.has(row.source_order_id)) continue;
      sources.add(row.source_order_id);
      const order = await client.entities.ShipOrder.get(row.source_order_id);
      requireThat(
        !order.finance_pending &&
          order.settlement_state === "posted" &&
          Array.isArray(order.settlement_snapshot),
        "销售分润尚未完成，请结算完成后重试",
        409,
      );
      for (const entry of order.settlement_snapshot) {
        requireThat(
          Number.isSafeInteger(entry.amount_cents),
          "收益金额异常",
          409,
        );
        if (entry.user_id === userId)
          result.push({
            ...entry,
            earned_day: order.completed_day || row.earned_day,
            source_order_id: order.id,
          });
      }
    } else {
      const amount_cents = Math.round(row.amount * 100);
      requireThat(
        Number.isFinite(row.amount) &&
          Number.isSafeInteger(amount_cents) &&
          Math.abs(row.amount * 100 - amount_cents) < 0.00001,
        "历史收益金额异常，请管理员核对",
        409,
      );
      result.push({ ...row, amount_cents });
    }
  }
  return result;
}
export async function earnedSummary(client, userId) {
  const rows = await settledEntries(client, userId),
    income_totals = {};
  let total = 0;
  for (const row of rows) {
    total += row.amount_cents;
    const key = row.component || "manual";
    income_totals[key] = (income_totals[key] || 0) + row.amount_cents;
  }
  requireThat(Number.isSafeInteger(total), "收益金额异常", 409);
  return {
    total,
    income_totals: Object.fromEntries(
      Object.entries(income_totals).map(([k, v]) => [k, Number(v) / 100]),
    ),
  };
}
export async function earnedBalance(client, userId) {
  return (await earnedSummary(client, userId)).total;
}
