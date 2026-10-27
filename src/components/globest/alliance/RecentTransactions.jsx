import React from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';

const typeLabel = { sale: ['销售', 'Sale'], referral: ['引流', 'Referral'], refund: ['退款', 'Refund'] };
export default function RecentTransactions({ items }) {
  const { t } = useExperience();
  if (!items.length) return <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">{t('暂无流水记录', 'No transactions yet')}</p>;
  return <div className="overflow-x-auto rounded-xl border bg-card"><table className="w-full min-w-[420px] text-sm">
    <thead className="bg-muted text-left"><tr><th className="p-2">{t('日期', 'Date')}</th><th className="p-2">{t('商家', 'Merchant')}</th><th className="p-2">{t('类型', 'Type')}</th><th className="p-2 text-right">{t('金额', 'Amount')}</th></tr></thead>
    <tbody>{items.map(x => <tr key={x.id} className="border-t"><td className="p-2">{x.date}</td><td className="p-2">{x.business_name}</td><td className="p-2">{t(...(typeLabel[x.type] || typeLabel.sale))}</td><td className={`p-2 text-right font-bold ${x.amount < 0 ? 'text-red-600' : 'text-green-700'}`}>S${Number(x.amount).toLocaleString()}</td></tr>)}</tbody>
  </table></div>;
}