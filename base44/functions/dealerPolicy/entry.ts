import { createClientFromRequest } from "npm:@base44/sdk@0.8.57";
import { secrets } from "base44:runtime";
import {
  changeDealerPolicy,
  readDealerPolicy,
} from "../../shared/dealerPolicy.ts";
import { requireThat } from "../../shared/transactions.ts";
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req),
      user = await base44.auth.me();
    requireThat(user?.role === "admin", "仅管理员可查看分润配置", 403);
    const input = await req.json(),
      superAdminId = secrets.get("SUPER_ADMIN_USER_ID");
    if (input.action === "get")
      return Response.json({
        policy: await readDealerPolicy(base44.asServiceRole, superAdminId),
        can_manage: !!superAdminId && user.id === superAdminId,
      });
    return Response.json(
      await changeDealerPolicy(base44.asServiceRole, user, superAdminId, input),
    );
  } catch (e) {
    return Response.json({ error: e.message }, { status: e.status || 500 });
  }
}
