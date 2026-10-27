import React from 'react';
import { Image } from '@/components/ui/image';
import { images } from '@/components/globest/live/LiveStories';

const replays=[['Discover the stories behind the roots.',images[0]],['Meet the growers, discover the ingredients',images[1]],['get closer to your wellness ritual.',images[2]]];
export default function LiveReplay(){
  return <section className="live-replay live-glass"><div className="live-section-head"><h2>Replay collection</h2><span>Explore</span></div><div className="live-replay-row">{replays.map(([copy,image])=><div className="live-replay-item" key={copy}><Image src={image} alt={copy}/><span>{copy}</span></div>)}</div></section>;
}