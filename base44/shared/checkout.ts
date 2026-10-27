import { requireThat, requestKey } from "./transactions.ts";
import { plans, packages } from "./membership.ts";
export async function checkout(client, user, input, secrets, sandbox = false) {
  const tier = sandbox ? input.packageTier : input.tier,
    plan = (sandbox ? packages : plans)[tier];
  requireThat(plan, "Invalid membership tier");
  const key = secrets.get("STRIPE_SECRET_KEY");
  requireThat(
    !sandbox || key?.startsWith("sk_test_"),
    "Sandbox checkout unavailable",
    503,
  );
  const origin = new URL(
    secrets.get("APP_PUBLIC_ORIGIN") || "https://ihbh.kopiagent.ai",
  ).origin;
  requireThat(origin.startsWith("https://"), "Invalid public origin", 503);
  const ref = requestKey(input.ref),
    prefix = sandbox ? "package" : "membership";
  const body = new URLSearchParams({
    mode: "payment",
    "line_items[0][price]": plan.price,
    "line_items[0][quantity]": "1",
    customer_email: user.email,
    client_reference_id: user.id,
    success_url: `${origin}/crm?role=user&membership=success`,
    cancel_url: `${origin}/crm?role=user&membership=cancelled`,
    "metadata[base44_app_id]": secrets.get("BASE44_APP_ID"),
    [`metadata[${prefix}_tier]`]: tier,
    [`metadata[${prefix}_user_id]`]: user.id,
  });
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    signal: AbortSignal.timeout(20000),
    headers: {
      Authorization: `Bearer ${key}`,
      "Stripe-Version": "2025-10-29.clover",
      "Content-Type": "application/x-www-form-urlencoded",
      "Idempotency-Key": `${user.id}:${prefix}:${ref}`,
    },
    body,
  });
  const session = await response.json();
  requireThat(response.ok, "Unable to create checkout", 502);
  return { url: session.url };
}
