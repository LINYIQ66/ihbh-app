import { command } from '@/api/commerce';
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/globest/me/PageShell';
import useMe from '@/hooks/useMe';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function Events() {
  const { notify } = useExperience(); const qc = useQueryClient(); const { data: user } = useMe();
  const { data: events = [], isLoading } = useQuery({ queryKey: ['events'], queryFn: () => base44.entities.SalonEvent.filter({ status: 'open' }, 'start_at', 50) });
  const { data: mine = [] } = useQuery({ queryKey: ['tickets', 'event', user?.id], enabled: !!user, queryFn: () => base44.entities.Ticket.filter({ transaction_status: {$ne:'prepared'}, kind: 'event', $or: [{ user_id: user.id }, { created_by_id: user.id }] }) });
  const join = async e => {
    if (!user) return base44.auth.redirectToLogin(window.location.href);
    try { await command('commerce',{action:'issue_ticket',kind:'event',ref_id:e.id}); } catch(e) { return notify(e.response?.data?.error || e.message); }
    qc.invalidateQueries({ queryKey: ['tickets'] }); notify('报名成功，签到票已放入票夹');
  };
  return <PageShell title="沙龙活动" sub="报名后凭票夹签到核销">
    {isLoading ? <p className="text-center text-muted-foreground">加载中…</p> : !events.length ? <p className="rounded-2xl bg-card p-8 text-center text-muted-foreground">暂无开放报名的活动</p> :
      events.map(e => { const joined = mine.some(t => t.ref_id === e.id && t.status !== 'cancelled'); return <article key={e.id} className="overflow-hidden rounded-2xl bg-card">
        {e.image && <img src={e.image} alt={e.title} className="h-40 w-full object-cover"/>}
        <div className="space-y-1 p-4"><h3 className="font-bold">{e.title}</h3><p className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays size={13}/>{new Date(e.start_at).toLocaleString()}　<MapPin size={13}/>{e.location}</p><p className="text-sm">{e.description}</p>
          <div className="flex items-center justify-between pt-2"><b className="text-[#B28A45]">{e.fee ? `S$${e.fee}（到场支付）` : '免费'}</b><button disabled={joined} onClick={() => join(e)} className="rounded-xl bg-[#0F382C] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{joined ? '已报名' : '立即报名'}</button></div></div>
      </article>; })}
  </PageShell>;
}