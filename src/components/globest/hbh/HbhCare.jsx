import React from 'react';
import { Link } from 'react-router-dom';
import { Wind } from 'lucide-react';
import { Image } from '@/components/ui/image';
import ProductMasonry from '@/components/globest/ProductMasonry';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { oxygen, packages, devices } from '@/components/globest/agency/agencyData';

export default function HbhCare() {
  const { t } = useExperience();
  return <div className="space-y-6">
    <section><h2 className="mb-3 flex items-center gap-2 text-xl font-bold"><Wind className="text-green-700" />{t('微压氧舱体验', 'Mild hyperbaric oxygen sessions')}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{oxygen.map(([zh, en, member, price]) => <div key={en} className="rounded-2xl border bg-card p-4"><b>{t(zh, en)}</b><p className="mt-2 text-sm text-muted-foreground line-through">S${price}</p><p className="text-xl font-bold text-[#8a5a2b]">S${member} <span className="text-xs font-normal">{t('会员价', 'member')}</span></p></div>)}</div></section>
    <section><h3 className="mb-2 font-bold">{t('疗程卡', 'Session packages')}</h3>
      <div className="grid gap-3 sm:grid-cols-3">{packages.map(([zh, en, p]) => <div key={en} className="rounded-2xl bg-gradient-to-br from-[#8a5a2b] to-[#c9a063] p-4 text-white"><b>{t(zh, en)}</b><p className="text-2xl font-black">S${p.toLocaleString()}</p></div>)}</div></section>
    <section><h3 className="mb-2 font-bold">{t('居家康养好物', 'Home wellness devices')}</h3>
      <ProductMasonry className="grid grid-cols-2 gap-3 lg:grid-cols-4">{devices.map(([zh, en, p, img]) => <div key={en} className="overflow-hidden rounded-2xl border bg-card"><Image src={img} alt={en} className="masonry-product-visual aspect-square w-full" /><div className="p-3"><b className="text-sm">{t(zh, en)}</b><p className="font-bold text-[#8a5a2b]">S${p}</p></div></div>)}</ProductMasonry></section>
    <Link to="/discover?section=local" className="block rounded-2xl border bg-green-50 p-4 text-center font-bold text-green-800">{t('预约附近康养门店 →', 'Book a nearby wellness store →')}</Link>
  </div>;
}