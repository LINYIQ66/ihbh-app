import React, { useState } from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { rewardLevels } from './systemData';
import { peerRewardPreview } from './dealerRewards';

export default function RewardCalculator() {
  const { t } = useExperience();
  const [amt, setAmt] = useState(10000);
  const preview=peerRewardPreview(amt);
  return <div className="rounded-2xl border bg-card p-4">
    <h4 className="font-bold">{t('三级推荐奖励计算器', '3-level reward calculator')}</h4>
    <label className="mt-2 block text-sm">{t('下级销售回款（S$）', 'Downline collected sales (S$)')}
      <input type="number" min="0" max="1000000" step="0.01" value={amt} onChange={e => setAmt(Number(e.target.value) || 0)} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
    <div className="mt-3 grid grid-cols-3 gap-2">{rewardLevels.map((l,i) => <div key={l[0]} className="rounded-xl bg-[#f6ead6] p-3 text-center"><span className="text-xs">{t(l[0], l[1])} · {l[2]}%</span><b className="block text-lg text-[#8a5a2b]">{preview?`S$${preview.rewards[i].toFixed(2)}`:'—'}</b></div>)}</div>
    <div className="mt-2 flex justify-between rounded-xl bg-[#8a5a2b] p-3 text-white"><span>{t('逐项取分后合计', 'Total after rounding each reward')}</span><b>{preview?`S$${preview.total.toFixed(2)}`:'—'}</b></div>
    {!preview&&<p role="alert">{t('金额需为非负数，最多两位小数，且不超过 S$1,000,000。','Enter a non-negative amount up to S$1,000,000 with at most two decimal places.')}</p>}
    <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
      <li>{t('总部按被介绍经销商首笔有实收的完成销售，给予直接介绍人一次性 8% 奖励。', 'HQ pays the direct referrer 8% of the referred dealer’s first completed paid sale, once only.')}</li>
      <li>{t('超过三代不再向原始推荐人分润。', 'No rewards beyond the 3rd generation.')}</li>
    </ul>
  </div>;
}
