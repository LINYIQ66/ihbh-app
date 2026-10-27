import React from 'react';
import { CreditCard, PackageCheck, RefreshCcw, Star, Truck } from 'lucide-react';
const filters = /** @type {Array<[string, string, import('lucide-react').LucideIcon]>} */ ([['unpaid', '待付款', CreditCard], ['unshipped', '待发货', PackageCheck], ['shipped', '待收货', Truck], ['review', '待评价', Star], ['aftersale', '售后 / 取消', RefreshCcw]]);
export function matchesMemberOrder(order, status) {
  if (status === 'all') return true;
  if (status === 'aftersale') return ['cancelled','cancel_requested'].includes(order.status) || !!order.cancelled || !!order.refund_status;
  if (['cancelled','cancel_requested'].includes(order.status) || order.cancelled || order.refund_status) return false;
  const delivery = order.shipping_status || order.status;
  if (status === 'unpaid') return !order.paid;
  if (status === 'unshipped') return !!order.paid && !['shipped', 'delivered', 'completed'].includes(delivery);
  if (status === 'shipped') return delivery === 'shipped';
  return ['delivered', 'completed'].includes(delivery) && !order.reviewed;
}
export default function MemberOrderFilters({ value, onChange }) {
  return <div role="group" aria-label="订单状态筛选" className="mb-4 grid grid-cols-5 gap-1 border-b border-border pb-4">{filters.map(([key, label, Icon]) => <button type="button" key={key} aria-pressed={value === key} onClick={() => onChange(value === key ? 'all' : key)} className={value === key ? 'flex min-h-16 flex-col items-center justify-center gap-2 rounded-lg bg-primary/10 px-1 text-primary focus-visible:ring-2 focus-visible:ring-primary' : 'flex min-h-16 flex-col items-center justify-center gap-2 rounded-lg px-1 text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary'}><Icon size={22} aria-hidden="true"/><span className="text-[11px] sm:text-xs">{label}</span></button>)}</div>;
}