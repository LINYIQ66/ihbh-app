import React, { useState } from 'react';
import { command } from '@/api/commerce';
import { Package } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
import MemberOrderFilters, { matchesMemberOrder } from '@/components/globest/account/MemberOrderFilters';

export default function MemberOrderList({ showHeading = true }) {
  const { state, refresh, notify } = useExperience();
  const [open, setOpen] = useState(null); const [status, setStatus] = useState('all');
  const orders = state.orders.filter(order => matchesMemberOrder(order, status));
  const cancel=async order=>{try{await command('commerce',{action:'cancel_order',id:order.id});await refresh();notify('已提交取消申请，等待审核退款');}catch(e){notify(e.response?.data?.error||e.message);}};
  return <section aria-label="我的订单" className="rounded-2xl border border-border bg-card p-4 sm:p-5">
    {showHeading && <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-primary"><Package size={19} aria-hidden="true"/>我的订单</h2>}
    <MemberOrderFilters value={status} onChange={setStatus}/>
    {status !== 'all' && <button type="button" onClick={() => setStatus('all')} className="mb-3 min-h-11 rounded px-2 text-xs text-primary underline">查看全部订单</button>}
    {!orders.length ? <p role="status" className="rounded-xl bg-muted/50 p-6 text-center text-sm text-muted-foreground">{state.orders.length ? '该状态下暂无订单' : '暂无订单'}</p> : <ul className="space-y-3">{orders.map(order => <li key={order.id} className="rounded-xl border border-border p-4">
      <button type="button" aria-expanded={open === order.id} aria-controls={`member-order-${order.id}`} onClick={() => setOpen(open === order.id ? null : order.id)} className="flex w-full flex-wrap items-start justify-between gap-3 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <span><strong className="break-all text-sm">订单 {order.id}</strong><span className="mt-1 block text-xs text-muted-foreground">{new Date(order.date).toLocaleString()} · {order.items.length} 件商品</span></span>
        <span className="text-right"><strong className="text-primary">S${order.total.toFixed(2)}</strong><span className="mt-1 block text-xs text-muted-foreground">{order.status === 'cancel_requested' ? '取消审核中' : order.status === 'cancelled' ? '已取消' : order.status === 'shipped' ? '已发货' : order.paid ? '已支付 · 未发货' : '待支付'}</span></span>
      </button>
      {open === order.id && <div id={`member-order-${order.id}`} className="mt-3 space-y-3 border-t border-border pt-3">{order.items.map(item => <div key={item.id} className="flex items-center gap-2 text-sm">{item.image && <Image src={item.image} alt={item.name_zh} className="h-10 w-10 shrink-0 rounded object-cover"/>}<span className="min-w-0 flex-1 break-words">{item.name_zh}</span><span className="shrink-0">×{item.quantity}</span><span className="shrink-0">S${(item.price * item.quantity).toFixed(2)}</span></div>)}
        {order.status === 'paid' && <button type="button" onClick={() => cancel(order)} className="min-h-11 w-full rounded-lg border border-destructive/30 py-2 text-sm text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">申请取消（未发货 / 未使用）</button>}
      </div>}
    </li>)}</ul>}
  </section>;
}