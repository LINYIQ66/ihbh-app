import { earnedSummary } from "./earnedBalance.ts";
import { getAccount, saleOwner } from "./dealerMath.ts";
import { inventory } from "./dealerInventory.ts";
import { ownerQuery, requireThat } from "./transactions.ts";

const stockPage = (stock, offset) => ({
  inventory: stock.slice(offset, offset + 20).map(({ lots, ...item }) => item),
  next_offset: offset + 20 < stock.length ? offset + 20 : null,
});

export async function dealerOverview(client, user, offset = 0) {
  if (offset > 0) return stockPage(await inventory(client, user.id), offset);
  for (const entity of ["Withdrawal", "PurchaseOrder"]) {
    const unreviewed = await client.entities[entity].count({
      ...ownerQuery(user.id),
      status: { $ne: "rejected" },
      transaction_status: { $ne: "prepared" },
      transaction_id: { $exists: false },
      legacy_reviewed: { $ne: true },
    });
    requireThat(!unreviewed, "历史提现或采购尚未核对，请管理员完成迁移", 409);
  }
  const [account, stock, earnings, withdrawals, purchases, sales] =
    await Promise.all([
      getAccount(client, user.id, false),
      inventory(client, user.id),
      earnedSummary(client, user.id),
      client.entities.Withdrawal.aggregate({
        query: {
          $or: [{ user_id: user.id }, { created_by_id: user.id }],
          transaction_status: { $ne: "prepared" },
        },
        groupBy: "status",
        sum: ["amount"],
      }),
      client.entities.PurchaseOrder.aggregate({
        query: {
          $or: [{ user_id: user.id }, { created_by_id: user.id }],
          transaction_status: { $ne: "prepared" },
        },
        groupBy: "status",
        sum: ["amount", "balance_credit", "balance_used"],
      }),
      client.entities.ShipOrder.aggregate({
        query: saleOwner(user.id),
        groupBy: "status",
        sum: ["received_amount"],
      }),
    ]);
  requireThat(
    ![withdrawals, purchases, sales].some((r) => r.truncated),
    "账目汇总不完整，请管理员核对",
    409,
  );
  const incomeTotals = earnings.income_totals;
  const totalCents = earnings.total;
  const reservedCents = withdrawals.rows
    .filter((row) => row.status !== "rejected")
    .reduce((sum, row) => sum + Math.round((row.sum_amount || 0) * 100), 0);
  const balanceCents = purchases.rows.reduce(
    (sum, row) =>
      sum +
      (["paid", "received"].includes(row.status)
        ? Math.round((row.sum_balance_credit || 0) * 100)
        : 0) -
      (row.status !== "rejected"
        ? Math.round((row.sum_balance_used || 0) * 100)
        : 0),
    0,
  );
  const activeStock = stock.filter((item) => item.qty !== 0);
  return {
    account: account
      ? { user_id: account.user_id, tier: account.tier, active: account.active }
      : null,
    total: totalCents / 100,
    reserved: reservedCents / 100,
    available: Math.max(0, totalCents - reservedCents) / 100,
    income_totals: incomeTotals,
    balance: balanceCents / 100,
    purchase_count: purchases.rows.reduce((sum, row) => sum + row.count, 0),
    is_first: !purchases.rows.some(
      (row) => row.status !== "rejected" && row.count > 0,
    ),
    sales_count: sales.rows.reduce((sum, row) => sum + row.count, 0),
    receipts:
      sales.rows
        .filter((row) => row.status === "completed")
        .reduce(
          (sum, row) => sum + Math.round((row.sum_received_amount || 0) * 100),
          0,
        ) / 100,
    stock_types: stock.length,
    stock_qty: activeStock.reduce((sum, item) => sum + item.qty, 0),
    stock_cost:
      Math.round(
        activeStock.reduce((sum, item) => sum + item.stock_cost * 100, 0),
      ) / 100,
    stock_on_hand: stock.reduce((sum, item) => sum + item.on_hand, 0),
    stock_reserved: stock.reduce((sum, item) => sum + item.reserved, 0),
    ...stockPage(stock, offset),
  };
}
