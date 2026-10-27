import React from 'react';
import { Building2, Gift, Handshake, ReceiptText, Wind } from 'lucide-react';
import { getDealerTier } from '@/components/globest/dealer/dealerTierData';

export default function DealerTierBenefits({ level }) {
  const tier = getDealerTier(level);
  const benefits = [
    { icon: Gift, title: `适用全业产品返利 ${tier.rebate}%`, text: '适用于制度列明的自用或直接关系成交，包括九珍堂滋养系列、氧舱及部分设备。GeneCells 三款产品除外；返利不是商品直接打折，不与消费会员体系同时使用，计算基准及结算条件须确认。' },
    { icon: Wind, title: `每月氧舱体验 ${tier.oxygen} 次`, text: '按月清零，不可累积至下月。适用门店、具体预约安排与可用情况，以门店及正式合作条款确认结果为准。' },
    { icon: Building2, title: '渠道协作与经营定位', text: tier.channel },
    { icon: Handshake, title: '平级介绍与销售回款规则', text: `现有制度列明平级介绍一次性居间奖励 8%，以及三代销售回款奖励 5% / 3% / 2%，只支付最近三位同级介绍人。销售回款奖励由${tier.payerZh.replace(/支付$/, '')}支付；8% 按首笔销售实收只计一次，由 HBH 体验馆支付；适用项目可叠加，承担方同步记支出，不代表固定收入。` }
  ];
  return <section aria-labelledby="dealer-benefits-title" className="rounded-2xl border border-border bg-card p-5 sm:p-7">
    <div className="mb-5 flex items-center gap-3"><ReceiptText size={20} className="text-primary" aria-hidden="true"/><h2 id="dealer-benefits-title" className="font-heading text-xl font-semibold">{tier.zh}专属权益说明</h2></div>
    <div className="grid gap-4 md:grid-cols-2">{benefits.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-xl border border-border p-4"><div className="mb-3 flex items-center gap-2"><Icon size={18} className="shrink-0 text-primary" aria-hidden="true"/><h3 className="text-sm font-semibold">{title}</h3></div><p className="text-sm leading-7 text-muted-foreground">{text}</p></article>)}</div>
    <div className="mt-5 space-y-2 rounded-xl bg-muted/60 p-4 text-xs leading-6 text-muted-foreground"><h3 className="font-semibold text-foreground">适用条件与权益边界</h3><p>具体入驻资格、首单及补货条件、区域与渠道授权，需按正式协议和审核结果确认；本页不自动授予等级、发放体验次数或触发返利结算。</p><p>经销权益不与消费会员充值体系及其他活动同时使用。商品差价为毛额，并非扣除税费、物流、人工等成本后的净利润；推荐及分润安排仍须完成适用条件与合规审查。</p></div>
  </section>;
}