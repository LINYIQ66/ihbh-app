import { ledger, requestKey, requireThat, transact } from "./transactions.ts";

export async function reviewRetail(client, admin, input) {
  requireThat(admin.role === "admin", "仅管理员可处理商城订单", 403);
  const record = await client.entities.SalesOrder.get(input.id);
  requireThat(record.transaction_status === "posted", "订单尚未完成入账", 409);
  return transact(
    client,
    "User",
    record.user_id,
    requestKey(input.ref),
    input,
    async (state) => {
      const order = await client.entities.SalesOrder.get(record.id);
      requireThat(
        ["paid", "cancel_requested"].includes(order.status),
        "订单状态已变化",
        409,
      );
      const effects = [],
        drafts = [];
      if (input.status === "cancelled") {
        requireThat(
          input.refund_confirmed === true,
          "请确认取消订单并退还积分",
        );
        const net = order.points - (order.reward || 0);
        requireThat(
          Number.isSafeInteger(net) && net >= 0,
          "订单积分记录无效",
          409,
        );
        state.lifetime = Math.max(0, state.lifetime - (order.reward || 0));
        drafts.push(
          ledger(
            state,
            order.user_id,
            net,
            "adjust",
            `refund:${order.id}`,
            "订单取消，退还支付积分并扣回购物奖励",
          ),
        );
        if (order.coupon_id) {
          const coupon = await client.entities.Ticket.get(order.coupon_id);
          if (
            coupon.status === "used" &&
            coupon.checkout_ref === order.payment_ref
          )
            effects.push({
              entity: "Ticket",
              id: coupon.id,
              expected: { status: "used", checkout_ref: order.payment_ref },
              values: { status: "unused", used_at: "", checkout_ref: "" },
            });
        }
      } else
        requireThat(
          input.status === "shipped" && order.status === "paid",
          "请先处理取消申请",
          409,
        );
      effects.push({
        entity: "SalesOrder",
        id: order.id,
        expected: { status: order.status },
        values: {
          status: input.status,
          reviewed_by: admin.id,
          review_note: String(input.note || "").slice(0, 500),
        },
      });
      return { drafts, effects };
    },
  );
}
