import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LogIn } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MemberPointsBanner from '@/components/globest/MemberPointsBanner';
import MemberDashboardHeader from '@/components/globest/account/MemberDashboardHeader';
import MemberAccountTools from '@/components/globest/account/MemberAccountTools';
import MemberAccountDetails from '@/components/globest/account/MemberAccountDetails';
import MemberPersonalResources from '@/components/globest/account/MemberPersonalResources';
import MemberOrderList from '@/components/globest/account/MemberOrderList';
import MemberAddressManager from '@/components/globest/account/MemberAddressManager';
import '@/components/globest/member-account.css';

export default function MemberAccount() {
  const userQuery = useQuery({ queryKey: ['member-account-user'], queryFn: async () => {
    try { return await base44.auth.isAuthenticated() ? await base44.auth.me() : null; }
    catch (error) { if ((error.status || error.response?.status) === 401) return null; throw error; }
  } });
  const user = userQuery.data;
  const memberQuery = useQuery({ queryKey: ['member-account-tier', user?.email], enabled: !!user?.email, queryFn: () => base44.entities.MemberProfile.filter({ transaction_status: {$ne:'prepared'}, email: user.email }, '-joined_at', 1), refetchInterval: query => new URLSearchParams(window.location.search).get('package_checkout') === 'success' && query.state.data?.[0]?.payment_status !== 'test' ? 3000 : false });
  const member = memberQuery.data?.[0];
  if (userQuery.isPending) return <p role="status" className="account-loading">正在加载账户…</p>;
  if (userQuery.isError) return <p role="alert" className="p-5 text-destructive">账户读取失败，请稍后重试。</p>;
  if (!user) return <div className="referral-login"><LogIn aria-hidden="true"/><h3>登录后管理我的中心</h3><p>个人资料、地址和订单独立管理；经营账目请进入经销商。</p><button type="button" className="primary-btn" onClick={() => base44.auth.redirectToLogin('/crm?role=user&tab=account')}>登录账户</button></div>;
  return <div className="member-account"><MemberDashboardHeader user={user} member={member} loading={memberQuery.isPending} error={memberQuery.isError}/><MemberAccountTools user={user}/><MemberOrderList/><MemberPointsBanner/><section className="rounded-2xl border border-border bg-card p-5"><h2 className="text-sm text-muted-foreground">会员成长积分</h2><strong className="mt-2 block text-xl text-primary">{memberQuery.isPending ? '正在读取…' : memberQuery.isError ? '读取失败' : Number(member?.points_balance || 0).toLocaleString('zh-CN')}</strong><p className="mt-2 text-xs text-muted-foreground">与 HBH 体验积分独立记录，不计入经销商现金收益。</p></section><div id="member-addresses" className="scroll-mt-28"><MemberAddressManager user={user}/></div><MemberAccountDetails user={user} onSaved={userQuery.refetch}/><MemberPersonalResources user={user}/></div>;
}