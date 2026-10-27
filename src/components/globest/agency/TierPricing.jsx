import React from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { tiers, margins } from './systemData';

export default function TierPricing() {
  const { t } = useExperience();
  return <div className="grid gap-3 md:grid-cols-2">
    <div className="rounded-2xl border bg-card p-4">
      <h4 className="mb-3 font-bold">{t('四级销售体系示意（光子抗衰单瓶）', '4-tier pricing pyramid (per bottle)')}</h4>
      <div className="flex flex-col items-center gap-1">{tiers.map((x, i) => <div key={x.zh} className={`${x.w} flex justify-between rounded-lg px-3 py-2 text-sm text-white`} style={{ background: ['#5c3a17', '#8a5a2b', '#b07d45', '#c9a063'][i] }}><b>{t(x.zh, x.en)}</b><span>S${x.price}</span></div>)}
        <div className="w-full rounded-lg border-2 border-dashed border-[#c9a063] px-3 py-2 text-center text-sm">{t('市场指导价 S$668', 'Market guide S$668')}</div></div>
      <p className="mt-3 text-xs text-muted-foreground">{t('六瓶组合用户价 S$3,080，十二瓶 S$6,042。', '6-bottle set S$3,080; 12-bottle S$6,042 (user price).')}</p>
    </div>
    <div className="overflow-x-auto rounded-2xl border bg-card p-4">
      <h4 className="mb-2 font-bold">{t('各级毛差价（单瓶）', 'Gross spread by channel (per bottle)')}</h4>
      <table className="w-full text-sm"><thead><tr className="border-b text-muted-foreground"><th className="py-1 text-left">{t('销售路径', 'Path')}</th><th>{t('进价', 'Cost')}</th><th>{t('售价', 'Sell')}</th><th>{t('毛差', 'Spread')}</th></tr></thead>
        <tbody>{margins.map(m => <tr key={m[0]} className="border-b text-center"><td className="py-2 text-left">{t(m[0], m[1])}</td><td>S${m[2]}</td><td>S${m[3]}</td><td className="font-bold text-green-700">S${m[3] - m[2]}</td></tr>)}</tbody></table>
      <p className="mt-2 text-xs text-amber-700">{t('注：差价为毛收入，不等于净利润。', 'Note: spread is gross income, not net profit.')}</p>
    </div>
  </div>;
}