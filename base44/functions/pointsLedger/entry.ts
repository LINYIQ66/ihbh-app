import { createClientFromRequest } from "npm:@base44/sdk@0.8.57";
import { points } from "../../shared/commerce.ts";
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req),
      user = await base44.auth.me();
    if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
    return Response.json(
      await points(base44.asServiceRole, user, await req.json()),
    );
  } catch (e) {
    console.error("pointsLedger", e.message);
    return Response.json({ error: e.message }, { status: e.status || 500 });
  }
}
