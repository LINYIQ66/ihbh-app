import { componentTypes } from "./dealerMath.ts";
import { singaporeDay } from "./dealerReporting.ts";
import { all, requireThat, snapshot, transact } from "./transactions.ts";

export async function postSettlement(client, orderId) {
  // Complete any pre-upgrade outbox before inspecting its status.
  const { record: order } = await snapshot(client, "ShipOrder", orderId);
  requireThat(
    order.status === "completed" &&
      order.dealer_user_id &&
      Number.isFinite(order.cost_amount) &&
      order.completed_at,
    "订单缺少已完成状态或成本凭据",
    409,
  );
  if (order.settlement_state === "posted") return { already_posted: true };
  requireThat(
    ["dealer-v3-2026-10-27", "dealer-v4-2026-10-27"].includes(
      order.settlement_rule_version,
    ) &&
      Array.isArray(order.settlement_snapshot),
    "历史订单需核对分润承担方与规则版本，不能直接重复入账",
    409,
  );
  const groups = new Map();
  for (const row of order.settlement_snapshot) {
    requireThat(
      row.user_id &&
        Number.isSafeInteger(row.amount_cents) &&
        componentTypes[row.component],
      "分润快照无效",
      409,
    );
    if (!groups.has(row.user_id)) groups.set(row.user_id, []);
    groups.get(row.user_id).push(row);
  }
  // Debit funding accounts before crediting recipients. Each account uses the
  // same User CAS as withdrawals, so a concurrent withdrawal must re-evaluate.
  const ordered = [...groups].sort(
    (a, b) =>
      Math.sign(a[1].reduce((s, r) => s + r.amount_cents, 0)) -
        Math.sign(b[1].reduce((s, r) => s + r.amount_cents, 0)) ||
      a[0].localeCompare(b[0]),
  );
  const earnedDay = singaporeDay(order.completed_at);
  for (const [uid, entries] of ordered) {
    await transact(
      client,
      "User",
      uid,
      `dealer:${orderId}`,
      { orderId, entries },
      async (state) => {
        const old = await all(client, "Earning", {
          user_id: uid,
          source_order_id: orderId,
          transaction_status: { $ne: "prepared" },
        });
        requireThat(
          !old.length,
          "存在无回执的历史分润，请管理员核对，避免重复记账",
          409,
        );
        state.dealer_postings = (state.dealer_postings || 0) + 1;
        return {
          drafts: entries.map((row, index) => ({
            entity: "Earning",
            data: {
              user_id: uid,
              amount: row.amount_cents / 100,
              type: componentTypes[row.component],
              component: row.component,
              period: earnedDay.slice(0, 7),
              earned_day: earnedDay,
              note: `${order.name} ×${order.qty}；${row.note}`,
              source_order_id: orderId,
              posting_key: `${orderId}:${uid}:${index}`,
              posting_status: "pending",
              base_amount: order.received_amount,
              rate: row.rate,
              payer_kind: row.payer_kind || "",
              payer_user_id: row.payer_user_id || "",
            },
            publish: { posting_status: "posted" },
          })),
          result: { posted: true, entries: entries.length },
        };
      },
    );
  }
  await client.entities.ShipOrder.updateMany(
    {
      id: orderId,
      status: "completed",
      settlement_rule_version: order.settlement_rule_version,
    },
    {
      $set: {
        settlement_state: "posted",
        settlement_error: "",
        finance_pending: "",
        completed_day: earnedDay,
      },
    },
  );
  return { posted: true, entries: order.settlement_snapshot.length };
}
