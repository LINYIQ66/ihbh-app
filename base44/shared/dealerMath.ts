export class FinanceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export function cents(value) {
  const text = String(value);
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(text))
    throw new FinanceError("金额必须为非负数，且最多两位小数");
  const [whole, fraction = ""] = text.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}
export function percent(base, rate) {
  if (
    !Number.isSafeInteger(base) ||
    base < 0 ||
    !Number.isInteger(rate) ||
    rate < 0 ||
    rate > 100
  )
    throw new FinanceError("分润基数或比例无效");
  // Integer cents, per-beneficiary half-up rounding. Avoid binary float products.
  const result = Number((BigInt(base) * BigInt(rate) + 50n) / 100n);
  if (!Number.isSafeInteger(result))
    throw new FinanceError("分润金额超出安全范围");
  return result;
}
export const saleOwner = (id) => ({
  $or: [
    { dealer_user_id: id },
    {
      $and: [
        { created_by_id: id },
        {
          $or: [
            { dealer_user_id: { $exists: false } },
            { dealer_user_id: null },
            { dealer_user_id: "" },
          ],
        },
      ],
    },
  ],
});
export const postedQuery = (id) => ({
  user_id: id,
  transaction_status: { $ne: "prepared" },
  $or: [{ posting_status: "posted" }, { posting_status: { $exists: false } }],
});
export const componentTypes = {
  margin: "direct",
  rebate: "service",
  referral: "referral",
  downline: "downline",
  share: "downline",
  reward_cost: "settlement",
};
export function allocations({
  seller,
  parents = [],
  referrers = [],
  received,
  cost,
  category,
  first,
}) {
  const ranks = { partner: 0, official: 1, agent: 2 };
  if (
    !seller?.user_id ||
    ranks[seller.tier] === undefined ||
    !["general", "genecells"].includes(category) ||
    !Number.isSafeInteger(received) ||
    received < 0 ||
    !Number.isSafeInteger(cost) ||
    cost < 0 ||
    typeof first !== "boolean"
  )
    throw new FinanceError("分润输入或经销等级无效");
  const seen = new Set([seller.user_id]);
  let rank = ranks[seller.tier];
  for (const p of parents) {
    if (
      !p.user_id ||
      seen.has(p.user_id) ||
      ranks[p.tier] === undefined ||
      ranks[p.tier] >= rank
    )
      throw new FinanceError("渠道上级必须逐级升高且不能重复", 409);
    seen.add(p.user_id);
    rank = ranks[p.tier];
  }
  for (const r of referrers.slice(0, 3)) {
    if (!r.user_id || seen.has(r.user_id) || r.tier !== seller.tier)
      throw new FinanceError("同级介绍关系重复或等级不一致", 409);
    seen.add(r.user_id);
  }
  const rows = [];
  const add = (user, component, amount, rate, note, funding = {}) => {
    if (user && amount !== 0)
      rows.push({
        user_id: user,
        component,
        amount_cents: amount,
        rate,
        note,
        ...funding,
      });
  };
  add(
    seller.user_id,
    "margin",
    received - cost,
    0,
    "商品毛差额：实收金额减实际进货成本（先进先出）",
  );
  if (category === "general") {
    const rate = { partner: 30, official: 20, agent: 10 }[seller.tier];
    add(
      seller.user_id,
      "rebate",
      percent(received, rate),
      rate,
      `全业产品返利 ${rate}%`,
    );
    const official =
      seller.tier === "agent"
        ? parents.find((p) => p.tier === "official")
        : null;
    const partner =
      seller.tier !== "partner"
        ? parents.find((p) => p.tier === "partner")
        : null;
    add(
      official?.user_id,
      "share",
      percent(received, 10),
      10,
      "下级总代成交的官方渠道分润 10%",
    );
    add(
      partner?.user_id,
      "share",
      percent(received, 10),
      10,
      "下级渠道成交的合伙人渠道分润 10%",
    );
  }
  let payer;
  if (received > 0 && referrers.length) {
    if (seller.tier === "partner") {
      if (seller.referral_funding === "designated") {
        payer = seller.referral_payer;
        if (
          !payer?.user_id ||
          payer.user_id === seller.user_id ||
          payer.tier !== "partner"
        )
          throw new FinanceError("指定奖励承担方无效", 409);
      } else if (seller.referral_funding !== "headquarters")
        throw new FinanceError("合伙人平级奖励承担方尚未确认", 409);
    } else {
      payer = parents[0];
      const expected = seller.tier === "agent" ? "official" : "partner";
      if (!payer || payer.tier !== expected)
        throw new FinanceError("请先绑定承担回款奖励的直属上级", 409);
    }
  }
  let fundingCost = 0;
  referrers.slice(0, 3).forEach((referrer, index) => {
    const rate = [5, 3, 2][index];
    const amount = percent(received, rate);
    fundingCost += amount;
    add(
      referrer.user_id,
      "downline",
      amount,
      rate,
      `同级介绍第 ${index + 1} 级销售回款奖励 ${rate}%`,
      {
        payer_kind: payer ? "dealer" : "headquarters",
        payer_user_id: payer?.user_id || "",
      },
    );
  });
  if (payer && fundingCost)
    add(
      payer.user_id,
      "reward_cost",
      -fundingCost,
      0,
      "承担直属下级的同级介绍回款奖励（5%/3%/2%分别取分后合计）",
      { payer_kind: "dealer", payer_user_id: payer.user_id },
    );
  if (first && referrers[0])
    add(
      referrers[0].user_id,
      "referral",
      percent(received, 8),
      8,
      "HBH体验馆承担：同级介绍首笔有实收的完成销售，一次性居间奖励 8%",
      { payer_kind: "experience_hall", payer_user_id: "" },
    );
  return rows;
}
export async function getAccount(client, userId, required = true) {
  const { items } = await client.entities.DealerAccount.filter(
    { user_id: userId },
    { limit: 2 },
  );
  if (items.length > 1)
    throw new FinanceError("经销商身份重复，请管理员核对，暂不计算收益", 409);
  const account = items[0];
  if (required && !account?.active)
    throw new FinanceError("尚未开通有效经销商身份", 403);
  return account || null;
}
export async function chain(client, account, field, depth) {
  const rows = [];
  const seen = new Set([account.user_id]);
  let id = account[field];
  const ranks = { partner: 0, official: 1, agent: 2 };
  let previous = account;
  while (id && rows.length < depth) {
    if (seen.has(id))
      throw new FinanceError("经销商关系存在循环，请管理员修正", 409);
    seen.add(id);
    const next = await getAccount(client, id);
    if (field === "referrer_user_id" && next.tier !== account.tier)
      throw new FinanceError("同级介绍关系的等级不一致", 409);
    if (
      field === "parent_user_id" &&
      !(ranks[next.tier] < ranks[previous.tier])
    )
      throw new FinanceError("渠道上级等级必须逐级升高", 409);
    rows.push(next);
    previous = next;
    id = next[field];
  }
  return rows;
}
export async function acquire(client, entity, record, prefix) {
  const token = crypto.randomUUID();
  const now = Date.now();
  await client.entities[entity].updateMany(
    {
      id: record.id,
      $or: [
        { [`${prefix}_until`]: { $lte: now } },
        { [`${prefix}_until`]: { $exists: false } },
      ],
    },
    { $set: { [`${prefix}_token`]: token, [`${prefix}_until`]: now + 600000 } },
  );
  const claimed = await client.entities[entity].get(record.id);
  if (claimed[`${prefix}_token`] !== token)
    throw new FinanceError("该账户或订单正在处理，请稍后重试", 409);
  return token;
}
export async function release(client, entity, id, prefix, token) {
  await client.entities[entity].updateMany(
    { id, [`${prefix}_token`]: token },
    { $set: { [`${prefix}_token`]: "", [`${prefix}_until`]: 0 } },
  );
}
