import { getAccount } from "./dealerMath.ts";
import { requestKey, requireThat, transact } from "./transactions.ts";

export async function readDealerPolicy(client, superAdminId) {
  if (!superAdminId)
    return { partner_funding: "unconfigured", version: 0, payers: {} };
  const owner = await client.entities.User.get(superAdminId);
  requireThat(owner.role === "admin", "超级管理员账户配置无效", 503);
  return (
    owner.finance_state?.dealer_policy || {
      partner_funding: "unconfigured",
      version: 0,
      payers: {},
    }
  );
}
export async function changeDealerPolicy(client, actor, superAdminId, input) {
  requireThat(
    superAdminId && actor.role === "admin" && actor.id === superAdminId,
    "仅指定的超级管理员可修改分润承担方",
    403,
  );
  requireThat(
    input.confirmed === true &&
      typeof input.reason === "string" &&
      input.reason.trim().length >= 10,
    "请确认变更并填写至少10字的说明",
  );
  return transact(
    client,
    "User",
    superAdminId,
    requestKey(input.ref),
    { ...input, reviewer: actor.id },
    async (state) => {
      const policy = state.dealer_policy || {
        partner_funding: "unconfigured",
        version: 0,
        payers: {},
      };
      if (input.action === "set_mode") {
        requireThat(
          ["headquarters", "designated"].includes(input.mode),
          "请选择总部承担或指定上级承担",
        );
        policy.partner_funding = input.mode;
      } else {
        requireThat(
          input.action === "assign_payer" &&
            input.user_id !== input.payer_user_id,
          "指定承担方不能是本人",
        );
        const [seller, payer] = await Promise.all([
          getAccount(client, input.user_id),
          getAccount(client, input.payer_user_id),
        ]);
        requireThat(
          seller.tier === "partner" && payer.tier === "partner",
          "请为合伙人选择有效的上级合伙人账户",
        );
        policy.payers = { ...policy.payers, [seller.user_id]: payer.user_id };
      }
      policy.version += 1;
      policy.updated_by = actor.id;
      policy.updated_at = new Date().toISOString();
      policy.reason = input.reason.trim();
      state.dealer_policy = policy;
      return { result: { policy } };
    },
  );
}
export async function resolvePartnerFunding(client, seller, superAdminId) {
  const policy = await readDealerPolicy(client, superAdminId);
  requireThat(
    ["headquarters", "designated"].includes(policy.partner_funding),
    "请超级管理员先设置合伙人平级奖励承担方式",
    409,
  );
  let payer;
  if (policy.partner_funding === "designated") {
    const uid = policy.payers[seller.user_id];
    requireThat(
      uid && uid !== seller.user_id,
      "请超级管理员先指定该合伙人的奖励承担方",
      409,
    );
    payer = await getAccount(client, uid);
    requireThat(
      payer.tier === "partner",
      "指定承担方的合伙人身份已变化，请重新核对",
      409,
    );
  }
  return {
    referral_funding: policy.partner_funding,
    referral_payer: payer,
    funding_policy_version: policy.version,
  };
}
