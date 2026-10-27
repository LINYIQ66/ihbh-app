import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Clock, MapPin, Phone } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/globest/me/PageShell';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function Stores() {
  const { state, update, notify } = useExperience();
  const { data = [], isLoading } = useQuery({ queryKey: ['stores'], queryFn: () => base44.entities.Store.list('name', 50) });
  const choose = s => { update({ store: { id: s.id, name: s.name } }); notify(`已切换到 ${s.name}`); };
  return <PageShell title="切换门店" sub={state.store ? `当前门店：${state.store.name}` : '请选择您的服务门店'}>
    {isLoading ? <p className="text-center text-muted-foreground">加载中…</p> : data.map(s => { const on = state.store?.id === s.id; return <div key={s.id} className={`overflow-hidden rounded-2xl bg-card ${on ? 'ring-2 ring-[#0F382C]' : ''}`}>
      {s.image && <img src={s.image} alt={s.name} className="h-32 w-full object-cover"/>}
      <div className="space-y-1 p-4 text-sm"><b className="text-base">{s.name}</b><p className="flex gap-1 text-muted-foreground"><MapPin size={14}/>{s.address}</p><p className="flex gap-1 text-muted-foreground"><Clock size={14}/>{s.hours}　<Phone size={14}/>{s.phone}</p>
        <button disabled={on} onClick={() => choose(s)} className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl bg-[#0F382C] py-2 font-bold text-white disabled:opacity-60">{on ? <><Check size={16}/>当前门店</> : '切换到此门店'}</button></div></div>; })}
  </PageShell>;
}