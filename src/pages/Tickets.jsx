import { command } from '@/api/commerce';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/globest/me/PageShell';

const KINDS = [['all', '全部'], ['service', '服务'], ['coupon', '卡券'], ['event', '活动票'], ['venue', '场地']];
const ST = { unused: ['待使用', 'bg-green-100 text-green-800'], used: ['已核销', 'bg-muted text-muted-foreground'], cancelled: ['已取消', 'bg-red-50 text-red-600'] };

function List({ user }) {
  const qc = useQueryClient(); const [kind, setKind] = useState('all');
  const { data = [], isLoading } = useQuery({ queryKey: ['tickets', kind, user.id], queryFn: () => base44.entities.Ticket.filter({ transaction_status: {$ne:'prepared'}, $or: [{ user_id: user.id }, { created_by_id: user.id }], ...(kind !== 'all' && { kind }) }, '-created_date', 100) });
  const cancel = async t => { try { await command('commerce',{action:'cancel_ticket',ticket_id:t.id}); } catch(e) { window.alert(e.response?.data?.error || e.message); return; } qc.invalidateQueries({ queryKey: ['tickets'] }); };
  return <>
    <div className="flex gap-2 overflow-x-auto">{KINDS.map(([k, l]) => <button key={k} onClick={() => setKind(k)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm ${kind === k ? 'bg-[#0F382C] text-white' : 'bg-card'}`}>{l}</button>)}</div>
    {isLoading ? <p className="text-center text-muted-foreground">加载中…</p> : !data.length ? <p className="rounded-2xl bg-card p-8 text-center text-muted-foreground">票夹是空的，去报名活动或预定场地吧</p> :
      data.map(t => <div key={t.id} className="flex items-center gap-3 rounded-2xl border-l-4 border-[#B28A45] bg-card p-4">
        <div className="flex-1"><b>{t.title}</b><p className="text-xs text-muted-foreground">{t.date && new Date(t.date).toLocaleString()} {t.note} {t.amount ? `· S$${t.amount}` : ''}</p><p className="mt-1 font-mono text-lg tracking-widest">{t.code}</p></div>
        <div className="flex flex-col items-end gap-2"><span className={`rounded-full px-2 py-0.5 text-xs ${ST[t.status][1]}`}>{ST[t.status][0]}</span>{t.status === 'unused' && <button onClick={() => cancel(t)} className="text-xs text-red-600 underline">取消</button>}</div>
      </div>)}
    <p className="text-center text-xs text-muted-foreground">到店出示券码，由门店工作人员核销</p>
  </>;
}

export default function Tickets() { return <PageShell title="票夹" sub="服务 · 卡券 · 活动票 · 场地" needLogin>{user => <List user={user}/>}</PageShell>; }