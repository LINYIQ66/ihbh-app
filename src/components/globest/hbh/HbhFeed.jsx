import React from 'react';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { feed } from './hbhContent';

export default function HbhFeed() {
  const { t } = useExperience();
  return <section className="my-6">
    <div className="mb-3 flex items-end justify-between"><h2 className="font-heading text-xl text-primary sm:text-2xl">{t('猜你喜欢 · 健康生活', 'For you · Healthy living')}</h2><span className="text-xs text-muted-foreground">{t('让人类更健康，生活更美好', 'Healthier people, better lives')}</span></div>
    <div className="columns-2 gap-2 sm:gap-4 md:columns-3 lg:columns-4">
      {feed.map((item, i) => <article key={item.zh} className="mb-2 break-inside-avoid overflow-hidden rounded-xl border bg-card sm:mb-4">
        <Image src={item.image} alt={t(item.zh, item.en)} className={i % 3 === 0 ? 'aspect-[3/4] w-full object-cover' : 'aspect-square w-full object-cover'} />
        <div className="p-2.5 sm:p-3"><h3 className="line-clamp-2 text-[13px] font-semibold leading-snug sm:text-sm"><span className="mr-1 rounded bg-primary px-1 py-0.5 text-[10px] font-normal text-primary-foreground">{t(...item.tag)}</span>{t(item.zh, item.en)}</h3><p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground sm:text-xs">{t(item.dzh, item.den)}</p></div>
      </article>)}
    </div>
  </section>;
}