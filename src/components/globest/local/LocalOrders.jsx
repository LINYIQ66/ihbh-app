import React, { useEffect, useState } from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';

const steps = [['已下单', 'Placed'], ['商家确认', 'Confirmed'], ['准备中', 'Preparing'], ['服务中', 'In service'], ['已完成', 'Completed']];

export default function LocalOrders({ onReorder }) {
  const { state, t } = useExperience(); const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 5000); return () => clearInterval(id); }, []);
  const orders = state.localOrders || [];
  if (!orders.length) return null;
  return <section className="rounded-2xl border border-border bg-card p-4">
    <h3 className="mb-3 font-bold">{t('我的本地订单', 'My local orders')}</h3>
    <div className="space-y-3">{orders.slice(0, 3).map(o => { const step = Math.min(4, Math.floor((now - o.createdAt) / 20000));
      return <div key={o.id} className="rounded-xl bg-muted p-3 text-sm">
        <div className="flex justify-between"><b>{t(o.zh, o.en)} · {t(...o.service)}</b><span className="font-bold text-orange-600">S${o.total.toFixed(2)}</span></div>
        <p className="text-xs text-muted-foreground">{o.slot ? `${t('今天', 'Today')} ${o.slot} · ` : ''}×{o.qty}</p>
        <div className="mt-2 flex gap-1">{steps.map((s, i) => <div key={s[1]} className="flex-1"><div className={`h-1.5 rounded-full ${i <= step ? 'bg-orange-500' : 'bg-border'}`} /><span className={`mt-1 block text-[10px] ${i === step ? 'font-bold text-orange-600' : 'text-muted-foreground'}`}>{t(...s)}</span></div>)}</div>
        {step === 4 && <button onClick={() => onReorder(o.merchantId)} className="mt-2 rounded-full border border-orange-500 px-3 py-1 text-xs font-bold text-orange-600">{t('再次购买', 'Buy again')}</button>}
      </div>; })}</div>
  </section>;
}