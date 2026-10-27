import { command } from '@/api/commerce';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/globest/me/PageShell';
import useMe from '@/hooks/useMe';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function Venues() {
  const { notify } = useExperience(); const qc = useQueryClient(); const { data: user } = useMe();
  const [pick, setPick] = useState({}); const set = (id, k, v) => setPick(p => ({ ...p, [id]: { hours: 2, ...p[id], [k]: v } }));
  const { data: venues = [], isLoading } = useQuery({ queryKey: ['venues'], queryFn: () => base44.entities.Venue.list('name', 50) });
  const book = async v => {
    if (!user) return base44.auth.redirectToLogin(window.location.href);
    const p = { hours: 2, ...pick[v.id] }; if (!p.date) return notify('请选择日期和时间');
    try { await command('commerce',{action:'issue_ticket',kind:'venue',ref_id:v.id,date:new Date(p.date).toISOString(),hours:p.hours}); } catch(e) { return notify(e.response?.data?.error || e.message); }
    qc.invalidateQueries({ queryKey: ['tickets'] }); notify('预定已提交，预定凭证已放入票夹');
  };
  return <PageShell title="场地预定" sub="查看环境、费用与可预定状态">
    {isLoading ? <p className="text-center text-muted-foreground">加载中…</p> : !venues.length ? <p className="rounded-2xl bg-card p-8 text-center text-muted-foreground">暂无可预定场地</p> :
      venues.map(v => <article key={v.id} className="overflow-hidden rounded-2xl bg-card">
        {v.image && <img src={v.image} alt={v.name} className="h-40 w-full object-cover"/>}
        <div className="space-y-2 p-4"><div className="flex justify-between"><h3 className="font-bold">{v.name}</h3><span className={`text-xs font-bold ${v.available ? 'text-green-700' : 'text-red-600'}`}>{v.available ? '可预定' : '已满'}</span></div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">{v.area}　<Users size={13}/>{v.capacity} 人　<b className="text-[#B28A45]">S${v.price_per_hour}/小时</b></p><p className="text-sm">{v.description}</p>
          {v.available && <div className="flex flex-wrap gap-2"><input type="datetime-local" className="flex-1 rounded-lg border px-2 py-1.5 text-sm" onChange={e => set(v.id, 'date', e.target.value)}/><select className="rounded-lg border px-2 text-sm" value={pick[v.id]?.hours || 2} onChange={e => set(v.id, 'hours', Number(e.target.value))}>{[1,2,3,4,6,8].map(h => <option key={h} value={h}>{h} 小时</option>)}</select><button onClick={() => book(v)} className="rounded-xl bg-[#0F382C] px-4 py-2 text-sm font-bold text-white">预定 S${v.price_per_hour * (pick[v.id]?.hours || 2)}</button></div>}
        </div></article>)}
  </PageShell>;
}