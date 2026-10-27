import React from 'react';
import { Image } from '@/components/ui/image';
import { images } from '@/components/globest/live/LiveStories';

const updates=[['From the mountains to your home','A conversation about wellbeing.',images[1]],['Meet the growers','discover the ingredients',images[2]],['Good conversations are worth the wait','Interested · tap to remove',images[0]]];
export default function LiveUpdates(){
  return <section className="live-updates"><div className="live-feed live-glass"><div className="live-section-head"><h2>Creator updates</h2><span>Following</span></div>{updates.map(([title,copy,image])=><div className="live-feed-item" key={title}><Image src={image} alt={title}/><div><b>{title}</b><span>{copy}</span></div></div>)}</div><div className="live-calendar live-glass"><div className="live-section-head"><h2>Live calendar</h2><span>All</span></div><div className="live-calendar-row"><b>首场滋补好物直播</b><span>Coming soon</span></div><div className="live-calendar-row"><b>From the mountains to your home</b><span>Planned</span></div><div className="live-calendar-row"><b>A conversation about wellbeing.</b><span>Planned</span></div></div></section>;
}