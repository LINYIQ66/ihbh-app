import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/globest/me/PageShell';

function Body({ user }) {
  const qc = useQueryClient(); const [f, setF] = useState({ bank: '', holder: '', number: '' });
  const { data = [] } = useQuery({ queryKey: ['cards', user.id], queryFn: () => base44.entities.BankCard.filter({ created_by_id: user.id }) });
  const reload = () => qc.invalidateQueries({ queryKey: ['cards'] });
  const add = async e => { e.preventDefault(); await base44.entities.BankCard.create({ bank: f.bank, holder: f.holder, last4: f.number.replace(/\D/g, '').slice(-4) }); setF({ bank: '', holder: '', number: '' }); reload(); };
  return <>
    {data.map(c => <div key={c.id} className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#0F382C] to-[#2c6b52] p-5 text-white"><CreditCard/><div className="flex-1"><b>{c.bank}</b><p className="text-sm opacity-80">{c.holder} · **** {c.last4}</p></div><button aria-label={`删除${c.bank}尾号${c.last4}的银行卡`} onClick={async () => { await base44.entities.BankCard.delete(c.id); reload(); }}><Trash2 size={16}/></button></div>)}
    {data.length < 3 ? <form onSubmit={add} className="grid gap-2 rounded-2xl bg-card p-4"><b>添加银行卡（最多 3 张）</b>
      <input aria-label="银行名称" required placeholder="银行名称" value={f.bank} onChange={e => setF({ ...f, bank: e.target.value })} className="rounded-lg border px-3 py-2 text-sm"/>
      <input aria-label="持卡人姓名" required placeholder="持卡人姓名" value={f.holder} onChange={e => setF({ ...f, holder: e.target.value })} className="rounded-lg border px-3 py-2 text-sm"/>
      <input aria-label="卡号，仅保存末四位" required inputMode="numeric" minLength={8} placeholder="卡号（仅保存末四位）" value={f.number} onChange={e => setF({ ...f, number: e.target.value })} className="rounded-lg border px-3 py-2 text-sm"/>
      <button className="rounded-xl bg-[#0F382C] py-2 font-bold text-white">添加</button></form> : <p className="text-center text-sm text-muted-foreground">已达 3 张上限</p>}
    <p className="text-center text-xs text-muted-foreground">用于门店收益提现，提现由财务审核后线下付款</p>
  </>;
}
export default function BankCards() { return <PageShell title="银行卡" needLogin>{u => <Body user={u}/>}</PageShell>; }