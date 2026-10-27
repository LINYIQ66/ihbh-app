import React, { useState } from 'react';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { gallery } from '@/components/globest/genecells/genecellsData';

export default function GeneCellsGallery() {
  const { t } = useExperience();
  const [all, setAll] = useState(false);
  const list = all ? gallery : gallery.slice(0, 12);
  return <div className="rounded-xl border bg-card p-5">
    <h3 className="font-heading text-lg text-primary">{t('GENECELLS 品牌图册', 'GENECELLS brand gallery')}</h3>
    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">{list.map(src => <a key={src} href={src} target="_blank" rel="noreferrer"><Image src={src} alt="GENECELLS" fittingType="fit" className="aspect-square w-full rounded-lg bg-muted" /></a>)}</div>
    {gallery.length > 12 && <button type="button" className="secondary-btn mt-4" onClick={() => setAll(!all)}>{all ? t('收起', 'Show less') : t(`查看全部 ${gallery.length} 张`, `View all ${gallery.length}`)}</button>}
  </div>;
}