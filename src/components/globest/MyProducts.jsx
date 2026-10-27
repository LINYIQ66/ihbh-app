import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function MyProducts() {
  const { state, t, toggleFavorite } = useExperience();
  const [tab, setTab] = useState('bought');
  const bought = (state.orders || []).filter(o => o.paid).flatMap(o => o.items.map(i => ({ ...i, key: `${o.id}-${i.id}`, date: o.date })));
  const favs = state.favorites || [];
  const list = tab === 'bought' ? bought : favs;
  const tabBtn = (k, Icon, zh, en, n) => <button onClick={() => setTab(k)} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${tab === k ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}><Icon size={15} />{t(zh, en)} ({n})</button>;
  return <section className="rounded-xl border bg-card p-5">
    <div className="mb-4 flex flex-wrap gap-2">{tabBtn('bought', ShoppingBag, '已购商品', 'Purchased', bought.length)}{tabBtn('fav', Heart, '我的收藏', 'Favorites', favs.length)}</div>
    {list.length ? <div className="flex gap-3 overflow-x-auto pb-2">{list.map(p => <div key={p.key || p.id} className="w-36 shrink-0">
      <Image src={p.image} className="h-36 w-36 rounded-lg" />
      <p className="mt-2 line-clamp-1 text-sm font-semibold">{t(p.name_zh, p.name_en)}</p>
      <p className="text-xs text-muted-foreground">S${Number(p.price).toFixed(2)}{p.date ? ` · ×${p.quantity} · ${new Date(p.date).toLocaleDateString()}` : ''}</p>
      {tab === 'fav' && <button className="text-xs text-red-500" onClick={() => toggleFavorite(p)}>{t('取消收藏', 'Remove')}</button>}
    </div>)}</div> : <p className="text-sm text-muted-foreground">{tab === 'bought' ? t('还没有购买记录，', 'No purchases yet. ') : t('还没有收藏商品，', 'No favorites yet. ')}<Link to="/" className="underline">{t('去商城逛逛', 'Browse the mall')}</Link></p>}
  </section>;
}