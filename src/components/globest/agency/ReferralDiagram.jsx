import React from 'react';
import { ArrowDown, Building2, X } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { roles } from './agencyData';

export default function ReferralDiagram({ role }) {
  const { t } = useExperience();
  const r = roles[role]; const name = t(r.zh, r.en); const payer = t(r.payerZh, r.payerEn);
  const gens = [0, 1, 2, 3, 4];
  const earn = n => n === 0 ? [] : [[n - 1, 5], [n - 2, 3], [n - 3, 2]].filter(([g]) => g >= 0);
  return <div className="rounded-2xl border bg-card p-4">
    <div className="mb-3 flex items-center gap-2 font-bold"><Building2 size={18} className="text-red-700" />{t('HBH 体验馆：按被介绍人首笔有实收的完成销售，支付直接介绍人 8% 一次性居间奖励', 'The HBH experience hall pays the direct introducer an 8% one-time referral bonus on the first completed paid sale')}</div>
    <div className="space-y-1">{gens.map(n => <React.Fragment key={n}>
      {n > 0 && <div className="flex items-center gap-2 pl-6 text-xs text-muted-foreground"><ArrowDown size={14} />{t('介绍', 'introduces')}</div>}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex h-12 w-24 items-center justify-center rounded-full border-2 border-[#c9a063] bg-[#fff8ec] text-sm font-bold">{name}{n || ''}</span>
        {earn(n).map(([g, pct]) => <span key={g} className="rounded-full bg-[#8a5a2b] px-2 py-1 text-xs text-white">{name}{g || ''} +{pct}%</span>)}
        {n === 4 && <span className="flex items-center gap-1 text-xs text-red-700"><X size={12} />{t(`与${name}（第一代）无关联，三代循环`, `No link to 1st-gen ${name} (3-gen cycle)`)}</span>}
      </div>
    </React.Fragment>)}</div>
    <p className="mt-3 rounded-lg bg-[#f6ead6] p-3 text-xs">{t(`销售回款奖励 5% / 3% / 2% 按被介绍人销售回款计算，${payer}；每笔只支付最近三位同级介绍人，第四级及更远不获奖。`, `5% / 3% / 2% sales-collection rewards on the referee's sales, ${payer}; only the nearest three peer referrers are paid.`)}</p>
  </div>;
}