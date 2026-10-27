import { command } from '@/api/commerce';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/globest/me/PageShell';

function Body({ user }) {
  const qc = useQueryClient(); const [code, setCode] = useState(''); const [msg, setMsg] = useState(null);
  const { data: log = [] } = useQuery({ queryKey: ['verify-log'], queryFn: () => base44.entities.Ticket.filter({ transaction_status: {$ne:'prepared'}, status: 'used' }, '-used_at', 30) });
  if (user.role !== 'admin') return <p className="rounded-2xl bg-card p-8 text-center text-muted-foreground">仅门店工作人员可使用核销</p>;
  const run = async e => {
    e.preventDefault();
    if(!window.confirm('如票券需到场支付，请先核实已收款。确认核销？'))return;
    try { const result=await command('commerce',{action:'verify_ticket',code:code.trim().toUpperCase(),receipt_confirmed:true});setMsg([`核销成功：${result.title}`,true]);setCode('');qc.invalidateQueries({queryKey:['verify-log']}); }
    catch(e){setMsg([e.response?.data?.error||e.message,false]);}
  };
  return <>
    <form onSubmit={run} className="flex gap-2 rounded-2xl bg-card p-4"><input aria-label="券码" required value={code} onChange={e => setCode(e.target.value)} placeholder="录入券码" className="flex-1 rounded-lg border px-3 py-2 font-mono uppercase"/><button className="rounded-xl bg-[#0F382C] px-5 font-bold text-white">核销</button></form>
    {msg && <p className={`text-center font-bold ${msg[1] ? 'text-green-700' : 'text-red-600'}`}>{msg[0]}</p>}
    <section className="rounded-2xl bg-card p-4"><h2 className="mb-2 font-bold">核销记录</h2>{log.length ? log.map(t => <div key={t.id} className="flex justify-between border-b py-2 text-sm"><span>{t.title}</span><span className="font-mono text-muted-foreground">{t.code} · {t.used_at && new Date(t.used_at).toLocaleString()}</span></div>) : <p className="text-sm text-muted-foreground">暂无记录</p>}</section>
  </>;
}
export default function Verify() { return <PageShell title="门店 / 异业核销" sub="录入券码完成核销" needLogin>{u => <Body user={u}/>}</PageShell>; }