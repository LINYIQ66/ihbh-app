import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FeeCalculator from '@/components/globest/seller/FeeCalculator';
import AlliancePlan from '@/components/globest/seller/AlliancePlan';
import { Steps, Tiers, Services, Compare, Rules, Roadmap } from '@/components/globest/seller/SellerSections';
import { kpis, perks } from '@/components/globest/seller/sellerData';

export default function SellerCenter() {
  const [tab, setTab] = useState(new URLSearchParams(window.location.search).get('tab') === 'alliance' ? 'alliance' : 'seller');
  return <div className="page-inner mx-auto max-w-4xl space-y-4 pb-24">
    <section className="rounded-2xl bg-gradient-to-br from-[#ff6a00] to-[#ff9a3c] p-5 text-white">
      <span className="text-[10px] font-bold tracking-widest">iHBH SELLER CENTRAL · SINGAPORE 2026</span>
      <h1 className="mt-1 text-2xl font-bold leading-tight">在淘最环球开店<br/>健康好物 × 全球好物 双轮驱动</h1>
      <p className="mt-2 text-xs text-white/90">低成本入驻 · 精准流量 · 持牌支付结算 · 数据赋能 · 联盟分润</p>
      <div className="mt-4 grid grid-cols-4 gap-1.5 text-center">{kpis.map(([v, d]) => <div key={d} className="rounded-lg bg-white/20 p-1.5"><b className="text-sm">{v}</b><p className="text-[9px] leading-tight">{d}</p></div>)}</div>
    </section>
    <div className="sticky top-0 z-10 flex rounded-full bg-muted p-1">{[['seller', '🏪 商家入驻'], ['alliance', '🤝 异业联盟']].map(([k, n]) => <button key={k} onClick={() => setTab(k)} className={`flex-1 rounded-full py-2 text-sm font-bold ${tab === k ? 'bg-card text-[#ff6a00] shadow' : 'text-muted-foreground'}`}>{n}</button>)}</div>
    {tab === 'seller' ? <>
      <section className="rounded-2xl bg-card p-4"><h2 className="mb-3 text-lg font-bold">🔥 首批100家商家开店礼</h2><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{perks.map(([i, n, d]) => <div key={n} className="rounded-xl border border-[#ff6a00]/30 bg-[#fff6ee] p-3"><span className="text-xl">{i}</span><b className="block text-sm">{n}</b><p className="text-[11px] text-muted-foreground">{d}</p></div>)}</div></section>
      <FeeCalculator/><Steps/><Tiers/><Services/><Compare/><Rules/><Roadmap/>
    </> : <AlliancePlan/>}
    {tab === 'seller' && <Link to="/partner" className="fixed inset-x-4 bottom-20 z-20 mx-auto block max-w-md rounded-full bg-[#ff6a00] py-3 text-center font-bold text-white shadow-lg">立即申请入驻 →</Link>}
  </div>;
}