import React from 'react';
import { Truck, RotateCcw, Bell, Gift } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { inboxCategories } from '@/components/globest/inbox/inboxData';

const icons = { Truck, RotateCcw, Bell, Gift };
const colors = { order: 'bg-sky-500', aftersale: 'bg-emerald-500', platform: 'bg-orange-500', marketing: 'bg-rose-500' };

export default function CategoryIcons({ inbox, active, onOpen }) {
  const { t } = useExperience();
  return <div className="grid grid-cols-4 gap-1 px-2 pb-3">{inboxCategories.map(([k, zh, en, ic]) => {
    const I = icons[ic]; const th = inbox.threads.find(x => x.id === k); const n = th?.unread || 0; const off = k === 'marketing' && !inbox.marketing;
    return <button key={k} disabled={!th} onClick={() => onOpen(k)} className={`flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-semibold ${active === k ? 'bg-orange-50' : 'hover:bg-muted'} ${!th ? 'opacity-40' : ''}`}>
      <span className={`relative grid h-11 w-11 place-items-center rounded-2xl text-white ${colors[k]}`}><I size={20} />{n > 0 && !off && <b className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-500 px-1 text-[10px] ring-2 ring-white">{n}</b>}</span>{t(zh, en)}</button>;
  })}</div>;
}