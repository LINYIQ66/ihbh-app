import React from 'react';
import { steps, tiers, services, compare, rules, sla, compliance, roadmap } from '@/components/globest/seller/sellerData';

const H = ({ e, t }) => <div className="mb-3"><span className="text-[10px] font-bold tracking-widest text-[#ff6a00]">{e}</span><h2 className="text-lg font-bold">{t}</h2></div>;
const Box = ({ children }) => <section className="rounded-2xl bg-card p-4 shadow-sm">{children}</section>;

export function Steps() {
  return <Box><H e="ONBOARDING · 8 STEPS" t="入驻流程 · 最快3天开店"/>
    <ol className="space-y-2">{steps.map(([n, d, time], i) => <li key={n} className="flex items-start gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff6a00] text-xs font-bold text-white">{i + 1}</span><div className="flex-1"><div className="flex justify-between"><b className="text-sm">{n}</b><span className="text-[11px] text-muted-foreground">{time}</span></div><p className="text-xs text-muted-foreground">{d}</p></div></li>)}</ol>
  </Box>;
}

export function Tiers() {
  return <Box><H e="SELLER TIERS" t="商家成长体系 · 越成长佣金越低"/>
    <div className="space-y-2">{tiers.map(([n, req, perk, rate, g]) => <div key={n} className={`rounded-xl bg-gradient-to-r ${g} p-3 text-white`}><div className="flex justify-between"><b>{n}</b><b className="text-xl">{rate ? `${rate}%` : '协商'}</b></div><p className="text-[11px] opacity-90">{req}</p><p className="mt-1 text-xs">✓ {perk}</p></div>)}</div>
  </Box>;
}

export function Services() {
  return <Box><H e="SELLER CENTRAL" t="商家后台 · 八大核心能力"/>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{services.map(([i, n, d]) => <div key={n} className="rounded-xl bg-muted/60 p-3"><span className="text-xl">{i}</span><b className="block text-sm">{n}</b><p className="text-[11px] text-muted-foreground">{d}</p></div>)}</div>
  </Box>;
}

export function Compare() {
  return <Box><H e="WHY iHBH" t="对比 Amazon · 淘宝，我们的不同"/>
    <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="bg-muted"><th className="p-2 text-left">维度</th><th className="p-2">Amazon</th><th className="p-2">淘宝</th><th className="p-2 text-[#0F382C]">iHBH淘最环球</th></tr></thead>
      <tbody>{compare.map(([k, a, b, c]) => <tr key={k} className="border-b"><td className="p-2 font-semibold">{k}</td><td className="p-2 text-center text-muted-foreground">{a}</td><td className="p-2 text-center text-muted-foreground">{b}</td><td className="p-2 text-center font-semibold text-[#3d7a1f]">{c}</td></tr>)}</tbody></table></div>
  </Box>;
}

export function Rules() {
  return <Box><H e="TRUST & SAFETY" t="品质与合规 · 守护消费者信任"/>
    <div className="grid grid-cols-3 gap-2 text-center">{sla.map(([v, d]) => <div key={d} className="rounded-xl bg-[#0F382C] p-2 text-white"><b>{v}</b><p className="text-[10px] opacity-80">{d}</p></div>)}</div>
    <div className="mt-3 space-y-1.5">{rules.map(([k, v]) => <div key={k} className="rounded-lg border-l-4 border-red-500 bg-red-50 px-3 py-2"><b className="text-xs">{k}</b><p className="text-[11px] text-muted-foreground">{v}</p></div>)}</div>
    <div className="mt-3 flex flex-wrap gap-1.5">{compliance.map(c => <span key={c} className="rounded-full bg-[#6CBB3C]/15 px-2.5 py-1 text-[11px] text-[#3d7a1f]">✓ {c}</span>)}</div>
  </Box>;
}

export function Roadmap() {
  return <Box><H e="ROADMAP" t="平台里程碑 · 新加坡 → 东南亚 → 全球"/>
    <div className="flex gap-2 overflow-x-auto pb-1">{roadmap.map(([t, d]) => <div key={t} className="min-w-[130px] rounded-xl border p-3"><b className="text-sm text-[#ff6a00]">{t}</b><p className="mt-1 text-[11px] text-muted-foreground">{d}</p></div>)}</div>
  </Box>;
}