import { cents, saleOwner } from "./dealerMath.ts";
import { all, ownerQuery, requireThat } from "./transactions.ts";

export async function inventory(client, userId) {
  const [purchases, shipments] = await Promise.all([
    all(client, "PurchaseOrder", {
      ...ownerQuery(userId),
      transaction_status: { $ne: "prepared" },
      status: "received",
    }),
    all(client, "ShipOrder", {
      $and: [
        saleOwner(userId),
        {
          status: { $ne: "cancelled" },
          transaction_status: { $ne: "prepared" },
        },
      ],
    }),
  ]);
  return stockFromRecords(purchases, shipments);
}

export function stockFromRecords(purchases, shipments) {
  const products = new Map(),
    lots = new Map();
  for (const order of purchases) {
    requireThat(
      order.transaction_id || order.legacy_reviewed,
      "历史库存来源尚未核对，请完成采购迁移",
      409,
    );
    for (const [index, item] of (order.items || []).entries()) {
      requireThat(
        Number.isSafeInteger(item.qty) && item.qty > 0,
        "采购数量异常",
        409,
      );
      const cost = cents(item.price),
        lot_id = `${order.id}:${index}`;
      requireThat(!lots.has(lot_id), "采购批次重复", 409);
      const lot = {
        lot_id,
        product_id: item.product_id,
        qty: item.qty,
        cost,
        at: order.received_at || order.created_date || "",
        sale_category: item.sale_category,
      };
      lots.set(lot_id, lot);
      if (!products.has(item.product_id))
        products.set(item.product_id, {
          product_id: item.product_id,
          name: item.name,
          reserved: 0,
          lots: [],
        });
      products.get(item.product_id).lots.push(lot);
    }
  }
  for (const order of shipments) {
    if (order.status === "cancelled") continue;
    requireThat(
      ["shipped", "completed"].includes(order.status) &&
        Number.isSafeInteger(order.qty) &&
        order.qty > 0,
      "出货记录异常",
      409,
    );
    requireThat(
      Array.isArray(order.stock_allocations) &&
        order.stock_allocations.length > 0,
      "历史出货单缺少成本批次，请管理员核对批次后再交易",
      409,
    );
    let qty = 0,
      cost = 0;
    const seen = new Set();
    for (const allocation of order.stock_allocations) {
      const lot = lots.get(allocation.lot_id);
      requireThat(
        lot &&
          lot.product_id === order.product_id &&
          !seen.has(lot.lot_id) &&
          Number.isSafeInteger(allocation.qty) &&
          allocation.qty > 0 &&
          allocation.unit_cost_cents === lot.cost &&
          lot.qty >= allocation.qty,
        "出货成本批次或库存数量不一致",
        409,
      );
      seen.add(lot.lot_id);
      lot.qty -= allocation.qty;
      qty += allocation.qty;
      cost += allocation.qty * lot.cost;
    }
    requireThat(
      qty === order.qty &&
        cost === cents(order.cost_amount) &&
        Number.isSafeInteger(cost),
      "出货数量或历史成本不一致",
      409,
    );
    if (order.status === "shipped")
      products.get(order.product_id).reserved += qty;
  }
  return [...products.values()].map(stockPosition);
}

// Lots already have the exact reservations/completed allocations removed.
export function stockPosition(product) {
  const lots = [...product.lots]
    .filter((l) => l.qty > 0)
    .sort(
      (a, b) =>
        (a.at || "").localeCompare(b.at || "") ||
        (a.lot_id || "").localeCompare(b.lot_id || ""),
    );
  const qty = lots.reduce((n, l) => n + l.qty, 0),
    reserved = product.reserved || 0;
  return {
    product_id: product.product_id,
    name: product.name,
    qty,
    on_hand: qty + reserved,
    reserved,
    stock_cost: lots.reduce((n, l) => n + l.qty * l.cost, 0) / 100,
    lots,
  };
}

export function fifoAllocation(product, qty) {
  requireThat(
    Number.isSafeInteger(qty) && qty > 0 && product && product.qty >= qty,
    "库存不足或出货数量无效，请刷新后重试",
    409,
  );
  let remaining = qty,
    cost = 0;
  const allocations = [],
    categories = new Set();
  for (const lot of product.lots) {
    const take = Math.min(remaining, lot.qty);
    if (!take) continue;
    requireThat(
      lot.lot_id && ["general", "genecells"].includes(lot.sale_category),
      "采购批次缺少已核实的分润类别",
      409,
    );
    categories.add(lot.sale_category);
    allocations.push({
      lot_id: lot.lot_id,
      qty: take,
      unit_cost_cents: lot.cost,
    });
    cost += take * lot.cost;
    remaining -= take;
    if (!remaining) break;
  }
  requireThat(
    remaining === 0 && Number.isSafeInteger(cost),
    "库存批次不足或成本异常",
    409,
  );
  requireThat(categories.size === 1, "库存批次的分润类别不同，请拆分出货", 409);
  return { cost, allocations, category: [...categories][0] };
}
export function fifoCost(product, qty) {
  return fifoAllocation(product, qty).cost;
}
