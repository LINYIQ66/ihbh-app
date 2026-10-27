import React from 'react';

export const PO_STATUS = { pending: '待审核', approved: '已审核·待付款', paid: '已收款·待收货', received: '已收货', rejected: '已驳回' };

export default function OrderRow({ o, children }) {
  return <div className="rounded-xl border p-3 text-sm">
    <div className="flex justify-between"><b>{o.dealer_name} {o.is_first && <span className="ml-1 rounded bg-[#B28A45] px-1 text-xs text-white">首次</span>}</b><span className="text-xs">{PO_STATUS[o.status]}</span></div>
    <p className="text-muted-foreground">{o.items.map(i => `${i.name} · S$${Number(i.price).toFixed(2)} × ${i.qty}`).join('、')}</p>
    <p>S${o.amount.toFixed(2)}{o.balance_used > 0 && ` · 抵扣 S$${o.balance_used.toFixed(2)}`}{o.balance_credit > 0 && ` · 存余额 S$${o.balance_credit.toFixed(2)}`}</p>
    {children}
  </div>;
}