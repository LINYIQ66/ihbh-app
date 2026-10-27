import React, { useState } from 'react';
import { tiers, categories } from '@/components/globest/seller/sellerData';

export default function FeeCalculator() {
  const [gmv, setGmv] = useState(10000), [tier, setTier] = useState(0), [cat, setCat] = useState(0), [early, setEarly] = useState(true);
  const rate = tiers[tier][3] / 100;
  const fee = early ? 0 : gmv * rate;
  const deposit = categories[cat][1] / (early ? 2 : 1);
  const rebate = Math.floor(gmv * 0.5);
  const row = (k, v, b) => <div className="flex justify-between py-1.5 text-sm"><span className="text-muted-foreground">{k}</span><b className={b}>{v}</b></div>;
  return <div className="rounded-2xl border bg-card p-4">
    <h3 className="font-bold">💰 收益计算器</h3>
    <label className="mt-3 block text-xs">预计月销售额 <b className="text-[#ff6a00]">S${gmv.toLocaleString()}</b><input type="range" min="1000" max="100000" step="1000" value={gmv} onChange={e => setGmv(+e.target.value)} className="w-full"/></label>
    <div className="mt-2 grid grid-cols-2 gap-2">
      <select value={tier} onChange={e => setTier(+e.target.value)} className="rounded-lg border px-2 py-2 text-sm">{tiers.slice(0, 3).map((t, i) => <option key={t[0]} value={i}>{t[0]} {t[3]}%</option>)}</select>
      <select value={cat} onChange={e => setCat(+e.target.value)} className="rounded-lg border px-2 py-2 text-sm">{categories.map((c, i) => <option key={c[0]} value={i}>{c[0]}</option>)}</select>
    </div>
    <label className="mt-2 flex items-center gap-2 text-xs"><input type="checkbox" checked={early} onChange={e => setEarly(e.target.checked)}/>前100家首批商家（前3个月免佣、保证金减半）</label>
    <div className="mt-3 divide-y rounded-xl bg-muted/50 px-3">
      {row('平台佣金/月', `S$${fee.toLocaleString()}`)}
      {row('到账收入/月', `S$${(gmv - fee).toLocaleString()}`, 'text-[#3d7a1f]')}
      {row('一次性保证金', `S$${deposit.toLocaleString()}`)}
      {row('买家可获HBH返利（约）', `${rebate.toLocaleString()} HBH`, 'text-[#ff6a00]')}
    </div>
    <p className="mt-2 text-[10px] text-muted-foreground">示意测算，以《商家入驻合作协议》及平台公示为准。</p>
  </div>;
}