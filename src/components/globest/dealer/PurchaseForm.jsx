import { command } from '@/api/commerce';
import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { FIRST_LINE } from './useDealer';

export default function PurchaseForm({ user, d, notify }) {
  const [qty, setQty] = useState({}); const [useBal, setUseBal] = useState(true); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const catalog = useInfiniteQuery({ queryKey: ['dealer-products', d.summary?.account?.tier], initialPageParam: null, queryFn: ({ pageParam }) => base44.entities.Product.filter({ approval_status: 'published', is_demo: false, dealer_enabled: true }, { sort: 'name_zh', limit: 50, ...(pageParam ? { cursor: pageParam } : {}) }), getNextPageParam: page => page.has_more ? page.next_cursor : undefined });
  const tier = d.summary?.account?.tier;
  const products = (catalog.data?.pages.flatMap(page => page.items) || []).map(p=>({id:p.id,name_zh:p.name_zh,price:p[`dealer_price_${tier}`]})).filter(p=>Number.isFinite(p.price)&&p.price>0);
  const items = products.filter(p => qty[p.id] > 0).map(p => ({ product_id: p.id, name: p.name_zh, price: p.price, qty: qty[p.id] }));
  const amount = items.reduce((s, i) => s + Math.round(i.price * 100) * i.qty, 0) / 100;
  const used = !d.isFirst && useBal ? Math.min(Math.max(0, d.balance), amount) : 0;
  const credit = d.isFirst ? Math.max(0, amount - FIRST_LINE) : 0;
  const submit = async () => {
    if (d.isFirst && amount < FIRST_LINE) return notify(`首次采购需达到标准线 S$${FIRST_LINE}`);
    if (items.some(item => !Number.isInteger(item.qty) || item.qty < 1)) return setError('采购数量必须为正整数');
    setBusy(true); setError('');
    try { await command('commerce',{action:'purchase',items:items.map(i=>({product_id:i.product_id,qty:i.qty})),use_balance:useBal,expected_total:amount}); setQty({}); await d.reload(); notify('采购单已提交，等待主理人审核'); }
    catch (e) { setError(e.response?.data?.error || e.message); }
    finally { setBusy(false); }
  };
  return <section className="space-y-2 rounded-2xl bg-card p-4">
    <h2 className="font-bold">{d.isFirst ? `首次采购（标准线 S$${FIRST_LINE}，超出部分存入采购余额）` : '后次采购'}</h2>
    {catalog.isPending && <p role="status" className="py-3 text-sm text-muted-foreground">正在加载可采购商品…</p>}
    {catalog.isError && <p role="alert" className="py-3 text-sm text-destructive">商品读取失败，请稍后重试。</p>}
    {catalog.isSuccess && !products.length && <p role="status" className="py-3 text-sm text-muted-foreground">暂无已配置本等级拿货价的商品，请管理员核实价格。</p>}
    {products.map(p => <div key={p.id} className="flex items-center gap-2 text-sm"><span className="flex-1">{p.name_zh}</span><span className="text-muted-foreground">S${p.price}</span><input type="number" min="0" value={qty[p.id] || ''} onChange={e => setQty({ ...qty, [p.id]: Number(e.target.value) })} aria-label={`${p.name_zh}采购数量`} step="1" disabled={busy} className="w-16 rounded border px-2 py-1"/></div>)}
    {catalog.hasNextPage && <button type="button" disabled={catalog.isFetchingNextPage || busy} onClick={() => catalog.fetchNextPage()} className="min-h-11 w-full rounded-lg border border-border text-sm text-primary">{catalog.isFetchingNextPage ? '正在加载…' : '加载更多可采购商品'}</button>}
    {!d.isFirst && d.balance > 0 && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useBal} onChange={e => setUseBal(e.target.checked)}/>使用采购余额抵扣（可用 S${d.balance.toFixed(2)}）</label>}
    <div className="border-t pt-2 text-sm">合计 S${amount.toFixed(2)}{used > 0 && ` · 余额抵扣 −S$${used.toFixed(2)}`}{credit > 0 && ` · 存入余额 S$${credit.toFixed(2)}`}<b className="block text-lg text-[#B28A45]">应付 S${(amount - used).toFixed(2)}（线下付款）</b></div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <button type="button" disabled={!items.length || busy} onClick={submit} className="w-full rounded-xl bg-[#0F382C] py-2 font-bold text-white disabled:opacity-50">{busy ? '提交中…' : '提交采购单'}</button>
  </section>;
}
