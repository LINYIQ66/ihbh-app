import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import OrderRow from '@/components/globest/dealer/OrderRow';

export default function DealerPurchaseList({ d, notify }) {
  const [busy, setBusy] = useState(''); const [error, setError] = useState('');
  const receive = async order => {
    setBusy(order.id); setError('');
    try { await base44.functions.invoke('dealerOperations', { action: 'receive', order_id: order.id }); await d.reload(); notify('已确认收货，库存已入账'); }
    catch (e) { setError(e.response?.data?.error || e.message); }
    finally { setBusy(''); }
  };
  return <section className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5"><h2 className="font-semibold text-primary">采购账单</h2>{d.orders.length ? d.orders.map(order => <OrderRow key={order.id} o={order}>{order.status === 'paid' && <button type="button" disabled={!!busy} onClick={() => receive(order)} className="mt-2 min-h-11 w-full rounded-lg bg-primary text-primary-foreground disabled:opacity-50">{busy === order.id ? '正在确认…' : '确认收货并计入库存'}</button>}</OrderRow>) : <p role="status" className="py-5 text-center text-sm text-muted-foreground">暂无采购单。</p>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}{d.moreOrders && <button type="button" disabled={d.loadingMoreOrders} onClick={d.loadOrders} className="min-h-11 w-full rounded-lg border border-border text-sm text-primary disabled:opacity-50">{d.loadingMoreOrders ? '正在加载…' : '加载更多采购单'}</button>}</section>;
}