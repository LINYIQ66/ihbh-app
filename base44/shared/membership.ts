import { requireThat, transact } from "./transactions.ts";
export const plans = {
  standard: { price: "price_1UEKPeLfGbLosfGy9p6WFgHA", fee: 1500 },
  vip: { price: "price_1UEKPeLfGbLosfGyiaOzlXTx", fee: 5000 },
  prestige: { price: "price_1UEKPfLfGbLosfGyUzVs6V27", fee: 50000 },
};
export const packages = {
  standard: { price: "price_1UJaKuLfGbLosfGyfNyiP6MZ", fee: 1500 },
  vip: { price: "price_1UJaKuLfGbLosfGyvNZTfz2E", fee: 5000 },
};
const rank = { standard: 0, vip: 1, prestige: 2 };
export async function applyMembership(
  client,
  buyer,
  session,
  lineItems,
  appId,
) {
  const m = session.metadata || {},
    sandbox = !!m.package_tier,
    tier = m.membership_tier || m.package_tier,
    plan = (sandbox ? packages : plans)[tier];
  requireThat(
    plan &&
      m.base44_app_id === appId &&
      session.mode === "payment" &&
      session.payment_status === "paid",
    "Unexpected membership payment",
  );
  requireThat(
    session.currency === "sgd" &&
      session.amount_total === plan.fee * 100 &&
      lineItems.length === 1 &&
      lineItems[0].price?.id === plan.price &&
      lineItems[0].quantity === 1,
    "Unexpected price or amount",
  );
  requireThat(
    !sandbox || !session.livemode,
    "Package checkout must be sandbox",
  );
  requireThat(
    buyer.id === (m.membership_user_id || m.package_user_id) &&
      session.client_reference_id === buyer.id,
    "Buyer mismatch",
  );
  const status = session.livemode ? "paid" : "test";
  return transact(
    client,
    "User",
    buyer.id,
    `stripe:${session.id}`,
    { session: session.id },
    (state) => {
      const previous = state.membership;
      // A test purchase cannot override live entitlement, and replaying an older
      // lower tier cannot downgrade a paid higher tier.
      if (
        previous &&
        ((previous.payment_status === "paid" && status === "test") ||
          (previous.payment_status === status &&
            rank[previous.tier] >= rank[tier]))
      )
        return { result: { ignored: true } };
      const profile = {
        user_id: buyer.id,
        name: buyer.full_name || buyer.email,
        email: buyer.email,
        tier,
        membership_fee: plan.fee,
        payment_status: status,
        stripe_customer_id:
          typeof session.customer === "string" ? session.customer : "",
        stripe_session_id: session.id,
        joined_at: new Date(session.created * 1000).toISOString(),
      };
      state.membership = profile;
      return {
        drafts: [{ entity: "MemberProfile", data: profile }],
        result: { tier, payment_status: status },
      };
    },
  );
}
