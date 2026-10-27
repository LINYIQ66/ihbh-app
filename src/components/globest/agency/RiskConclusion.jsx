import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { risks } from './systemData';

const pillars = [['低价供货', 'Low-cost supply'], ['分级销售', 'Tiered sales'], ['推荐奖励', 'Referral rewards'], ['会员复购', 'Member repurchase']];
export default function RiskConclusion() {
  const { t } = useExperience();
  return <div className="space-y-3">
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">{risks.map(r => <div key={r[0]} className="rounded-2xl border border-amber-200 bg-amber-50 p-3"><b className="flex items-center gap-1 text-sm text-amber-800"><AlertTriangle size={15} />{t(r[0], r[1])}</b><p className="mt-1 text-xs">{t(r[2], r[3])}</p></div>)}</div>
    <div className="rounded-2xl bg-[#0F382C] p-5 text-white">
      <h4 className="text-lg font-bold">{t('结论', 'Conclusion')}</h4>
      <div className="my-3 flex flex-wrap items-center gap-2">{pillars.map((p, i) => <React.Fragment key={p[0]}>{i > 0 && <span className="text-[#e8d3a7]">＋</span>}<span className="rounded-full bg-[#e8d3a7] px-3 py-1 text-sm font-bold text-black">{t(p[0], p[1])}</span></React.Fragment>)}</div>
      <p className="text-sm opacity-90">{t('制度具备获客与扩张设计，但正式执行前，必须统一佣金口径、核算真实毛利和返款成本，并审查新加坡多层次销售及消费者保护相关合规要求。', 'The model is built for acquisition and expansion, but before launch it must unify commission bases, verify true margins and refund costs, and pass Singapore MLM and consumer-protection compliance review.')}</p>
    </div>
  </div>;
}