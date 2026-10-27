import React from 'react';
import { Gift, ShieldCheck } from 'lucide-react';

const TIERS = { standard: ['普通会员', 1000], vip: ['VIP 会员', 5000], prestige: ['尊享会员', null] };

export default function AssetOverview({ s, onCheckin, busy }) {
  const [name, next] = TIERS[s.tier];
  const pct = next ? Math.min(100, (s.lifetime / next) * 100) : 100;
  return <section className="rounded-3xl bg-gradient-to-br from-[#0b1220] via-[#10243a] to-[#0F382C] p-5 text-white shadow-xl">
    <div className="flex items-center justify-between text-[11px] text-white/60"><span>HBH POINTS · OFF-CHAIN LEDGER</span><span className="flex items-center gap-1"><ShieldCheck size={12}/>账户同步</span></div>
    <div className="mt-3 text-4xl font-bold tracking-tight">{s.balance.toLocaleString()} <span className="text-base text-white/60">HBH</span></div>
    <p className="text-xs text-white/60">参考估值 ≈ S${s.sgd_value.toFixed(2)} · 仅限平台内抵扣，不可提现/转让</p>
    <div className="mt-4 rounded-xl bg-white/10 p-3"><div className="flex justify-between text-xs"><b className="text-[#E4C88A]">{name}</b><span className="text-white/60">累计 {s.lifetime.toLocaleString()}{next ? ` / ${next.toLocaleString()}` : ''}</span></div><div className="mt-2 h-1.5 rounded-full bg-white/15"><div className="h-full rounded-full bg-[#E4C88A]" style={{ width: `${pct}%` }}/></div></div>
    <button disabled={s.checkedIn || busy} onClick={onCheckin} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E4C88A] py-3 font-bold text-[#0b1220] disabled:opacity-50"><Gift size={17}/>{s.checkedIn ? '今日已签到' : busy ? '处理中…' : '每日签到 +20 HBH'}</button>
  </section>;
}