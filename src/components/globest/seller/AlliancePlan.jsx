import React, { useState } from 'react';
import AllianceJoin from '@/components/globest/local/AllianceJoin';
import { allianceTypes, allianceFlow, allianceBenefits } from '@/components/globest/seller/alliancePlanData';

export default function AlliancePlan() {
  const [members, setMembers] = useState(300), [spend, setSpend] = useState(80);
  const gmv = members * spend * 0.3;
  return <div className="space-y-4">
    <section className="rounded-2xl bg-gradient-to-br from-[#0F382C] to-[#2d6a4f] p-5 text-white">
      <span className="text-[10px] tracking-widest text-[#E4C88A]">CROSS-INDUSTRY ALLIANCE</span>
      <h2 className="text-xl font-bold">异业联盟 · 客户共享 · 收益共赢</h2>
      <p className="mt-1 text-xs text-white/80">以主业产品建经销商体系，以全业产品做分润体系，以商业联盟做分享平台。</p>
      <div className="mt-4 flex items-center justify-between gap-1">{allianceFlow.map((f, i) => <React.Fragment key={f}><span className="rounded-full bg-white/15 px-2 py-1 text-[10px]">{f}</span>{i < allianceFlow.length - 1 && <span className="text-[#E4C88A]">→</span>}</React.Fragment>)}</div>
    </section>
    <section className="rounded-2xl bg-card p-4"><h3 className="mb-3 font-bold">谁适合加入</h3><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{allianceTypes.map(([i, n, d]) => <div key={n} className="rounded-xl bg-muted/60 p-3"><span className="text-xl">{i}</span><b className="block text-sm">{n}</b><p className="text-[11px] text-muted-foreground">{d}</p></div>)}</div></section>
    <section className="rounded-2xl bg-card p-4"><h3 className="mb-3 font-bold">联盟权益</h3><div className="space-y-2">{allianceBenefits.map(([n, d]) => <div key={n} className="flex gap-2 text-sm"><span className="text-[#ff6a00]">●</span><div><b>{n}</b><p className="text-xs text-muted-foreground">{d}</p></div></div>)}</div></section>
    <section className="rounded-2xl border bg-card p-4"><h3 className="font-bold">📈 联盟引流测算</h3>
      <label className="mt-2 block text-xs">您的门店活跃会员 <b>{members}</b> 人<input type="range" min="50" max="3000" step="50" value={members} onChange={e => setMembers(+e.target.value)} className="w-full"/></label>
      <label className="block text-xs">会员月均线上消费 <b>S${spend}</b><input type="range" min="20" max="300" step="10" value={spend} onChange={e => setSpend(+e.target.value)} className="w-full"/></label>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center"><div className="rounded-xl bg-muted p-2"><b className="text-[#ff6a00]">S${Math.round(gmv).toLocaleString()}</b><p className="text-[10px]">预计月带动GMV（30%转化）</p></div><div className="rounded-xl bg-muted p-2"><b className="text-[#3d7a1f]">按公示规则分润</b><p className="text-[10px]">推广收益实时可查</p></div></div>
    </section>
    <AllianceJoin/>
  </div>;
}