import React, { useState } from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { base44 } from '@/api/base44Client';

export default function TransactionForm({ merchant, onSaved }) {
  const { t } = useExperience();
  const [f, setF] = useState({ amount: '', type: 'sale', date: new Date().toISOString().slice(0, 10), note: '' }); const [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault(); setBusy(true);
    const amt = Math.abs(Number(f.amount));
    await base44.entities.AllianceTransaction.create({ ...f, amount: f.type === 'refund' ? -amt : amt, alliance_id: merchant.id, business_name: merchant.business_name });
    setF({ ...f, amount: '', note: '' }); setBusy(false); onSaved();
  };
  const cls = 'rounded-lg border bg-background px-2 py-1.5 text-sm';
  return <form onSubmit={submit} className="mt-3 flex flex-wrap gap-2">
    <input required type="number" min="0" step="0.01" placeholder={t('金额 S$', 'Amount S$')} value={f.amount} onChange={e => setF({ ...f, amount: e.target.value })} className={`${cls} w-28`} />
    <select value={f.type} onChange={e => setF({ ...f, type: e.target.value })} className={cls}><option value="sale">{t('销售', 'Sale')}</option><option value="referral">{t('引流', 'Referral')}</option><option value="refund">{t('退款', 'Refund')}</option></select>
    <input type="date" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} className={cls} />
    <input placeholder={t('备注', 'Note')} value={f.note} onChange={e => setF({ ...f, note: e.target.value })} className={`${cls} min-w-0 flex-1`} />
    <button disabled={busy} className="rounded-full bg-orange-500 px-4 text-sm font-bold text-white disabled:opacity-60">{t('记录流水', 'Add')}</button>
  </form>;
}