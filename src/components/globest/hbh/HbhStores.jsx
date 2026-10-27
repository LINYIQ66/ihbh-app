import React from 'react';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { stores, gallery } from './hbhContent';

export default function HbhStores() {
  const { t } = useExperience();
  return <section id="hbh-stores" className="my-6 scroll-mt-24">
    <h2 className="mb-3 font-heading text-xl text-primary sm:text-2xl">{t('线下门店 · 到店体验', 'Our stores · Visit in person')}</h2>
    <div className="grid gap-3 md:grid-cols-3">
      {stores.map(s => <article key={s.zh} className="flex overflow-hidden rounded-xl border bg-card md:flex-col">
        <Image src={s.image} alt={t(s.zh, s.en)} className="h-28 w-32 shrink-0 object-cover md:h-48 md:w-full" />
        <div className="p-3"><h3 className="font-semibold text-primary">{t(s.zh, s.en)}</h3><p className="mt-1 text-xs text-muted-foreground">{t(s.dzh, s.den)}</p></div>
      </article>)}
    </div>
    <h3 className="mb-2 mt-5 text-sm font-semibold">{t('门店影像', 'Store gallery')}</h3>
    <div className="flex snap-x gap-2 overflow-x-auto pb-2">
      {gallery.map(g => <figure key={g.image} className="relative w-28 shrink-0 snap-start overflow-hidden rounded-lg sm:w-44">
        <Image src={g.image} alt={t(g.zh, g.en)} className="aspect-square w-full object-cover" />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-1.5 text-[11px] text-primary-foreground">{t(g.zh, g.en)}</figcaption>
      </figure>)}
    </div>
  </section>;
}