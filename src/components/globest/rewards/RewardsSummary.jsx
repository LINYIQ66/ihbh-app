import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Wallet } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageStatus from '@/components/globest/PageStatus';

const TIERS = { standard: '普通会员', vip: 'VIP 会员', prestige: '尊享会员' };
export default function RewardsSummary({ me }) {
  const client = useQueryClient(), userId = me.data?.id;
  const summary = useQuery({ queryKey: ['points-summary', userId, 'rewards'], enabled: !!userId, retry: false, queryFn: async () => (await base44.functions.invoke('pointsLedger', { action: 'summary' })).data });
  useEffect(() => {
    if (!userId) return;
    return base44.entities.PointsLedger.subscribe(() => client.invalidateQueries({ queryKey: ['points-summary', userId] }));
  }, [client, userId]);
  if (me.isPending) return <p role="status" className="rounded-2xl bg-card p-6 text-sm">正在检查账户状态…</p>;
  if (me.isError) return <PageStatus title="账户暂时无法加载" onRetry={me.refetch} busy={me.isFetching}/>;
  if (!me.data || (summary.error?.status || summary.error?.response?.status) === 401) return <section className="rounded-2xl border bg-card p-5">
    <Wallet className="text-rewards" size={26} aria-hidden="true"/><h2 className="mt-3 font-heading text-xl">登录后查看我的积分资产</h2>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">关联账户余额、签到、积分流水与已有权益。未登录时不会展示推算余额。</p>
    <Link className="primary-btn mt-4" to="/login?returnTo=%2Frewards">登录我的账户</Link>
  </section>;
  if (summary.isPending) return <p role="status" className="rounded-2xl bg-card p-6 text-sm">正在读取账户积分…</p>;
  if (summary.isError || !summary.data) return <PageStatus title="积分暂时无法读取" message="不会使用本机体验积分替代账户余额，请重试。" onRetry={summary.refetch} busy={summary.isFetching}/>;
  const s = summary.data;
  return <section className="rounded-2xl bg-primary p-5 text-primary-foreground" aria-label="我的账户积分">
    <div className="flex items-center justify-between gap-3"><span className="text-sm">我的 HBH · 账户账本</span><button type="button" onClick={() => summary.refetch()} disabled={summary.isFetching} aria-label="刷新积分余额" className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/25"><RefreshCw size={17} className={summary.isFetching ? 'animate-spin' : ''} aria-hidden="true"/></button></div>
    <p className="mt-1 text-4xl font-semibold tabular-nums">{s.balance.toLocaleString()} <span className="text-sm">HBH</span></p>
    <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-primary-foreground/20 pt-4 text-sm"><div><dt className="opacity-75">累计获取</dt><dd className="mt-1 font-semibold">{s.lifetime.toLocaleString()} HBH</dd></div><div><dt className="opacity-75">会员等级</dt><dd className="mt-1 font-semibold">{TIERS[s.tier] || '未设置'}</dd></div></dl>
    <div className="mt-5 flex flex-wrap gap-3"><Link className="rounded-lg bg-card px-4 py-3 text-sm font-semibold text-primary" to="/assets">{s.checkedIn ? '今日已签到 · 查看流水' : '前往签到与资产'}</Link><Link className="rounded-lg border border-primary-foreground/30 px-4 py-3 text-sm" to="/tickets">我的权益票夹</Link></div>
  </section>;
}