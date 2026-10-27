import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Camera } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import LiveBroadcaster from '@/components/globest/live/LiveBroadcaster';
import '@/components/globest/live/user-live.css';

export default function MemberLiveEntry({ onRoomsChanged }) {
  const [studio, setStudio] = useState(false), [opening, setOpening] = useState(false);
  const user = useQuery({ queryKey: ['live-user'], retry: false, queryFn: async () => {
    if (!await base44.auth.isAuthenticated()) return null;
    try { return await base44.auth.me(); } catch (error) { if ((error.status || error.response?.status) === 401) return null; throw error; }
  } });
  const bans = useQuery({ queryKey: ['member-live-ban', user.data?.id], enabled: !!user.data?.id, retry: false,
    queryFn: async () => (await base44.entities.LiveBan.filter({ user_id: user.data.id }, { limit: 1 })).items });
  const banned = !!bans.data?.length;
  const openStudio = async () => { setOpening(true); try { const current = await bans.refetch(); if (!current.isError && !current.data?.length) setStudio(true); } finally { setOpening(false); } };
  const closeStudio = () => { setStudio(false); onRoomsChanged(); };
  return <section className="rounded-2xl border bg-card p-4 sm:p-5" aria-labelledby="member-live-title">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 id="member-live-title" className="text-xl font-semibold">会员发起直播，大家一起看</h2><p className="mt-2 text-sm text-muted-foreground">登录会员可使用摄像头、麦克风开播；其他人从下方直播房加入同一场直播。</p></div>
      {user.isLoading ? <p role="status">正在确认登录状态…</p> : user.isError ? <div role="alert"><p>登录状态读取失败，暂时无法开播。</p><button className="text-link" onClick={() => user.refetch()}>重试</button></div> : !user.data ? <Link className="primary-btn" to="/login?returnTo=%2Flive">登录后开播</Link> : !studio && <button className="primary-btn" disabled={bans.isLoading || bans.isFetching || bans.isError || banned || opening} onClick={openStudio}><Camera size={16} aria-hidden="true"/>{opening || bans.isLoading ? '正在确认开播资格…' : banned ? '直播功能已停用' : '我要开播'}</button>}
    </div>
    {bans.isError && <div role="alert" className="mt-3 text-sm"><p>开播资格读取失败，暂时无法开播。</p><button className="text-link" onClick={() => bans.refetch()}>重试资格检查</button></div>}
    {banned && <p role="status" className="mt-3 text-sm">您的直播功能已被管理员停用，请联系客服了解详情。</p>}
    {studio && user.data && <LiveBroadcaster user={user.data} t={zh => zh} onClose={closeStudio}/>}
    <p className="mt-3 text-xs text-muted-foreground">只有点击“授权摄像头并开播”才会申请设备权限；沿用现有小规模直播连接，跨网络连通性及生产容量尚待验证。</p>
  </section>;
}