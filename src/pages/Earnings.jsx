import React from 'react';
import PageShell from '@/components/globest/me/PageShell';
import DealerFinance from '@/components/globest/dealer/DealerFinance';
import DealerWithdrawals from '@/components/globest/dealer/DealerWithdrawals';

export const EARN_TYPE = { direct: '直销收益', referral: '推荐收益', downline: '下级分润', service: '服务权益', settlement: '结算' };
export default function Earnings() {
  return <PageShell title="结算及收益" sub="实际账单 · 叠加收益 · 财务审核提现" back="/crm?role=user&tab=dealers" needLogin>{user => <DealerFinance user={user}>{summary => <DealerWithdrawals user={user} summary={summary}/>}</DealerFinance>}</PageShell>;
}