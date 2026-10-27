import React from 'react';
import { Gift } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { recharge, traffic } from './agencyData';

export default function MemberAndTraffic() {
  const { t } = useExperience();
  return <div className="space-y-4">
    <div><h3 className="mb-2 text-lg font-bold">{t('HBH 会员充值方案', 'HBH member recharge plans')}</h3>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">{recharge.map(r => <div key={r[0]} className="rounded-2xl border bg-card p-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-bold text-white">{r[0]}</span><p className="mt-2 text-xs text-muted-foreground">{t('充值', 'Recharge')}</p><b className="text-lg">S${r[1].toLocaleString()}</b><p className="text-xs text-muted-foreground">{t('赠送', 'Bonus')}</p><b className="text-green-700">S${r[2].toLocaleString()}</b><p className="mt-1 text-xs">{t(r[3], r[4])}</p></div>)}</div>
      <p className="mt-2 text-xs text-muted-foreground">{t('会员体系不与合伙人及其他活动同时使用。', 'Membership cannot be combined with partner or other activities.')}</p></div>
    <div><h3 className="mb-2 text-lg font-bold">{t('HBH 流量体系：帮您获客', 'HBH traffic system: we bring customers')}</h3>
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">{traffic.map(x => <div key={x[0]} className="flex gap-2 rounded-2xl border bg-card p-3"><Gift size={18} className="shrink-0 text-[#c9a063]" /><div><b className="text-sm">{t(x[0], x[1])}</b><p className="text-xs text-muted-foreground">{t(x[2], x[3])}</p></div></div>)}</div>
      <p className="mt-2 text-xs text-muted-foreground">{t('流量活动不与合伙人体系及其他活动同时使用。', 'Traffic activities cannot be combined with the partner system.')}</p></div>
  </div>;
}