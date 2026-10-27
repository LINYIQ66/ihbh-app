import React, { useEffect, useState } from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { liveProducts } from '@/components/globest/livehall/liveHallData';

export default function LiveShelf({ featured }) {
  const { t, addCart } = useExperience(); const [left, setLeft] = useState(600); const [spec, setSpec] = useState({});
  useEffect(() => { const i = setInterval(() => setLeft(s => Math.max(0, s - 1)), 1000); return () => clearInterval(i); }, []);
  const mm = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
  return <div className="flex gap-3 overflow-x-auto p-3">{liveProducts.map((p, i) => <div key={p.id} className={`flex w-64 shrink-0 gap-2 rounded-xl bg-white p-2 text-foreground ${i === featured ? 'ring-2 ring-rose-500' : ''}`}>
    <img src={p.image} alt="" className="h-20 w-20 rounded-lg object-cover" />
    <div className="min-w-0 flex-1 text-xs">{i === featured && <span className="rounded bg-rose-500 px-1 text-[10px] font-bold text-white">{t('讲解中', 'On air')}</span>}
      <b className="line-clamp-1 text-sm">{t(p.name_zh, p.name_en)}</b>
      <p><b className="text-base text-rose-500">S${p.price}</b> <s className="text-muted-foreground">S${p.was}</s></p>
      <p className="text-muted-foreground">{t(`秒杀 ${mm} · 剩 ${p.stock}`, `Flash ${mm} · ${p.stock} left`)}</p>
      <div className="mt-1 flex gap-1">{p.specs.map(s => <button key={s} onClick={() => setSpec({ ...spec, [p.id]: s })} className={`rounded border px-1 ${(spec[p.id] || p.specs[0]) === s ? 'border-rose-500 text-rose-500' : 'border-border'}`}>{s}</button>)}</div>
      <button onClick={() => addCart({ ...p, id: `${p.id}-${spec[p.id] || p.specs[0]}` })} className="mt-1 w-full rounded-full bg-rose-500 py-1 font-bold text-white">{t('马上抢', 'Buy now')}</button></div>
  </div>)}</div>;
}