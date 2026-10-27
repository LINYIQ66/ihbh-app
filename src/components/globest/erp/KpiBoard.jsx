import React, { useState } from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { kpis, trend } from './erpData';

export default function KpiBoard() {
  const { t } = useExperience();
  const [p, setP] = useState('day');
  const max = Math.max(...trend.map(d => d[2]));
  return <section className="space-y-3">
    <div className="flex gap-1 rounded-full bg-muted p-1">{[['day', '今日', 'Today'], ['week', '本周', 'Week'], ['month', '本月', 'Month']].map(o => <button key={o[0]} onClick={() => setP(o[0])} className={`flex-1 rounded-full py-1.5 text-sm font-bold ${p === o[0] ? 'bg-[#0F382C] text-white' : ''}`}>{t(o[1], o[2])}</button>)}</div>
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">{kpis[p].map(k => <div key={k[0]} className="rounded-2xl border bg-card p-4"><span className="text-xs text-muted-foreground">{t(k[0], k[1])}</span><b className="mt-1 block text-xl text-[#0F382C]">{k[2]}</b><span className="text-[10px] text-amber-700">{t('示例数据', 'Sample data')}</span></div>)}</div>
    <div className="rounded-2xl border bg-card p-4">
      <h4 className="mb-3 text-sm font-bold">{t('近 7 日实收（千新元）', '7-day collections (S$k)')}</h4>
      <div className="flex h-32 items-end gap-2">{trend.map(d => <div key={d[0]} className="flex flex-1 flex-col items-center gap-1"><span className="text-[10px]">{d[2]}</span><div className="w-full rounded-t bg-gradient-to-t from-[#0F382C] to-[#c9a063]" style={{ height: `${d[2] / max * 100}%` }} /><span className="text-[10px] text-muted-foreground">{t(d[0], d[1])}</span></div>)}</div>
      <p className="mt-2 text-xs text-muted-foreground">{t('支持查看销售、退款、毛利、充值、佣金及会员增长。', 'Covers sales, refunds, margin, recharge, commission and member growth.')}</p>
    </div>
  </section>;
}