import React from 'react';
import { Link } from 'react-router-dom';
import DealerAccountSettings from '@/components/globest/dealer/DealerAccountSettings';
import DealerSalesReview from '@/components/globest/dealer/DealerSalesReview';

export default function DealerAdministration({ user }) {
  if (user?.role !== 'admin') return <p role="alert" className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">仅管理员可管理经销商身份及核实订单实收。</p>;
  return <div className="space-y-5"><DealerAccountSettings/><DealerSalesReview/><Link to="/dealer-review" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm text-primary">进入采购审核与收款确认</Link></div>;
}