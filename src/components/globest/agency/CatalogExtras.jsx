import React from 'react';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { oxygen, packages, devices } from './agencyData';

export default function CatalogExtras() {
  const { t } = useExperience();
  return <div className="grid gap-3 md:grid-cols-2">
    <div className="rounded-2xl border bg-green-50 p-4">
      <h4 className="mb-2 font-bold text-green-800">{t('微压氧舱（60分钟/次）', 'Micro-pressure oxygen chamber (60 min)')}</h4>
      <table className="w-full text-sm"><thead><tr className="border-b text-muted-foreground"><th className="py-1 text-left">{t('项目', 'Program')}</th><th>{t('用户', 'User')}</th><th>{t('市场价', 'Market')}</th></tr></thead>
        <tbody>{oxygen.map(o => <tr key={o[0]} className="border-b text-center"><td className="py-2 text-left">{t(o[0], o[1])}</td><td className="font-bold">S${o[2]}</td><td className="line-through text-muted-foreground">S${o[3]}</td></tr>)}</tbody></table>
      <div className="mt-3 grid grid-cols-3 gap-2">{packages.map(p => <div key={p[0]} className="rounded-xl bg-white p-2 text-center"><b className="block text-green-800">{t(p[0], p[1])}</b><span className="text-sm">S${p[2].toLocaleString()}</span></div>)}</div>
    </div>
    <div className="grid grid-cols-2 gap-2">{devices.map(d => <div key={d[0]} className="overflow-hidden rounded-2xl border bg-card"><Image src={d[3]} alt={d[1]} className="h-24 w-full" /><div className="p-2"><b className="block text-sm">{t(d[0], d[1])}</b><span className="text-[#8a5a2b] font-bold">S${d[2].toLocaleString()}</span></div></div>)}</div>
  </div>;
}