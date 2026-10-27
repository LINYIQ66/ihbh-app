import React from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { flow, ledger } from './erpData';

const tone = { Paid: 'bg-green-100 text-green-800', Pending: 'bg-amber-100 text-amber-800', 'Experience hall to pay': 'bg-blue-100 text-blue-800', Reversed: 'bg-red-100 text-red-700' };
export default function SettlementFlow() {
  const { t } = useExperience();
  return <div className="space-y-3">
    <div className="flex flex-wrap items-center gap-1 rounded-2xl border bg-card p-4">{flow.map((f, i) => <React.Fragment key={f[0]}>{i > 0 && <ArrowRight size={14} className="text-[#c9a063]" />}<span className="rounded-full bg-[#f6ead6] px-3 py-1 text-xs font-bold">{i + 1}. {t(f[0], f[1])}</span></React.Fragment>)}</div>
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <table className="w-full min-w-[520px] text-sm"><thead className="bg-[#0F382C] text-white"><tr><th className="p-2 text-left">{t('订单', 'Order')}</th><th>{t('会员', 'Member')}</th><th>{t('商品', 'Item')}</th><th>{t('金额', 'Amount')}</th><th>{t('规则', 'Rule')}</th><th>{t('佣金', 'Comm.')}</th><th>{t('状态', 'Status')}</th></tr></thead>
        <tbody>{ledger.map(l => <tr key={l[0]} className="border-b text-center"><td className="p-2 text-left font-mono text-xs">{l[0]}</td><td>{t(l[1], l[2])}</td><td>{l[3]}</td><td>S${l[4].toLocaleString()}</td><td className="text-xs">{l[5]}</td><td className={`font-bold ${l[6] < 0 ? 'text-red-600' : 'text-green-700'}`}>S${l[6]}</td><td><span className={`rounded-full px-2 py-0.5 text-[10px] ${tone[l[8]]}`}>{t(l[7], l[8])}</span></td></tr>)}</tbody></table>
      <p className="p-2 text-[10px] text-amber-700">{t('示例数据', 'Sample data')}</p>
    </div>
    <div className="flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs"><ShieldAlert size={18} className="shrink-0 text-amber-700" /><ul className="list-disc space-y-1 pl-4"><li>{t('系统必须防止同笔交易重复分润。', 'Each transaction can be commissioned only once.')}</li><li>{t('8% 按首笔有实收的完成销售计算，由 HBH 体验馆支付；适用收益叠加，同级回款奖励最多三级。', 'The HBH experience hall funds 8% of the first completed paid sale. Eligible earnings stack; peer rewards stop at three levels.')}</li><li>{t('退款涉及的佣金须核对原始账目及实际处理结果，不以示例数据作为冲回凭据。', 'Reconcile commissions affected by refunds against the original records and actual processing; sample rows are not reversal evidence.')}</li></ul></div>
  </div>;
}
