import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Video } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import usePublicCollection from '@/components/globest/usePublicCollection';
import CollectionFeedback from '@/components/globest/CollectionFeedback';
import LiveViewer from '@/components/globest/live/LiveViewer';
import TalentIntro from '@/components/globest/live/TalentIntro';
import MemberLiveEntry from '@/components/globest/live/MemberLiveEntry';
const tabs = [['recommend','推荐'],['following','关注'],['upcoming','预告'],['replay','回放']];
const notices = { following: '关注关系尚未接入持久化服务，暂不能关注或接收通知。', upcoming: '暂无已确认的直播预告；预约与开播通知尚未接入。', replay: '暂无已核实的直播回放视频源。已结束的直播不等于可播放的回放。' };
export default function LiveDiscovery() {
  const [tab, setTab] = useState('recommend'), [watching, setWatching] = useState(null);
  const client = useQueryClient();
  const collection = usePublicCollection('LiveRoom', { status: 'live' }, '-started_at', tab === 'recommend');
  useEffect(() => base44.entities.LiveRoom.subscribe(event => {
    if (event.type !== 'update' || ['live', 'ended'].includes(event.data?.status)) {
      client.invalidateQueries({ queryKey: ['public-collection', 'LiveRoom'] });
      client.invalidateQueries({ queryKey: ['public-count', 'LiveRoom'] });
    }
  }), [client]);
  return <div className="customer-module page-inner space-y-5 pb-8"><header className="rounded-2xl bg-primary p-5 text-primary-foreground"><span className="text-xs">iHBH · 直播发现</span><h1 className="mt-2 text-2xl font-semibold">看见好物，走近真实分享</h1><p className="mt-3 text-sm">仅展示已登记的直播房，进入后验证主播连接与实际画面；不展示演示人气或模拟聊天。</p></header>
    <TalentIntro/>
    <MemberLiveEntry onRoomsChanged={collection.refetch}/>
    <nav className="flex gap-2" aria-label="直播内容分类">{tabs.map(([key, label]) => <button key={key} aria-pressed={tab === key} className={`flex-1 rounded-full border py-3 text-sm ${tab === key ? 'bg-primary text-primary-foreground' : 'bg-card'}`} onClick={() => setTab(key)}>{label}</button>)}</nav>
    {tab === 'recommend' ? <section aria-label="直播房发现"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">已登记直播房</h2><button className="text-link" disabled={collection.isFetching} onClick={collection.refetch}>刷新列表</button></div><p className="mb-4 text-xs text-muted-foreground">登记状态不保证正在传输视频，观看状态以房间实际连接为准。</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{collection.items.map(room => <button key={room.id} onClick={() => setWatching(room)} className="flex aspect-[9/16] flex-col justify-between rounded-xl border bg-primary p-4 text-left text-primary-foreground" aria-label={`进入直播房并验证信号：${room.title}`}><span className="text-xs">直播房 · 待验证信号</span><Video size={36} aria-hidden="true"/><div><h3 className="font-semibold">{room.title}</h3><p className="mt-2 text-xs">主播：{room.host_name}</p></div></button>)}</div>
      <CollectionFeedback collection={collection} unit="个房间" empty="暂无直播，稍后可刷新查看。"/>
    </section> : <section className="rounded-xl border bg-card p-6" role="status"><h2 className="mb-3 font-semibold">{tabs.find(([key]) => key === tab)?.[1]}</h2><p className="text-sm text-muted-foreground">{notices[tab]}</p></section>}
    <p className="text-xs text-muted-foreground">浏览和观看不申请摄像头、麦克风；会员主动授权后才开播，不发送模拟评论或创建预约，现有直播连接尚未通过生产容量验证。</p>
    {watching && <LiveViewer room={watching} onClose={() => { setWatching(null); collection.refetch(); }}/>} 
  </div>;
}