export const kpis = {
  day: [['今日实收销售额', 'Sales collected', 'S$28,650'], ['待结算佣金', 'Pending commission', 'S$3,280'], ['有效会员', 'Active members', '1,286'], ['会员储值余额', 'Stored value', 'S$186,500']],
  week: [['本周实收销售额', 'Sales collected', 'S$172,400'], ['待结算佣金', 'Pending commission', 'S$19,860'], ['有效会员', 'Active members', '1,286'], ['会员储值余额', 'Stored value', 'S$186,500']],
  month: [['本月实收销售额', 'Sales collected', 'S$684,900'], ['待结算佣金', 'Pending commission', 'S$78,420'], ['有效会员', 'Active members', '1,286'], ['会员储值余额', 'Stored value', 'S$186,500']],
};
export const trend = /** @type {Array<[string, string, number]>} */ ([['一', 'Mon', 21], ['二', 'Tue', 24], ['三', 'Wed', 19], ['四', 'Thu', 27], ['五', 'Fri', 31], ['六', 'Sat', 22], ['日', 'Sun', 28.6]]);
export const modules = [
  ['ShoppingCart', '购物订单', 'Orders', '订单号、会员、商品、数量、实际成交价、进货成本、优惠、付款、配送、退款及订单状态。', 'Order no., member, items, qty, deal price, cost, discount, payment, delivery, refund, status.'],
  ['CreditCard', '支付财务', 'Payments', '整合 PayNow、银行卡及第三方支付，记录收款、手续费、退款、银行到账和每日对账差异。', 'PayNow, cards & 3rd-party: receipts, fees, refunds, bank settlement, daily variance.'],
  ['Users', '我的中心', 'My Center', '按普通会员、总代、官方、合伙人分类，保存充值、赠送、余额、消费、积分、等级及升级记录。', 'By User / Agent / Official / Partner: recharge, bonus, balance, spend, points, tier history.'],
  ['Percent', '佣金结算', 'Commissions', '按实际销售回款计算体验馆承担的 8% 一次性居间奖励、最多三级 5%/3%/2% 同级奖励，以及适用的全业分润。', 'Collected sales determine the experience hall’s one-time 8%, up to three peer rewards at 5/3/2%, and eligible general-category rebates.'],
  ['Wallet', '会员储值', 'Stored value', '支持 S$1,500 至 S$20,000 四档充值，实付与赠送分账记录，消费后自动扣减。', 'Four tiers S$1,500–20,000; paid and bonus booked separately, auto-deducted on spend.'],
  ['Activity', '渠道及体验', 'Channels', '统计代理客户数、业绩、氧舱预约及使用、直播引流、复购率与转化率。', 'Per-agent customers, sales, oxygen bookings, live leads, repurchase & conversion.'],
];
export const flow = [['客户支付', 'Customer pays'], ['订单确认', 'Order confirmed'], ['规则计算', 'Rules engine'], ['佣金账本', 'Commission ledger'], ['财务审核', 'Finance review'], ['银行打款', 'Bank payout']];
export const ledger = /** @type {Array<[string, string, string, string, number, string, number, string, string]>} */ ([
  ['GB10248', '陈女士', 'Ms Tan', '全养组合1', 3080, '同级第一级 5%', 154, '待审核', 'Pending'],
  ['GB10247', '李先生', 'Mr Lee', '全业商品（示例）', 1060, '合伙人全业 30%', 318, '已打款', 'Paid'],
  ['GB10245', '黄女士', 'Ms Wong', '首笔销售实收', 10000, '居间 8%', 800, '待体验馆付款', 'Experience hall to pay'],
  ['GB10241', '林先生', 'Mr Lim', '氧舱 10次卡', 1580, '退款冲回', -158, '已冲回', 'Reversed'],
]);
export const roles = [['总部', 'HQ', '全部资金、规则配置、审计日志', 'All funds, rule config, audit log'], ['渠道代理', 'Channel', '本人收益、下线业绩、客户', 'Own earnings, downline, customers'], ['会员', 'Member', '消费、储值、积分明细', 'Spend, stored value, points'], ['财务', 'Finance', '对账、审核、打款、追溯', 'Reconcile, review, payout, trace']];
