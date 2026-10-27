import React from 'react';
import { Wind } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { roles } from './agencyData';

export default function ProfitSharing({ role }) {
  const { t } = useExperience();
  const r = roles[role];
  return <div className="grid gap-3 md:grid-cols-2">
    <div className="rounded-2xl bg-gradient-to-br from-[#8a5a2b] to-[#c9a063] p-5 text-white">
      <span className="text-sm opacity-80">{t('全业产品返利（除 GeneCells 三款）', 'All-industry rebate (excl. 3 GeneCells)')}</span>
      <strong className="my-2 block text-5xl">{r.rebate}%</strong>
      <p className="text-sm">{t('适用于自用或直接关系成交的金额：九珍堂滋养系列、氧舱、艾灸仪、护目镜、睡眠枕等。不与会员体系同时使用。', 'On self-use or direct-referral amounts: JiuZhenTang series, oxygen chamber, moxibustion, goggles, pillows. Not combinable with membership.')}</p>
    </div>
    {role === 'partner' ? <div className="rounded-2xl border bg-card p-4">
      <h4 className="mb-2 font-bold">{t('分润场景（合计 30%）', 'Profit-sharing scenarios (30% total)')}</h4>
      <table className="w-full text-sm"><thead><tr className="border-b text-muted-foreground"><th className="py-2 text-left">{t('场景', 'Scenario')}</th><th>{t('合伙人', 'Partner')}</th><th>{t('官方', 'Official')}</th><th>{t('总代', 'Agent')}</th></tr></thead>
        <tbody><tr className="border-b text-center"><td className="py-2 text-left">{t('下线官方带人消费', 'Downline Official refers')}</td><td>10%</td><td>20%</td><td>—</td></tr><tr className="text-center"><td className="py-2 text-left">{t('下线总代带人消费', 'Downline Agent refers')}</td><td>10%</td><td>10%</td><td>10%</td></tr></tbody></table>
    </div> : <div className="rounded-2xl border bg-card p-4 text-sm"><h4 className="mb-2 font-bold">{t('招募与引流', 'Recruitment & leads')}</h4><p>{t('HBH 招募培养合伙人，合伙人再招募培养官方与总代。公司对外引流成交的官方/总代平均分配给合伙人，由合伙人合理分配总代给线下官方。', 'HBH trains Partners, who recruit Officials & Agents. Company-sourced Officials/Agents are split evenly among Partners, who allocate Agents to their Officials.')}</p></div>}
    <div className="flex items-center gap-3 rounded-2xl border bg-green-50 p-4 md:col-span-2"><Wind className="text-green-700" /><p className="text-sm">{t(`氧舱免费次数：${r.zh}每月 ${r.oxygen} 次（合伙人 20 / 官方 5 / 总代 2），按月清零，不可累积。`, `Free oxygen sessions: ${r.oxygen}/month as ${r.en} (Partner 20 / Official 5 / Agent 2). Monthly reset, no carryover.`)}</p></div>
  </div>;
}