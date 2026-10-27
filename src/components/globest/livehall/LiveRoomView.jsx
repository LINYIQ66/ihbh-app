import React, { useEffect, useMemo, useState } from 'react';
import { X, Heart, Gift, Share2, ShoppingBag, Mic, MicOff, Video, UserPlus, LayoutGrid, Captions } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { gifts } from '@/components/globest/livehall/liveHallData';
import VideoGrid from '@/components/globest/livehall/VideoGrid';
import LiveChat from '@/components/globest/livehall/LiveChat';
import LiveShelf from '@/components/globest/livehall/LiveShelf';

const faces = ['photo-1500648767791-00dcc994a43e', 'photo-1494790108377-be9c29b29330', 'photo-1438761681033-6461ffad8d80', 'photo-1506794778202-cad84cf45f1a', 'photo-1534528741775-53994a69daeb', 'photo-1507003211169-0a1dd7228f2d', 'photo-1544005313-94ddf0286df2', 'photo-1527980965255-d3b416303d12', 'photo-1517841905240-472988babdf9'].map(f => `https://images.unsplash.com/${f}?auto=format&fit=crop&w=400&q=60`);
const subs = ['今天给大家介绍家用绿氧舱', 'Today: the home oxygen chamber', '下单立减 200 新币', 'S$200 off right now'];

export default function LiveRoomView({ room, onClose }) {
  const { t, state, update, notify } = useExperience();
  const [seats, setSeats] = useState(/** @returns {Array<{id:string|number,img?:string,name:string,me?:boolean,stream?:MediaStream,muted?:boolean}>} */ () => faces.slice(0, room.guests + 1).map((img, i) => ({ id: i, img, name: i ? t(`嘉宾${i}`, `Guest ${i}`) : room.host })));
  const [layout, setLayout] = useState([1, 2, 4, 6, 9].find(n => n >= room.guests + 1) || 9);
  const [likes, setLikes] = useState(0); const [danmaku, setDanmaku] = useState([]); const [showGifts, setShowGifts] = useState(false); const [rank, setRank] = useState({}); const [mic, setMic] = useState(true); const [sub, setSub] = useState(0);
  const followed = (state.liveFollows || []).includes(room.id);
  const me = seats.find(s => s.me);
  useEffect(() => { const i = setInterval(() => setSub(s => (s + 2) % subs.length), 4000); return () => clearInterval(i); }, []);
  useEffect(() => () => me?.stream?.getTracks().forEach(x => x.stop()), [me?.stream]);
  const joinMic = async () => {
    if (me) { me.stream?.getTracks().forEach(x => x.stop()); return setSeats(s => s.filter(x => !x.me)); }
    if (seats.length >= 9) return notify(t('麦位已满（最多 8 位嘉宾）', 'All 8 guest seats taken'));
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setSeats(s => [...s, { id: 'me', me: true, stream, name: t('我', 'Me') }]); setLayout(l => Math.max(l, [1, 2, 4, 6, 9].find(n => n >= seats.length + 1)));
  };
  const toggleMic = () => { me?.stream?.getAudioTracks().forEach(a => { a.enabled = !mic; }); setMic(!mic); setSeats(s => s.map(x => x.me ? { ...x, muted: mic } : x)); };
  const sendGift = g => { setRank(r => ({ ...r, [t('我', 'Me')]: (r[t('我', 'Me')] || 0) + g[3] })); addDm(`${t('我', 'Me')} ${t('送出', 'sent')} ${g[0]} ${t(g[1], g[2])}`); setShowGifts(false); };
  const addDm = text => setDanmaku(d => [...d.slice(-6), { text, id: Math.random(), top: 8 + Math.random() * 50 }]);
  const share = () => { navigator.clipboard.writeText(window.location.href); notify(t('直播链接已复制', 'Link copied')); };
  const top = useMemo(() => Object.entries({ 'Jason': 320, '小美': 180, ...rank }).sort((a, b) => b[1] - a[1]).slice(0, 3), [rank]);
  return <div className="fixed inset-0 z-[70] flex flex-col bg-black text-white lg:flex-row">
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-2 bg-gradient-to-b from-black/80 p-3">
        <img src={room.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /><div className="text-sm"><b>{room.host}</b><p className="text-xs text-white/70">{room.viewers.toLocaleString()} {t('在线', 'watching')} · ❤ {likes}</p></div>
        <button onClick={() => update(s => ({ ...s, liveFollows: followed ? s.liveFollows.filter(x => x !== room.id) : [...(s.liveFollows || []), room.id] }))} className={`rounded-full px-3 py-1 text-xs font-bold ${followed ? 'bg-white/20' : 'bg-rose-500'}`}>{followed ? t('已关注', 'Following') : t('关注', 'Follow')}</button>
        <div className="ml-auto hidden gap-1 text-xs md:flex">{top.map(([n, v], i) => <span key={n} className="rounded-full bg-white/15 px-2 py-0.5">{['🥇', '🥈', '🥉'][i]} {n} {v}</span>)}</div>
        <button onClick={onClose} className="ml-2"><X /></button></div>
      <div className="relative min-h-0 flex-1 pt-16"><VideoGrid seats={seats} layout={layout} />
        {danmaku.map(d => <span key={d.id} style={{ top: `${d.top}%` }} className="pointer-events-none absolute right-0 animate-[danmaku_8s_linear_forwards] whitespace-nowrap rounded-full bg-black/40 px-3 py-1 text-sm">{d.text}</span>)}
        <p className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded bg-black/70 px-3 py-1 text-sm"><Captions size={13} className="mr-1 inline" />{t(subs[sub], subs[sub + 1])}</p>
        <div className="absolute bottom-14 right-3 flex flex-col gap-3">{/** @type {Array<[import('lucide-react').LucideIcon,()=>void]>} */ ([[Heart, () => { setLikes(l => l + 1); }], [Gift, () => setShowGifts(!showGifts)], [Share2, share], [ShoppingBag, () => document.getElementById('live-shelf')?.scrollIntoView()]]).map(([I, f], i) => <button key={i} onClick={f} className="grid h-11 w-11 place-items-center rounded-full bg-black/50"><I size={20} /></button>)}</div>
        {showGifts && <div className="absolute bottom-14 right-16 grid grid-cols-4 gap-2 rounded-xl bg-black/80 p-3">{gifts.map(g => <button key={g[1]} onClick={() => sendGift(g)} className="text-center text-xs"><span className="text-2xl">{g[0]}</span><br />{t(g[1], g[2])}<br />{g[3]}🪙</button>)}</div>}</div>
      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 p-2 text-xs">
        <button onClick={joinMic} className={`flex items-center gap-1 rounded-full px-3 py-1.5 font-bold ${me ? 'bg-white/20' : 'bg-rose-500'}`}><UserPlus size={14} />{me ? t('下麦', 'Leave seat') : t('申请连麦', 'Join as guest')}</button>
        {me && <button onClick={toggleMic} className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5">{mic ? <Mic size={14} /> : <MicOff size={14} />}{mic ? t('静音', 'Mute') : t('开麦', 'Unmute')}</button>}
        <span className="ml-auto flex items-center gap-1"><LayoutGrid size={14} />{[1, 2, 4, 6, 9].map(n => <button key={n} onClick={() => setLayout(n)} className={`rounded px-2 py-1 ${layout === n ? 'bg-rose-500' : 'bg-white/10'}`}>{n}</button>)}</span>
        <Video size={14} className="text-white/50" /></div>
      <div id="live-shelf" className="bg-neutral-900"><LiveShelf featured={room.product ?? 0} /></div>
    </div>
    <aside className="flex h-72 flex-col border-l border-white/10 bg-neutral-950 lg:h-auto lg:w-80"><b className="border-b border-white/10 p-3 text-sm">{t('直播互动', 'Live chat')}</b><LiveChat onDanmaku={addDm} isAdmin /></aside>
  </div>;
}