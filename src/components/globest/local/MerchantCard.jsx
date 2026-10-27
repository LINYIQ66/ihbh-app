import React from 'react';
import { Star, MapPin, Tag } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import HbhPrice from '@/components/globest/HbhPrice';

export default function MerchantCard({ merchant: x, onOpen }) {
  const { t } = useExperience();
  const from = Math.min(...x.services.map(s => s[2]));
  return <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <button className="block w-full text-left" onClick={() => onOpen(x)}>
      <div className="relative aspect-[4/3]"><img src={x.image} alt={t(x.zh, x.en)} className="h-full w-full object-cover" loading="lazy" />
        {x.isNew && <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-bold text-white">{t('新店', 'NEW')}</span>}</div>
      <div className="space-y-1.5 p-3">
        <h3 className="line-clamp-1 font-bold text-foreground">{t(x.zh, x.en)}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="flex items-center gap-0.5 font-semibold text-orange-500"><Star size={12} fill="currentColor" />{x.rating}</span><span>({x.reviews})</span><span className="flex items-center gap-0.5"><MapPin size={12} />{x.km}km · {x.area}</span></div>
        <div className="text-xs text-muted-foreground">{t('人均', 'Avg')} S${x.avg} · {t('起', 'from')} <b className="text-base text-orange-600">S${from}</b> <HbhPrice sgd={from} /></div>
        <div className="flex items-center gap-1 text-xs font-semibold text-red-500"><Tag size={12} />{t(...x.deal)}</div>
      </div>
    </button>
    <div className="px-3 pb-3"><button onClick={() => onOpen(x, true)} className="w-full rounded-full bg-orange-500 py-2 text-sm font-bold text-white hover:bg-orange-600">{x.cat === 'food' ? t('立即下单/订座', 'Order / Book') : t('立即预约', 'Book now')}</button></div>
  </article>;
}