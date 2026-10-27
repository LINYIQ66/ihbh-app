import React, { useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
const KINDS = [['sale', '自销出货'], ['self_use', '无实收库存领用'], ['downline', '下级采购出货']];
export default function ShipForm({ d, notify }) {
  const ids = Object.keys(d.stock).filter(id => d.stock[id].qty > 0);
  const [form, setForm] = useState({ product_id: '', qty: 1, kind: 'sale', customer: '', amount: 0 });
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const requestKey = useRef(crypto.randomUUID());
  const set = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const submit = async event => {
    event.preventDefault(); setError('');
    if (!d.stock[form.product_id] || !Number.isInteger(form.qty) || form.qty < 1 || form.qty > d.stock[form.product_id].qty) return setError('数量必须为正整数，且不能超过库存');
    setBusy(true);
    try { await base44.functions.invoke('dealerOperations', { action: 'ship', ...form, idempotency_key: requestKey.current }); requestKey.current = crypto.randomUUID(); setForm({ product_id: '', qty: 1, kind: 'sale', customer: '', amount: 0 }); await d.reload(); notify(form.kind === 'self_use' ? '自用已登记并扣减在库数量，不生成销售收益' : '出货已登记并预留库存；订单完成后自动扣减在库数量并入账'); }
    catch (e) { setError(e.response?.data?.error || e.message); }
    finally { setBusy(false); }
  };
  if (!ids.length) return <p role="status" className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">暂无可用库存，采购单确认收货后可登记出货。</p>;
  return <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5"><h2 className="font-semibold text-primary">登记出货</h2><fieldset disabled={busy} className="grid gap-3 text-sm sm:grid-cols-2"><label>商品<select required value={form.product_id} onChange={e => set('product_id', e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-border bg-card px-3"><option value="">请选择库存商品</option>{ids.map(id => <option key={id} value={id}>{d.stock[id].name}（可用 {d.stock[id].qty}）</option>)}</select></label><label>出货类型<select value={form.kind} onChange={e => set('kind', e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-border bg-card px-3">{KINDS.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label>数量<input required type="number" min="1" step="1" value={form.qty} onChange={e => set('qty', Number(e.target.value))} className="mt-1 min-h-11 w-full rounded-lg border border-border bg-card px-3"/></label><label>客户或下级（选填）<input maxLength={200} value={form.customer} onChange={e => set('customer', e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-border bg-card px-3"/></label>{form.kind !== 'self_use' && <label className="sm:col-span-2">登记成交金额 S$（待财务核实，不作为已收款）<input required type="number" min="0" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-border bg-card px-3"/></label>}</fieldset><p className="text-xs text-muted-foreground">进货成本按真实已收货批次锁定；自用仅扣库存，不生成销售收益。</p>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button type="submit" disabled={busy} className="min-h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50">{busy ? '正在登记…' : '确认出货'}</button></form>;
}