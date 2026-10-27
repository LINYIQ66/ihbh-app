import { stockFromRecords } from "./dealerInventory.ts";
import {
  all,
  ownerQuery,
  requireThat,
  transact,
  requestKey,
} from "./transactions.ts";
import { saleOwner } from "./dealerMath.ts";
export async function reconcileStock(client, admin, userId, input) {
  requireThat(admin.role === "admin", "仅管理员可核对库存", 403);
  requireThat(
    input.confirmed === true && input.reason?.trim().length >= 10,
    "请提供核对凭据说明",
  );
  requireThat(
    Array.isArray(input.orders) &&
      input.orders.length > 0 &&
      input.orders.length <= 1000,
    "请提供待核对出货单的批次分配",
  );
  return transact(
    client,
    "User",
    userId,
    requestKey(input.ref),
    { ...input, reviewer: admin.id },
    async () => {
      const purchases = await all(client, "PurchaseOrder", {
        ...ownerQuery(userId),
        status: "received",
        transaction_status: { $ne: "prepared" },
      });
      const shipments = await all(client, "ShipOrder", {
        $and: [
          saleOwner(userId),
          {
            status: { $ne: "cancelled" },
            transaction_status: { $ne: "prepared" },
          },
        ],
      });
      const changes = new Map(
        input.orders.map((row) => [row.id, row.stock_allocations]),
      );
      requireThat(changes.size === input.orders.length, "出货单重复");
      for (const id of changes.keys())
        requireThat(
          shipments.some((o) => o.id === id && !o.stock_allocations?.length),
          "只能补录本人的历史缺失批次",
        );
      const merged = shipments.map((o) =>
        changes.has(o.id) ? { ...o, stock_allocations: changes.get(o.id) } : o,
      );
      stockFromRecords(purchases, merged); // verifies exact quantities, costs and no lot overuse
      const lots = new Map(
        purchases.flatMap((p) => p.items.map((i, n) => [`${p.id}:${n}`, i])),
      );
      const effects = merged
        .filter((o) => changes.has(o.id))
        .map((o) => {
          const categories = new Set(
            o.stock_allocations.map((a) => lots.get(a.lot_id)?.sale_category),
          );
          requireThat(
            categories.size === 1 &&
              ["general", "genecells"].includes([...categories][0]),
            "请先核对采购批次的分润类别",
          );
          return {
            entity: "ShipOrder",
            id: o.id,
            expected: { status: o.status },
            values: {
              stock_allocations: o.stock_allocations,
              sale_category: [...categories][0],
              stock_reviewed_by: admin.id,
              stock_review_note: input.reason,
            },
          };
        });
      return { effects, result: { reviewed: effects.length } };
    },
  );
}
