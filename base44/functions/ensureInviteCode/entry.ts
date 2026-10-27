import { createClientFromRequest } from "npm:@base44/sdk@0.8.57";
import { transact, requireThat } from "../../shared/transactions.ts";
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req),
      user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const client = base44.asServiceRole;
    return Response.json(
      await transact(
        client,
        "User",
        user.id,
        "invite:initialize",
        {},
        async (state, record) => {
          if (record.invite_code)
            return {
              result: { inviteCode: record.invite_code, existing: true },
            };
          for (let i = 0; i < 8; i++) {
            const code = `GM${crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
            if (await client.entities.User.count({ invite_code: code }))
              continue;
            return {
              result: { inviteCode: code },
              effects: [
                {
                  entity: "User",
                  id: user.id,
                  expected: {
                    invite_code:
                      record.invite_code === undefined
                        ? { $exists: false }
                        : record.invite_code,
                  },
                  values: { invite_code: code },
                },
              ],
            };
          }
          requireThat(false, "Could not allocate invite code", 503);
        },
      ),
    );
  } catch (e) {
    return Response.json({ error: e.message }, { status: e.status || 500 });
  }
}
