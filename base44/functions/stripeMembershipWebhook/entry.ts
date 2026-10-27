import Stripe from "npm:stripe@18.5.0";
import { createClientFromRequest } from "npm:@base44/sdk@0.8.57";
import { secrets } from "base44:runtime";
import { applyMembership } from "../../shared/membership.ts";
export default async function (req) {
  const stripe = new Stripe(secrets.get("STRIPE_SECRET_KEY"));
  let event;
  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("Missing signature");
    event = await stripe.webhooks.constructEventAsync(
      await req.text(),
      signature,
      secrets.get("STRIPE_WEBHOOK_SECRET"),
    );
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (
    ![
      "checkout.session.completed",
      "checkout.session.async_payment_succeeded",
    ].includes(event.type)
  )
    return Response.json({ received: true });
  try {
    const session = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
      ),
      m = session.metadata || {};
    if (
      session.payment_status !== "paid" ||
      !(m.membership_tier || m.package_tier)
    )
      return Response.json({ received: true });
    const client = createClientFromRequest(req).asServiceRole;
    const buyer = await client.entities.User.get(
      m.membership_user_id || m.package_user_id,
    );
    const lines = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    });
    if (lines.has_more) throw new Error("Unexpected line items");
    await applyMembership(
      client,
      buyer,
      session,
      lines.data,
      secrets.get("BASE44_APP_ID"),
    );
    return Response.json({ received: true });
  } catch (e) {
    console.error("stripeMembershipWebhook", event.id, e.message);
    return Response.json(
      { error: "Payment could not be reconciled" },
      { status: 500 },
    );
  }
}
