import React from 'react';
import PageShell from '@/components/globest/me/PageShell';
import MemberOrderList from '@/components/globest/account/MemberOrderList';

export default function Orders() {
  return <PageShell title="订单记录" sub="订单详情与售后"><MemberOrderList showHeading={false}/></PageShell>;
}