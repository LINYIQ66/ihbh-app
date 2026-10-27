import React from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function ChatProductCard({ product: p }) {
  const { t, addCart } = useExperience();
  return <div className="w-64 overflow-hidden rounded-xl border border-border bg-card text-foreground">
    <div className="flex gap-2 p-2"><img src={p.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
      <div className="min-w-0 text-xs"><b className="line-clamp-2 text-sm">{t(p.name_zh, p.name_en)}</b>
        <p className="font-black text-red-500">S${p.price}</p><p className="text-muted-foreground">{t(p.spec_zh, p.spec_en)} · {t(`库存 ${p.stock}`, `${p.stock} in stock`)}</p></div></div>
    {p.promo_zh && <p className="bg-red-50 px-2 py-1 text-xs font-bold text-red-500">{t(p.promo_zh, p.promo_en)}</p>}
    <button onClick={() => addCart(p)} className="w-full bg-orange-500 py-2 text-sm font-bold text-white">{t('加入购物车 · 快捷下单', 'Add to cart · quick order')}</button>
  </div>;
}