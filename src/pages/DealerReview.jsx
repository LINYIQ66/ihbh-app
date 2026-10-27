import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/globest/me/PageShell';
import PurchaseOrderReview from '@/components/globest/dealer/PurchaseOrderReview';
import DealerSalesReview from '@/components/globest/dealer/DealerSalesReview';

export default function DealerReview() {
  return <PageShell title="订单审核" sub="采购收款确认 · 销售实收核实 · 完成自动入账" needLogin>{user => user.role === 'admin' ? <><PurchaseOrderReview/><DealerSalesReview/><Link to="/crm?role=admin&tab=dealer-settings" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm text-primary">配置经销商身份与关系</Link></> : <p role="alert" className="rounded-2xl bg-card p-6 text-sm text-muted-foreground">仅门店管理员可审核订单与核实收款。</p>}</PageShell>;
}