import React from 'react';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { roles, genecells } from './agencyData';

export default function RoleIntro({ role }) {
  const { t } = useExperience();
  const r = roles[role]; const own = r.cols[0]; const p = genecells[0];
  const stats = [[t('拿货价', 'Your cost'), `S$${p[own]}`], [t('单瓶利润', 'Per-bottle margin'), `S$${p.user - p[own]}–${p.market - p[own]}`], [t('全业返利', 'Rebate'), `${r.rebate}%`], [t('居间奖励', 'Referral bonus'), '8%']];
  return <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
    <Image src={r.img} alt={r.en} className="h-48 w-full rounded-2xl md:h-full" />
    <div><p className="text-sm leading-relaxed">{t(r.pitchZh, r.pitchEn)}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">{stats.map(s => <div key={s[0]} className="rounded-xl bg-[#f6ead6] p-3"><span className="text-xs text-muted-foreground">{s[0]}</span><b className="block text-lg text-[#8a5a2b]">{s[1]}</b></div>)}</div>
      <p className="mt-2 text-xs text-muted-foreground">{t('以光子抗衰 60粒/瓶 为例。', 'Based on Photon Rejuvenation 60 caps.')}</p></div>
  </div>;
}