import React, { useState } from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import TransactionForm from '@/components/globest/alliance/TransactionForm';

export default function ApprovedMerchants({ items, totals, onChange }) {
  const { t } = useExperience(); const [open, setOpen] = useState(null);
  if (!items.length) return <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">{t('暂无已通过商家', 'No approved merchants yet')}</p>;
  return <div className="space-y-2">{items.map(m => { const r = totals.find(x => x.alliance_id === m.id); return <div key={m.id} className="rounded-xl border bg-card p-4 text-sm">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div><b className="text-base">{m.business_name}</b><p className="text-muted-foreground">{m.industry}{m.area && ` · ${m.area}`} · {m.contact_name} {m.phone}</p></div>
      <div className="text-right"><b className="block text-lg text-green-700">S${Number(r?.sum_amount || 0).toLocaleString()}</b><span className="text-xs text-muted-foreground">{t(`${r?.count || 0} 笔流水`, `${r?.count || 0} transactions`)}</span></div>
    </div>
    {m.offer && <p className="mt-1 text-xs text-muted-foreground">{t('互推资源：', 'Offer: ')}{m.offer}</p>}
    <button onClick={() => setOpen(open === m.id ? null : m.id)} className="mt-2 text-xs font-bold text-orange-600">{open === m.id ? t('收起', 'Close') : t('+ 记录流水', '+ Record transaction')}</button>
    {open === m.id && <TransactionForm merchant={m} onSaved={onChange} />}
  </div>; })}</div>;
}