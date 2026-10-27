import { transact, requireThat } from "./transactions.ts";
import { postSettlement } from "./dealerSettlement.ts";
import { cents, allocations, getAccount, chain } from "./dealerMath.ts";
import { inventory, fifoAllocation } from "./dealerInventory.ts";
import { singaporeDay } from "./dealerReporting.ts";
import { resolvePartnerFunding } from "./dealerPolicy.ts";
const idValid = (id) => typeof id === "string" && /^[a-f0-9]{24}$/.test(id);
async function loadOrder(client, entity, id) {
  requireThat(idValid(id), "订单编号无效");
  return client.entities[entity].get(id);
}
export async function shipment(client, user, input) {
  await getAccount(client, user.id);
  requireThat(
    idValid(input.product_id) &&
      Number.isInteger(input.qty) &&
      input.qty > 0 &&
      input.qty <= 10000 &&
      ["sale", "self_use", "downline"].includes(input.kind),
    "商品或数量无效",
  );
  const amount = input.kind === "self_use" ? 0 : cents(input.amount);
  return transact(
    client,
    "User",
    user.id,
    input.idempotency_key,
    { ...input, amount },
    async () => {
      const prior = (
        await client.entities.ShipOrder.filter(
          {
            dealer_user_id: user.id,
            idempotency_key: input.idempotency_key,
            transaction_status: { $ne: "prepared" },
          },
          { limit: 1 },
        )
      ).items[0];
      if (prior) {
        requireThat(
          prior.product_id === input.product_id &&
            prior.qty === input.qty &&
            prior.kind === input.kind &&
            cents(prior.amount) === amount,
          "请求编号内容不一致",
          409,
        );
        return { result: { order_id: prior.id } };
      }
      const product = (await inventory(client, user.id)).find(
          (p) => p.product_id === input.product_id,
        ),
        allocation = fifoAllocation(product, input.qty),
        cost = allocation.cost,
        at = new Date().toISOString();
      return {
        drafts: [
          {
            entity: "ShipOrder",
            resultKey: "order_id",
            data: {
              product_id: input.product_id,
              name: product.name,
              qty: input.qty,
              kind: input.kind,
              customer: String(input.customer || "").slice(0, 200),
              amount: amount / 100,
              cost_amount: cost / 100,
              stock_allocations: allocation.allocations,
              sale_category: allocation.category,
              dealer_user_id: user.id,
              idempotency_key: input.idempotency_key,
              status: input.kind === "self_use" ? "completed" : "shipped",
              ...(input.kind === "self_use"
                ? {
                    completed_at: at,
                    completed_day: singaporeDay(at),
                    received_amount: 0,
                    settlement_state: "posted",
                    settlement_snapshot: [],
                  }
                : { settlement_state: "pending", settlement_until: 0 }),
            },
          },
        ],
      };
    },
  );
}
export async function complete(
  client,
  user,
  input,
  options = { superAdminId: "" },
) {
  const row = await loadOrder(client, "ShipOrder", input.order_id);
  requireThat(
    row.dealer_user_id && Number.isFinite(row.cost_amount),
    "订单缺少经销商或成本",
    409,
  );
  const result = await transact(
    client,
    "User",
    row.dealer_user_id,
    `complete:${row.id}`,
    input,
    async () => {
      const order = await loadOrder(client, "ShipOrder", row.id);
      if (order.status === "completed")
        return { result: { completed: true, already_completed: true } };
      requireThat(
        order.status === "shipped" &&
          Array.isArray(order.stock_allocations) &&
          order.stock_allocations.length > 0 &&
          ["general", "genecells"].includes(order.sale_category) &&
          input.receipt_confirmed === true,
        "请核实状态、实收和产品类别",
        409,
      );
      requireThat(
        !input.sale_category || input.sale_category === order.sale_category,
        "分润类别由采购批次决定，不可在结算时改选",
        409,
      );
      await inventory(client, order.dealer_user_id);
      const received = cents(input.received_amount),
        seller = await getAccount(client, order.dealer_user_id);
      const first =
        received > 0 &&
        (await client.entities.ShipOrder.count({
          dealer_user_id: seller.user_id,
          status: "completed",
          kind: { $ne: "self_use" },
          received_amount: { $gt: 0 },
          transaction_status: { $ne: "prepared" },
        })) === 0;
      const [parents, referrers] = await Promise.all([
        chain(client, seller, "parent_user_id", 2),
        chain(client, seller, "referrer_user_id", 3),
      ]);
      if (seller.tier === "partner" && referrers.length && received > 0)
        Object.assign(
          seller,
          await resolvePartnerFunding(client, seller, options.superAdminId),
        );
      const snapshot = allocations({
          seller,
          parents,
          referrers,
          received,
          cost: cents(order.cost_amount),
          category: order.sale_category,
          first,
        }),
        at = new Date().toISOString();
      return {
        effects: [
          {
            entity: "ShipOrder",
            id: order.id,
            expected: { status: "shipped" },
            values: {
              status: "completed",
              received_amount: received / 100,
              sale_category: order.sale_category,
              settlement_rule_version: "dealer-v4-2026-10-27",
              settlement_context: {
                seller,
                parents,
                referrers,
                received_cents: received,
                cost_cents: cents(order.cost_amount),
                category: order.sale_category,
                first,
              },
              verified_by: user.id,
              completed_at: at,
              completed_day: singaporeDay(at),
              first_paid_sale: first,
              settlement_snapshot: snapshot,
              settlement_state: "pending",
              settlement_until: 0,
              settlement_error: "",
            },
          },
        ],
        result: { completed: true },
      };
    },
  );
  await postSettlement(client, row.id);
  return result;
}
