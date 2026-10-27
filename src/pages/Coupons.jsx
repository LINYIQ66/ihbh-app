import { command } from '@/api/commerce';
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/globest/me/PageShell';
import useMe from '@/hooks/useMe';
import { useExperience } from '@/components/globest/ExperienceProvider';

const KIND = { promo: '促销券', alliance: '异业券', delivery: '配送券' };

export default function Coupons() {
  const { notify } = useExperience(); const qc = useQueryClient(); const { data: user } = useMe();
  const { data = [], isLoading } = useQuery({ queryKey: ['coupons'], queryFn: () => base44.entities.Coupon.filter({ active: true }, '-created_date', 50) });
  const { data: mine = [] } = useQuery({ queryKey: ['tickets', 'coupon', user?.id], enabled: !!user, queryFn: () => base44.entities.Ticket.filter({ transaction_status: {$ne:'prepared'}, kind: 'coupon', $or: [{ user_id: user.id }, { created_by_id: user.id }] }) });
  const take = async c => {
    if (!user) return base44.auth.redirectToLogin(window.location.href);
    try { await command('commerce',{action:'issue_ticket',kind:'coupon',ref_id:c.id}); } catch(e) { return notify(e.response?.data?.error || e.message); }
    qc.invalidateQueries({ queryKey: ['tickets'] }); notify('领取成功，已放入票夹');
  };
  return <PageShell title="领券中心" sub="促销券 · 异业券 · 配送券">
    {isLoading ? <p className="text-center text-muted-foreground">加载中…</p> : !data.length ? <p className="rounded-2xl bg-card p-8 text-center text-muted-foreground">暂无可领取的优惠券</p> :
      data.map(c => { const got = mine.some(t => t.ref_id === c.id); return <div key={c.id} className="flex items-center gap-3 rounded-2xl border-l-4 border-[#B28A45] bg-card p-4">
        <div className="flex-1"><span className="rounded bg-[#0F382C] px-1.5 text-xs text-white">{KIND[c.kind]}</span><b className="ml-2">{c.title}</b><p className="text-lg font-black text-[#B28A45]">{c.rule}</p><p className="text-xs text-muted-foreground">{c.partner} {c.expires && `· 有效期至 ${c.expires}`}</p></div>
        <button disabled={got} onClick={() => take(c)} className="rounded-xl bg-[#0F382C] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{got ? '已领取' : '领取'}</button></div>; })}
  </PageShell>;
}