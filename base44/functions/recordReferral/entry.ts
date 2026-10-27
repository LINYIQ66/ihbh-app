import { createClientFromRequest } from "npm:@base44/sdk@0.8.57";
import { transact, ledger, requireThat } from "../../shared/transactions.ts";
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req),
      user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const client = base44.asServiceRole,
      { inviteCode } = await req.json(),
      code = String(inviteCode || "")
        .trim()
        .toUpperCase();
    requireThat(/^GM[A-Z0-9]{8}$/.test(code), "Invalid invite code");
    const result = await transact(
      client,
      "User",
      user.id,
      "referral:binding",
      { code },
      async (state) => {
        requireThat(!state.referral, "已绑定邀请关系", 409);
        const rows = (
          await client.entities.User.filter({ invite_code: code }, { limit: 2 })
        ).items;
        requireThat(
          rows.length === 1 && rows[0].id !== user.id,
          "Invite code not found",
        );
        const existing = (
          await client.entities.Referral.filter(
            {
              invitee_user_id: user.id,
              transaction_status: { $ne: "prepared" },
            },
            { limit: 1 },
          )
        ).items;
        requireThat(!existing.length, "历史邀请关系已存在", 409);
        state.referral = { inviter: rows[0].id, code };
        return {
          result: state.referral,
          drafts: [
            {
              entity: "Referral",
              data: {
                inviter_user_id: rows[0].id,
                invitee_user_id: user.id,
                invitee_email: user.email,
                invite_code: code,
                status: "registered",
                registered_at: new Date().toISOString(),
              },
            },
          ],
          effects: [
            {
              entity: "User",
              id: user.id,
              expected: {},
              values: { referred_by_code: code },
            },
          ],
        };
      },
    );
    await transact(
      client,
      "User",
      result.inviter,
      `referral-inviter:${user.id}`,
      { invitee: user.id },
      (state) => ({
        drafts: [
          ledger(
            state,
            result.inviter,
            100,
            "referral",
            `referral-inviter:${user.id}`,
            "邀请奖励",
          ),
        ],
      }),
    );
    await transact(
      client,
      "User",
      user.id,
      "referral:reward",
      { inviter: result.inviter },
      (state) => ({
        drafts: [
          ledger(
            state,
            user.id,
            50,
            "referral",
            `referral-invitee:${user.id}`,
            "受邀奖励",
          ),
        ],
      }),
    );
    return Response.json({ recorded: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: e.status || 500 });
  }
}
