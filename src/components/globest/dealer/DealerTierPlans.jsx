import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Check, Crown, Users } from 'lucide-react';
import { dealerLevelKeys, getDealerTier } from '@/components/globest/dealer/dealerTierData';

const icons = { partner: Crown, official: Building2, agent: Users };
export default function DealerTierPlans() {
  return <section aria-labelledby="dealer-plans-title" className="mb-8 rounded-2xl border border-border bg-card p-5 sm:p-7">
    <div className="mb-6 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Building2 size={19} aria-hidden="true"/></span><div><h2 id="dealer-plans-title" className="font-heading text-xl font-semibold">经销商等级与专属权益</h2><p className="mt-1 text-sm text-muted-foreground">合伙人、官方、总代，查看各等级的专属拿货价与合作权益。</p></div></div>
    <div className="grid gap-4 md:grid-cols-3">{dealerLevelKeys.map(key => {
      const tier = getDealerTier(key); const Icon = icons[key];
      return <article key={key} className={`membership-plan flex flex-col rounded-xl border border-border p-5 ${key === 'official' ? 'featured' : ''}`}>
        <div className="flex items-center justify-between gap-2"><span className="text-xs font-medium tracking-wide text-primary">{tier.label}</span><Icon size={19} className="text-primary" aria-hidden="true"/></div>
        <h3 className="mt-3 font-heading text-xl font-semibold">{tier.zh}</h3>
        <p className="mt-3 min-h-16 text-sm leading-relaxed text-muted-foreground">{tier.intro}</p>
        <div className="mt-4 rounded-lg bg-primary/5 p-3"><p className="text-xs text-muted-foreground">GeneCells 单瓶专属拿货价</p><p className="mt-1 text-2xl font-semibold text-primary">S${tier.cost}<span className="ml-1 text-xs font-normal text-muted-foreground">/ 瓶</span></p><p className="mt-1 text-xs text-muted-foreground">相对用户价 S${tier.reference}，约 <strong className="text-primary">{tier.discount} 折</strong></p></div>
        <div className="mt-5 flex-1 border-t border-border pt-4"><p className="mb-3 text-xs font-semibold text-primary">经销商权益</p><ul className="space-y-3">{[`适用全业产品返利 ${tier.rebate}%（非统一折扣）`, `每月氧舱体验 ${tier.oxygen} 次，不累计`, '专属产品价格表与渠道协作说明'].map(text => <li key={text} className="flex items-start gap-2 text-sm"><Check size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden="true"/><span>{text}</span></li>)}</ul></div>
        <Link to={`/dealer-levels/${key}`} aria-label={`查看${tier.zh}专属折扣与权益说明`} className="mt-5 inline-flex min-h-11 items-center justify-between gap-2 rounded-lg border border-primary/20 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">专属折扣与权益说明<ArrowRight size={16} aria-hidden="true"/></Link>
      </article>;
    })}</div>
    <p className="mt-5 border-t border-border pt-4 text-xs leading-6 text-muted-foreground">折扣以 GeneCells 光子抗衰单瓶用户价为对照，非全品类统一折扣。经销等级独立于消费会员等级；此处为制度说明，查看页面不会开通或变更身份，实际权益以授权审核及正式协议为准。</p>
  </section>;
}