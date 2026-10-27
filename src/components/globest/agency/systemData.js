export const tiers = [
  { zh: '合伙人', en: 'Partner', price: 160, w: 'w-2/5' },
  { zh: '官方', en: 'Official', price: 300, w: 'w-3/5' },
  { zh: '总代', en: 'General Agent', price: 430, w: 'w-4/5' },
  { zh: '用户', en: 'User', price: 530, w: 'w-full' },
];
export const margins = /** @type {Array<[string, string, number, number]>} */ ([
  ['合伙人 → 用户', 'Partner → User', 160, 530], ['合伙人 → 官方', 'Partner → Official', 160, 300], ['合伙人 → 总代', 'Partner → Agent', 160, 430],
  ['官方 → 总代', 'Official → Agent', 300, 430], ['官方 → 用户', 'Official → User', 300, 530], ['总代 → 用户', 'Agent → User', 430, 530],
]);
export const rewardLevels = /** @type {Array<[string, string, number]>} */ ([['直接同级介绍人', 'Direct peer referrer', 5], ['第二级', '2nd level', 3], ['第三级', '3rd level', 2]]);
export const shareScenarios = /** @type {Array<[string, string, number, number, number]>} */ ([
  ['合伙人自用 / 直推成交', 'Partner self-use / direct', 30, 0, 0],
  ['下线官方带来消费', 'Downline Official refers', 10, 20, 0],
  ['下线总代带来消费', 'Downline Agent refers', 10, 10, 10],
  ['总代直接成交', 'Agent direct sale', 0, 0, 10],
]);
export const risks = [
  ['差价 ≠ 净利润', 'Margin ≠ net profit', '商品差价为毛收入，需扣除租金、人工、物流、税费及返款成本后才是净利润。', 'Price spread is gross; rent, staff, logistics, tax and refund costs must be deducted.'],
  ['首单奖励基数', 'First-sale bonus base', '8% 按被介绍经销商首笔有实收的完成销售计算，只支付一次，所有等级的居间费均由 HBH 体验馆支付。', 'The HBH experience hall funds 8% of the referred dealer’s first completed paid sale, once only.'],
  ['返利计算基数', 'Rebate base', '全业 30% / 20% / 10% 按已核实的销售实收计算；GeneCells 不计全业渠道返利。', '30% / 20% / 10% uses verified collected sales; GeneCells is excluded from these channel rebates.'],
  ['奖励承担方', 'Reward funding', '适用收益可叠加；官方/总代的三级奖励分别由其直属合伙人/官方承担，承担方同时记支出。合伙人平级奖励由超级管理员选择总部或指定上级承担。', 'Eligible earnings stack. Peer rewards for Officials/Agents are charged to their direct Partner/Official. Super admin selects HQ or a designated payer for Partner peer rewards.'],
  ['会员赠额负债', 'Bonus liability', '充值赠额与赠品属于未来履约负担，应计入预收负债。', 'Recharge bonuses and gifts are future obligations and should be booked as liabilities.'],
  ['合规审查', 'Compliance review', '需审查新加坡《多层次营销及金字塔销售（禁止）法》及消费者保护（公平交易）法相关要求。', 'Review Singapore Multi-Level Marketing & Pyramid Selling (Prohibition) Act and CPFTA.'],
];