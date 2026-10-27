import React from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { genecells, roles, colLabel } from './agencyData';

export default function RolePriceTable({ role }) {
  const { t } = useExperience();
  const cols = roles[role].cols;
  const own = cols[0];
  return <div className="overflow-x-auto rounded-2xl border bg-card">
    <table className="w-full min-w-[520px] text-sm">
      <thead className="bg-[#8a5a2b] text-white"><tr><th className="p-3 text-left">{t('产品', 'Product')}</th><th className="p-3">{t('规格', 'Spec')}</th>{cols.map(c => <th key={c} className="p-3">{t(...colLabel[c])}</th>)}<th className="p-3">{t('每单利润*', 'Margin*')}</th></tr></thead>
      <tbody>{genecells.map((p, i) => <tr key={p.zh} className={i % 2 ? 'bg-[#f6ead6]' : ''}>
        <td className="p-3 font-semibold">{t(p.zh, p.en)}</td><td className="p-3 text-center text-xs">{t(...p.spec)}</td>
        {cols.map(c => <td key={c} className={`p-3 text-center ${c === own ? 'font-bold text-[#8a5a2b]' : ''}`}>S${p[c].toLocaleString()}</td>)}
        <td className="p-3 text-center font-bold text-green-700">+S${(p.user - p[own]).toLocaleString()}</td>
      </tr>)}</tbody>
    </table>
    <p className="p-3 text-xs text-muted-foreground">{t('*每单利润 = 用户价 − 本级拿货价。售予下级（官方/总代）同样享级差利润。', '*Margin = user price − your cost. Selling to lower levels also earns the level difference.')}</p>
  </div>;
}