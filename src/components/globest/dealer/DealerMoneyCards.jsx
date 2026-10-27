import React from 'react';
import { Wallet } from 'lucide-react';

export default function DealerMoneyCards({ summary, compact = false }) {
  const rows = compact ? [['累计收益', summary.total], ['提现占用 / 已申请', summary.reserved], ['可申请提现', summary.available]] : [['实际成交实收', summary.receipts], ['累计叠加收益', summary.total], ['采购可用余额', summary.balance], ['库存成本', summary.stock_cost]];
  return <section aria-label="经销商财务汇总" className="grid grid-cols-2 gap-3 sm:grid-cols-4">{rows.map(([label, value]) => <div key={label} className="min-w-0 rounded-2xl border border-border bg-card p-4"><span className="flex items-center gap-2 text-xs text-muted-foreground"><Wallet size={14} aria-hidden="true"/>{label}</span><strong className="mt-3 block break-words text-xl font-semibold text-primary">S${Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>)}</section>;
}