import React from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { shareScenarios } from './systemData';
import { recharge } from './agencyData';

export default function ShareAndMember() {
  const { t } = useExperience();
  return <div className="grid gap-3 md:grid-cols-2">
    <div className="overflow-x-auto rounded-2xl border bg-card p-4">
      <h4 className="mb-2 font-bold">{t('产品销售分润矩阵', 'Sales profit-share matrix')}</h4>
      <table className="w-full text-sm"><thead><tr className="border-b text-muted-foreground"><th className="py-1 text-left">{t('场景', 'Scenario')}</th><th>{t('合伙人', 'Partner')}</th><th>{t('官方', 'Official')}</th><th>{t('总代', 'Agent')}</th><th>{t('合计', 'Total')}</th></tr></thead>
        <tbody>{shareScenarios.map(s => <tr key={s[0]} className="border-b text-center"><td className="py-2 text-left">{t(s[0], s[1])}</td>{[s[2], s[3], s[4]].map((v, i) => <td key={i}>{v ? `${v}%` : '—'}</td>)}<td className="font-bold">{s[2] + s[3] + s[4]}%</td></tr>)}</tbody></table>
      <p className="mt-2 text-xs text-amber-700">{t('上述分润场景互斥，不能简单重复叠加。', 'Scenarios are mutually exclusive and do not stack.')}</p>
    </div>
    <div className="overflow-x-auto rounded-2xl border bg-card p-4">
      <h4 className="mb-2 font-bold">{t('会员充值赠送比例', 'Recharge bonus ratio')}</h4>
      <table className="w-full text-sm"><thead><tr className="border-b text-muted-foreground"><th className="py-1 text-left">{t('档位', 'Tier')}</th><th>{t('充值', 'Pay')}</th><th>{t('赠送', 'Bonus')}</th><th>{t('比例', 'Ratio')}</th></tr></thead>
        <tbody>{recharge.map(r => <tr key={r[0]} className="border-b text-center"><td className="py-2 text-left font-bold">{r[0]}</td><td>S${r[1].toLocaleString()}</td><td>S${r[2].toLocaleString()}</td><td className="font-bold text-green-700">{(r[2] / r[1] * 100).toFixed(2).replace(/\.00$/, '')}%</td></tr>)}</tbody></table>
      <p className="mt-2 text-xs text-muted-foreground">{t('另附人参或氧舱体验；会员权益不得与合伙人及其他活动叠加。', 'Plus ginseng or oxygen gifts; not combinable with partner or other offers.')}</p>
    </div>
  </div>;
}