import React, { useState } from 'react';
import { Search, Users, Bell, Radio } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { hallTabs, hallRooms, liveProducts } from '@/components/globest/livehall/liveHallData';
import LiveRoomView from '@/components/globest/livehall/LiveRoomView';

export default function LiveHall() {
  const { t, state, update, notify } = useExperience(); const [tab, setTab] = useState('hot'); const [q, setQ] = useState(''); const [room, setRoom] = useState(null);
  const follows = state.liveFollows || [];
  const list = hallRooms.filter(r => tab === 'follow' ? follows.includes(r.id) || r.cat.includes('follow') : r.cat.includes(tab)).filter(r => !q || (r.host + r.title.join()).toLowerCase().includes(q.toLowerCase()));
  const remind = r => { update(s => ({ ...s, reminders: [...new Set([...s.reminders, r.id])] })); notify(t('已预约，开播前提醒您', 'Reminder set')); };
  return <section className="mb-8 space-y-4 rounded-2xl bg-neutral-950 p-4 text-white md:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-2xl font-black"><Radio className="text-rose-500" />{t('直播大厅', 'Live Hall')}</h2>
      <div className="flex w-full items-center gap-2 rounded-full bg-white/10 px-3 py-2 md:w-80"><Search size={16} /><input value={q} onChange={e => setQ(e.target.value)} placeholder={t('搜索主播、直播、商品', 'Search hosts, streams, products')} className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></div></div>
    <div className="flex gap-2 overflow-x-auto">{hallTabs.map(([k, zh, en]) => <button key={k} onClick={() => setTab(k)} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold ${tab === k ? 'bg-rose-500' : 'bg-white/10'}`}>{t(zh, en)}</button>)}</div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">{list.map(r => { const p = liveProducts[r.product]; return <button key={r.id} onClick={() => r.at ? remind(r) : setRoom(r)} className="group relative overflow-hidden rounded-xl text-left">
      <img src={r.cover} alt="" className="aspect-[3/4] w-full object-cover transition group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
      <span className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[11px] font-bold ${r.at ? 'bg-sky-500' : 'bg-rose-500'}`}>{r.at ? t(`今晚 ${r.at}`, `Tonight ${r.at}`) : `LIVE · ${r.viewers.toLocaleString()}`}</span>
      {r.guests > 1 && <span className="absolute right-2 top-2 flex items-center gap-1 rounded bg-black/50 px-2 py-0.5 text-[11px]"><Users size={11} />{r.guests + 1}</span>}
      <div className="absolute inset-x-0 bottom-0 p-2"><b className="line-clamp-2 text-sm">{t(...r.title)}</b>
        <div className="mt-1 flex items-center gap-1.5 text-xs"><img src={r.avatar} alt="" className="h-5 w-5 rounded-full object-cover" />{r.host}</div>
        {p && <div className="mt-2 flex items-center gap-2 rounded-lg bg-white/90 p-1 text-foreground"><img src={p.image} alt="" className="h-8 w-8 rounded object-cover" /><span className="truncate text-[11px] font-bold">S${p.price}</span></div>}
        {r.at && <span className="mt-2 flex items-center justify-center gap-1 rounded-full bg-sky-500 py-1 text-xs font-bold"><Bell size={12} />{state.reminders.includes(r.id) ? t('已预约', 'Reminded') : t('预约提醒', 'Remind me')}</span>}</div>
    </button>; })}</div>
    {!list.length && <p className="py-6 text-center text-sm text-white/60">{t('暂无直播', 'No streams')}</p>}
    {room && <LiveRoomView room={room} onClose={() => setRoom(null)} />}
  </section>;
}