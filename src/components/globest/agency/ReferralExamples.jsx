import React from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { roles } from './agencyData';

export default function ReferralExamples({ role }) {
  const { t } = useExperience();
  const n = t(roles[role].zh, roles[role].en);
  const base = 4900; // Explicit collected-sale example, not a purchase-price basis
  const rows = [[`${n}2`, `${n}3`, '8% + 5%', `S$${(base * 0.13).toFixed(2)}`], [`${n}1`, `${n}3`, '3%', `S$${(base * 0.03).toFixed(2)}`], [`${n}`, `${n}3`, '2%', `S$${(base * 0.02).toFixed(2)}`]];
  return <div className="rounded-2xl border bg-card p-4">
    <h4 className="mb-2 font-bold">{t('算例：第三级被介绍人的首笔销售实际收款 S$4,900', 'Example: the third referred dealer collects S$4,900 on their first completed sale')}</h4>
    <table className="w-full text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="py-2">{t('获得者', 'Earner')}</th><th>{t('成交人', 'Seller')}</th><th>{t('比例', 'Rate')}</th><th>{t('收入', 'Income')}</th></tr></thead>
      <tbody>{rows.map(r => <tr key={r.join()} className="border-b"><td className="py-2 font-semibold">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td className="font-bold text-green-700">{r[3]}</td></tr>)}</tbody></table>
    <p className="mt-2 text-xs text-muted-foreground">{t('直接介绍人获 S$392 首单奖励及 S$245 回款奖励；另两级获 S$147、S$98。三级回款合计 S$490，由该成交人的指定承担方记支出；8% 由总部承担。', 'The direct referrer earns S$392 once plus S$245; the next two earn S$147 and S$98. The designated payer funds S$490 in peer rewards; HQ funds the 8% bonus.')}</p>
  </div>;
}