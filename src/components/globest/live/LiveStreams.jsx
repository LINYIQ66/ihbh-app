import React from 'react';
import { Image } from '@/components/ui/image';
import { images } from '@/components/globest/live/LiveStories';

const streams=[{image:images[0],viewers:'2.4K watching',title:'From the mountains to your home',copy:'A conversation about wellbeing.',tag:'● wellness ritual'},{image:images[2],viewers:'986 watching',title:'首场滋补好物直播正在筹备。',copy:'开播时间及主播信息将在确认后公布。',tag:'● kitchen wellness'}];
export default function LiveStreams(){
  return <section className="live-stream-section"><div className="live-section-head"><h2>Live for you</h2><span>Following　Recommended　Nearby</span></div><div className="live-stream-grid">{streams.map(item=><article className="live-stream-card live-glass" key={item.title}><div className="live-stream-media"><Image src={item.image} alt={item.title}/><span className="live-pill">LIVE</span><span className="live-viewer-pill">{item.viewers}</span></div><div className="live-stream-info"><h3>{item.title}</h3><p>{item.copy}</p><div className="live-stream-foot"><span>{item.tag}</span><button className="live-round-btn">Join</button></div></div></article>)}</div></section>;
}