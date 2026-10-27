import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Camera, LogIn, Play, Radio } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import LiveBroadcaster from '@/components/globest/live/LiveBroadcaster';
import LiveBanAdmin, { banHost } from '@/components/globest/live/LiveBanAdmin';
import LiveViewer from '@/components/globest/live/LiveViewer';
import '@/components/globest/live/user-live.css';

export default function UserLiveHub() {
  const {t}=useExperience(); const [studio,setStudio]=useState(false); const [watching,setWatching]=useState(null);
  const userQuery=useQuery({queryKey:['live-user'],queryFn:async()=>await base44.auth.isAuthenticated()?base44.auth.me():null});
  const roomsQuery=useQuery({queryKey:['active-live-rooms'],queryFn:async()=>{const page=await base44.entities.LiveRoom.filter({status:'live'},{sort:'-started_at',limit:50});return page.items;},refetchInterval:5000}); const rooms=roomsQuery.data||[];
  useEffect(()=>{const unsubscribe=base44.entities.LiveRoom.subscribe(()=>roomsQuery.refetch());roomsQuery.refetch();return unsubscribe;},[]);
  const bansQuery=useQuery({queryKey:['live-bans'],queryFn:()=>base44.entities.LiveBan.list('-created_date',200)}); const bans=bansQuery.data||[];
  const me=userQuery.data; const isAdmin=me?.role==='admin'; const banned=me&&bans.some(b=>b.user_id===me.id);
  const openStudio=()=>{if(!me)return base44.auth.redirectToLogin('/live');if(banned)return alert(t('您的直播功能已被管理员关闭，如有疑问请联系客服。','Your live streaming has been disabled by an admin. Please contact support.'));setStudio(true);};
  const doBan=async room=>{const reason=prompt(t(`关闭 ${room.host_name} 的直播功能？可填写原因：`,`Disable live streaming for ${room.host_name}? Optional reason:`));if(reason===null)return;await banHost(room,reason);bansQuery.refetch();roomsQuery.refetch();};
  return <section className="user-live-hub"><div className="user-live-intro"><div><span className="live-eyebrow">LIVE CREATOR COMMUNITY</span><h2>{t('每位会员，都可以分享自己的直播','Every member can go live')}</h2><p>{t('直接使用浏览器摄像头和麦克风开播，无需安装其他软件。','Broadcast from your browser camera and microphone—no extra software needed.')}</p></div><button className="start-live-cta" onClick={openStudio}>{userQuery.data?<Camera/>:<LogIn/>}{t('我要开播','Go live')}</button></div>{studio&&<LiveBroadcaster user={userQuery.data} t={t} onClose={()=>{setStudio(false);roomsQuery.refetch();}}/>}<div className="active-live-head"><h3><Radio/>{t('用户直播','Member lives')}</h3><span>{rooms.length} {t('场直播中','live now')}</span></div>{rooms.length?<div className="active-live-grid">{rooms.map(room=><div key={room.id} className="relative"><button className="active-live-card w-full" onClick={()=>setWatching(room)}><span className="member-live-badge">LIVE</span><div className="member-live-play"><Play/></div><div><b>{room.title}</b><p>{room.host_name} · {room.viewer_count||0} {t('人观看','watching')}</p></div></button>{isAdmin&&room.host_user_id!==me.id&&<button onClick={()=>doBan(room)} className="absolute right-2 top-2 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">{t('关闭直播并禁播','End & ban')}</button>}</div>)}</div>:<div className="no-member-live"><Radio/><p>{t('目前没有用户正在直播，成为今天第一位主播。','No member is live right now. Be the first host today.')}</p></div>}{isAdmin&&<LiveBanAdmin bans={bans} t={t} onChange={bansQuery.refetch}/>}{watching&&<LiveViewer room={watching} onClose={()=>setWatching(null)}/>}</section>;
}