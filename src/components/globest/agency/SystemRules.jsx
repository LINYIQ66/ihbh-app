import React from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import TierPricing from './TierPricing';
import RewardCalculator from './RewardCalculator';
import ShareAndMember from './ShareAndMember';
import RiskConclusion from './RiskConclusion';

const Sub = ({ n, title, children }) => <div className="space-y-2"><h3 className="font-bold text-[#8a5a2b]">{n}、{title}</h3>{children}</div>;
export default function SystemRules() {
  const { t } = useExperience();
  return <section className="space-y-5 rounded-3xl bg-[#fbf6ee] p-4">
    <div><h2 className="text-xl font-bold">{t('HBH 全球健康好物体验馆：制度', 'HBH Global Wellness Hub: Business Rules')}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t('HBH 采用合伙人、官方、总代、用户四级销售体系，结合商品差价、三级推荐奖励、销售分润、会员充值和线下引流，形成完整商业模式。', 'HBH runs a 4-tier system (Partner, Official, Agent, User) combining price spread, 3-level referral rewards, profit sharing, member recharge and offline traffic.')}</p></div>
    <Sub n="一" title={t('商品价格制度', 'Pricing')}><TierPricing /><p className="text-xs text-muted-foreground">{t('全业产品按实收计算合伙人 30%、官方 20%、总代 10% 返利。', 'General products: Partner 30%, Official 20%, Agent 10% of collected sales.')}</p></Sub>
    <Sub n="二" title={t('三级推荐奖励', '3-level referral rewards')}><RewardCalculator /></Sub>
    <Sub n="三 · 四" title={t('产品销售分润 · 会员充值', 'Profit sharing · Membership')}><ShareAndMember /></Sub>
    <Sub n="五" title={t('客户引流', 'Customer acquisition')}><p className="rounded-2xl border bg-card p-4 text-sm">{t('通过直播、门店体验、氧舱优惠、APP 及推荐成交返款吸引客户。例如购买 S$588 野山参或 S$268 陈皮，并成功推荐两人购买同款，可获得原购买金额返还。合伙人每月免费使用氧舱 20 次、官方 5 次、总代 2 次，当月未用不累计。', 'Live streams, store trials, oxygen offers, the app and referral refunds. Buy S$588 ginseng or S$268 Chenpi and refer two same purchases for a full refund. Free oxygen: Partner 20, Official 5, Agent 2 per month, no carryover.')}</p></Sub>
    <Sub n="六" title={t('数字逻辑与制度风险', 'Numbers & risks')}><RiskConclusion /></Sub>
  </section>;
}