import React from 'react';
import { BadgeDollarSign, Receipt, ShoppingBag } from 'lucide-react';

export default function DealerPerformanceTotals({ totals }) {
  const money = value => `S$${Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const cards = [
    { title: '期间实际成交', value: money(totals.receipts), detail: '本人已完成订单的实收金额', Icon: Receipt },
    { title: '期间分润收益', value: money(totals.earnings), detail: '含毛差额、返利与奖励，扣除承担支出', Icon: BadgeDollarSign },
    { title: '完成销售单', value: `${totals.orders} 单`, detail: '不含未完成、取消及自用单', Icon: ShoppingBag }
  ];
  return <div className="grid gap-3 sm:grid-cols-3">{cards.map(({ title, value, detail, Icon }) => <div key={title} className="rounded-xl border border-champagne/30 bg-background/60 p-4"><div className="flex items-center justify-between gap-2 text-xs text-muted-foreground"><span>{title}</span><Icon size={17} className="text-primary" aria-hidden="true"/></div><strong className="mt-3 block break-words text-2xl font-semibold tabular-nums tracking-tight text-primary">{value}</strong><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p></div>)}</div>;
}