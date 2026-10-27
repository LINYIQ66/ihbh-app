import { createClientFromRequest } from "npm:@base44/sdk@0.8.57";
import { secrets } from "base44:runtime";
import { checkout } from "../../shared/checkout.ts";
export default async function (req) {
  try {
    const client = createClientFromRequest(req),
      user = await client.auth.me();
    if (!user?.email)
      return Response.json({ error: "Please sign in" }, { status: 401 });
    return Response.json(
      await checkout(client, user, await req.json(), secrets, true),
    );
  } catch (e) {
    return Response.json({ error: e.message }, { status: e.status || 500 });
  }
}
