import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, LogIn } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import useMe from '@/hooks/useMe';
import PageStatus from '@/components/globest/PageStatus';

export default function PageShell({ title, sub = '', needLogin = false, back = '/me', children }) {
  const { data: user, isLoading, isError, refetch, isFetching } = useMe();
  let body = children;
  if (needLogin && isLoading) body = <p role="status" className="p-8 text-center text-muted-foreground">正在检查登录状态…</p>;
  else if (needLogin && isError) body = <PageStatus title="无法确认账户状态" onRetry={refetch} busy={isFetching}/>;
  else if (needLogin && !user) body = <div className="rounded-2xl bg-card p-8 text-center"><LogIn className="mx-auto mb-2"/><p className="mb-3">登录后使用此功能</p><button className="rounded-xl bg-[#0F382C] px-5 py-2 font-bold text-white" onClick={() => base44.auth.redirectToLogin(window.location.href)}>登录后继续</button></div>;
  else if (typeof children === 'function') body = children(user);
  return <div className="mx-auto max-w-3xl space-y-4 px-3 py-5">
    <header className="flex items-center gap-2"><Link to={back} aria-label="返回上一层" className="rounded-full bg-card p-2"><ChevronLeft size={18}/></Link><div><h1 className="text-xl font-black">{title}</h1>{sub && <p className="text-xs text-muted-foreground">{sub}</p>}</div></header>
    {body}
  </div>;
}