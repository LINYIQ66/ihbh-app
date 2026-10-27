import { settledEntries } from "./earnedBalance.ts";
import { FinanceError, saleOwner } from "./dealerMath.ts";

export function singaporeDay(value = new Date()) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime()))
    throw new FinanceError("订单完成日期无效，不能归属每日业绩", 409);
  return new Date(date.getTime() + 8 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

export async function dealerPerformance(
  client,
  user,
  days = 30,
  now = new Date(),
) {
  if (![7, 30, 90].includes(days))
    throw new FinanceError("请选择最近 7、30 或 90 天");
  const today = singaporeDay(now);
  const end = new Date(`${today}T00:00:00.000Z`).getTime();
  const dates = Array.from({ length: days }, (_, index) =>
    new Date(end - (days - 1 - index) * 86400000).toISOString().slice(0, 10),
  );
  const range = { $gte: dates[0], $lte: today };
  const [sales, earnings] = await Promise.all([
    client.entities.ShipOrder.aggregate({
      query: {
        $and: [
          saleOwner(user.id),
          {
            status: "completed",
            kind: { $ne: "self_use" },
            completed_day: range,
            transaction_status: { $ne: "prepared" },
          },
        ],
      },
      groupBy: "completed_day",
      sum: ["received_amount"],
      limit: days,
    }),
    settledEntries(client, user.id, {
      source_order_id: { $exists: true },
      earned_day: range,
    }),
  ]);
  if (sales.truncated)
    throw new FinanceError("业绩统计结果不完整，请缩短统计期间", 409);
  const saleDays = new Map(sales.rows.map((row) => [row.completed_day, row]));
  const earningDays = new Map();
  for (const entry of earnings) {
    const old = earningDays.get(entry.earned_day) || { cents: 0, count: 0 };
    old.cents += entry.amount_cents;
    old.count++;
    earningDays.set(entry.earned_day, old);
  }
  const rows = dates.map((date) => ({
    date,
    receipts:
      Math.round((saleDays.get(date)?.sum_received_amount || 0) * 100) / 100,
    earnings: (earningDays.get(date)?.cents || 0) / 100,
    orders: saleDays.get(date)?.count || 0,
    entries: earningDays.get(date)?.count || 0,
  }));
  const totals = rows.reduce(
    (sum, row) => ({
      receipts: sum.receipts + Math.round(row.receipts * 100),
      earnings: sum.earnings + Math.round(row.earnings * 100),
      orders: sum.orders + row.orders,
      entries: sum.entries + row.entries,
    }),
    { receipts: 0, earnings: 0, orders: 0, entries: 0 },
  );
  return {
    rows,
    totals: {
      ...totals,
      receipts: totals.receipts / 100,
      earnings: totals.earnings / 100,
    },
    days,
    timezone: "Asia/Singapore",
    generated_at: new Date(now).toISOString(),
  };
}
