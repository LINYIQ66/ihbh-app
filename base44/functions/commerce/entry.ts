import { createClientFromRequest } from "npm:@base44/sdk@0.8.57";
import { reviewRetail } from "../../shared/retail.ts";
import { tickets, dealerFinance } from "../../shared/commerce.ts";
import {
  transact,
  requireThat,
  requestKey,
} from "../../shared/transactions.ts";
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req),
      user = await base44.auth.me();
    if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
    const input = await req.json(),
      client = base44.asServiceRole;
    if (input.action === "review_order")
      return Response.json(await reviewRetail(client, user, input));
    if (input.action === "cancel_order")
      return Response.json(
        await transact(
          client,
          "User",
          user.id,
          requestKey(input.ref),
          input,
          async () => {
            const row = await client.entities.SalesOrder.get(input.id);
            requireThat(
              row.user_id === user.id && row.status === "paid",
              "订单不能申请取消",
              409,
            );
            return {
              effects: [
                {
                  entity: "SalesOrder",
                  id: row.id,
                  expected: { status: "paid" },
                  values: { status: "cancel_requested" },
                },
              ],
            };
          },
        ),
      );
    return Response.json(
      await (
        ["issue_ticket", "cancel_ticket", "verify_ticket"].includes(
          input.action,
        )
          ? tickets
          : dealerFinance
      )(client, user, input),
    );
  } catch (e) {
    console.error("commerce", e.message);
    return Response.json({ error: e.message }, { status: e.status || 500 });
  }
}
