import React from 'react';
import PageShell from '@/components/globest/me/PageShell';
import DealerBusinessPanel from '@/components/globest/dealer/DealerBusinessPanel';

export default function Dealer() {
  return <PageShell title="经销商中心" sub="账单 · 库存 · 分润收益，按实际成交实收计算" back="/crm?role=user&tab=dealers" needLogin>{user => <DealerBusinessPanel user={user}/>}</PageShell>;
}