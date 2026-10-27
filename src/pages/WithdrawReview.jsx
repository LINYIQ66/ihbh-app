import { command } from '@/api/commerce';
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/globest/me/PageShell';
import { useExperience } from '@/components/globest/ExperienceProvider';
import SettleForm from '@/components/globest/earn/SettleForm';

function Body({ user }) {
  const { notify } = useExperience(); const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ['wd-review'], enabled: user.role === 'admin', queryFn: () => base44.entities.Withdrawal.filter({ transaction_status: {$ne:'prepared'}, status: 'pending' }, '-created_date', 100) });
  if (user.role !== 'admin') return <p className="rounded-2xl bg-card p-8 text-center text-muted-foreground">仅门店主理人可审核</p>;
  const set = async (w, status) => { const review_note = status === 'rejected' ? window.prompt('驳回原因') || '' : ''; try { await command('commerce',{action:'review_withdrawal',id:w.id,status,review_note}); } catch(e) { return notify(e.response?.data?.error || e.message); } qc.invalidateQueries({ queryKey: ['wd-review'] }); notify(status === 'approved' ? '已通过，请财务线下打款' : '已驳回'); };
  return <>
    <section className="space-y-2 rounded-2xl bg-card p-4"><h2 className="font-bold">待审核提现</h2>{isLoading ? <p className="text-sm text-muted-foreground">加载中…</p> : !data.length ? <p className="text-sm text-muted-foreground">暂无待审核</p> :
      data.map(w => <div key={w.id} className="rounded-xl border p-3 text-sm"><b>{w.user_name}</b> 申请 <b className="text-[#B28A45]">S${w.amount.toFixed(2)}</b><p className="text-muted-foreground">{w.bank} · {new Date(w.created_date).toLocaleString()}</p>
        <div className="mt-2 flex gap-2"><button onClick={() => set(w, 'approved')} className="flex-1 rounded-lg bg-[#0F382C] py-1.5 text-white">通过</button><button onClick={() => set(w, 'rejected')} className="flex-1 rounded-lg bg-red-600 py-1.5 text-white">驳回</button></div></div>)}</section>
    <SettleForm notify={notify}/>
  </>;
}
export default function WithdrawReview() { return <PageShell title="提现审核 · 结算" sub="App 端只做审核，打款由财务线下完成" needLogin>{u => <Body user={u}/>}</PageShell>; }