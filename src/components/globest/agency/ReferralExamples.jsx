import React from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { roles } from './agencyData';
import { peerRewardPreview } from './dealerRewards';

export default function ReferralExamples({ role }) {
  const { t } = useExperience();
  const n = t(roles[role].zh, roles[role].en);
  const base = 1000;
  const names = [n, `${n}A`, `${n}B`, `${n}C`, `${n}D`];
  const rewards = peerRewardPreview(base).rewards;
  const rows = [1, 2, 3, 4].map(i => [names[i], ...rewards.map((amount, level) => i > level ? `${names[i - level - 1]} S$${amount.toFixed(2)}` : '—'), `${names[i - 1]} S$80.00`]);
  return <div className="rounded-2xl border bg-card p-4">
    <h4 className="mb-2 font-bold">{t('同级转介绍：原介绍人 → A → B → C → D', 'Peer referrals: original introducer → A → B → C → D')}</h4>
    <p className="mb-3 text-xs text-muted-foreground">{t('各行均以该成交人首笔销售实收 S$1,000 为例；后续销售只发适用的回款奖励，不重复发 8%。', 'Each row assumes that seller’s first completed sale collects S$1,000. Later sales earn eligible collection rewards without another 8% bonus.')}</p>
    <div className="overflow-x-auto"><table className="w-full min-w-[580px] text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="py-2">{t('成交人', 'Seller')}</th><th>5%</th><th>3%</th><th>2%</th><th>{t('体验馆居间费 8%', 'Experience hall bonus 8%')}</th></tr></thead>
      <tbody>{rows.map(r => <tr key={r[0]} className="border-b">{r.map((cell, i) => <td key={i} className="py-2 pr-2">{cell}</td>)}</tr>)}</tbody></table></div>
    <p className="mt-2 text-xs text-muted-foreground">{t('C 的回款：B 得 5%、A 得 3%、原介绍人得 2%。D 的回款：C 得 5%、B 得 3%、A 得 2%，原介绍人不再获奖。所有 8% 居间费由 HBH 体验馆支付。', 'C’s receipts reward B 5%, A 3%, and the original introducer 2%. D’s receipts reward C 5%, B 3%, and A 2%; the original introducer receives zero. All 8% intermediary bonuses are funded by the HBH experience hall.')}</p>
  </div>;
}
