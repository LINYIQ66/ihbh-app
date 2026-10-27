import React from 'react';

export default function DealerStockCard({ item }) {
  const counts = [['在库', item.on_hand ?? '—'], ['已预留', item.reserved ?? '—'], ['可出货', item.qty]];
  return <li className="min-w-0 rounded-xl border border-champagne/25 bg-background/50 p-4">
    <div className="flex items-start justify-between gap-3"><h3 className="min-w-0 break-words text-sm font-semibold leading-relaxed text-primary">{item.name}</h3><span className={item.qty < 0 ? 'shrink-0 rounded-full bg-destructive/10 px-2 py-1 text-xs text-destructive' : 'shrink-0 rounded-full bg-primary/5 px-2 py-1 text-xs text-primary'}>{item.qty < 0 ? '待核对' : item.qty === 0 ? '暂无可用' : '可出货'}</span></div>
    <dl className="mt-5 grid grid-cols-3 divide-x divide-border">{counts.map(([label, value]) => <div key={label} className="px-1 text-center"><dt className="text-xs text-muted-foreground">{label}</dt><dd className={value < 0 ? 'mt-2 text-xl font-semibold tabular-nums text-destructive' : 'mt-2 text-xl font-semibold tabular-nums text-primary'}>{value}<span className="ml-1 text-xs font-normal text-muted-foreground">件</span></dd></div>)}</dl>
    <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">可用库存成本 <span className="float-right tabular-nums">S${item.stock_cost.toFixed(2)}</span></p>
  </li>;
}