import React from 'react';
import { Link } from 'react-router-dom';
import useMe from '@/hooks/useMe';
import DealerBusinessPanel from '@/components/globest/dealer/DealerBusinessPanel';
import DealerTierPlans from '@/components/globest/dealer/DealerTierPlans';

export default function DealerWorkspace() {
  const user = useMe();
  if (user.isPending) return <p role="status" className="p-6 text-center text-muted-foreground">正在加载经销商中心…</p>;
  if (user.isError) return <p role="alert" className="p-6 text-destructive">账户读取失败，请稍后重试。</p>;
  if (!user.data) return <div className="space-y-5"><DealerTierPlans/><div className="rounded-2xl border border-border bg-card p-6 text-center"><p className="text-sm text-muted-foreground">登录后查看本人的账单、库存、分润与收益。</p><Link to="/login?returnTo=%2Fcrm%3Frole%3Duser%26tab%3Ddealers" className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm text-primary-foreground">登录账户</Link></div></div>;
  return <DealerBusinessPanel user={user.data}/>;
}