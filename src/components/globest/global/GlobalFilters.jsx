import React from 'react';
import { Search } from 'lucide-react';

export default function GlobalFilters({ q, setQ, price, setPrice, sort, setSort }) {
  const selectClass = 'w-full min-w-0 rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary';
  return <section className="grid grid-cols-2 items-center gap-2 md:grid-cols-[minmax(0,1fr)_auto_auto_auto]" aria-label="商品搜索和排序">
    <label className="col-span-2 flex min-w-0 items-center gap-2 rounded-lg border bg-card px-3 md:col-span-1"><Search size={17} aria-hidden="true" className="shrink-0 text-muted-foreground"/><input value={q} onChange={e => setQ(e.target.value)} aria-label="搜索商品" placeholder="搜索商品名称…" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"/></label>
    <select aria-label="参考价格范围（美元）" value={price} onChange={e => setPrice(e.target.value)} className={selectClass}><option value="all">全部价格 · 美元</option><option value="under50">低于 US$50</option><option value="mid">US$50 – 200</option><option value="premium">高于 US$200</option></select>
    <select aria-label="商品排列方式" value={sort} onChange={e => setSort(e.target.value)} className={selectClass}><option value="category">默认排列</option><option value="price_usd">价格从低到高</option><option value="-price_usd">价格从高到低</option><option value="name_en">名称 A–Z</option></select>
    {(q || price !== 'all' || sort !== 'category') && <button type="button" onClick={() => { setQ(''); setPrice('all'); setSort('category'); }} className="text-xs text-muted-foreground underline underline-offset-4">重置</button>}
  </section>;
}