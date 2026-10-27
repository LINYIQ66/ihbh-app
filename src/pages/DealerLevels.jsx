import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2 } from 'lucide-react';
import DealerTierPlans from '@/components/globest/dealer/DealerTierPlans';
import DealerTierBenefits from '@/components/globest/dealer/DealerTierBenefits';
import DealerTierPrices from '@/components/globest/dealer/DealerTierPrices';
import { dealerLevelKeys, getDealerTier } from '@/components/globest/dealer/dealerTierData';

export default function DealerLevels() {
  const { level } = useParams();
  const tier = getDealerTier(level);
  if (level && !tier) return <div className="page-inner space-y-4 py-8"><h1 className="font-heading text-2xl">未找到该经销商等级</h1><p className="text-muted-foreground">请选择合伙人、官方或总代查看对应权益。</p><Link to="/dealer-levels" className="inline-flex items-center gap-2 text-primary"><ArrowLeft size={16} aria-hidden="true"/>返回经销商等级</Link></div>;
  return <div className="page-inner space-y-6 pb-10 pt-5">
    <Link to="/crm?role=user&tab=dealers" className="inline-flex min-h-11 items-center gap-2 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ArrowLeft size={16} aria-hidden="true"/>返回我的中心 · 经销商</Link>
    {!tier ? <DealerTierPlans/> : <>
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-7"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Building2 size={19} aria-hidden="true"/></span><div><span className="text-xs font-medium text-primary">经销商等级 · {tier.label}</span><h1 className="mt-1 font-heading text-2xl font-semibold">{tier.zh}专属折扣与权益</h1><p className="mt-2 text-sm leading-7 text-muted-foreground">{tier.intro}</p></div></div>
        <nav aria-label="切换经销商等级" className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">{dealerLevelKeys.map(key => <Link key={key} to={`/dealer-levels/${key}`} aria-current={key === level ? 'page' : undefined} className={`rounded-lg border px-5 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${key === level ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-primary hover:bg-primary/5'}`}>{getDealerTier(key).zh}</Link>)}</nav>
      </section>
      <DealerTierPrices level={level}/>
      <DealerTierBenefits level={level}/>
      <Link to={`/agency?role=${level}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">查看完整经销合作制度<ArrowRight size={16} aria-hidden="true"/></Link>
    </>}
  </div>;
}