import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LiveDiscovery from '@/components/globest/live/LiveDiscovery';
import VideoLibrary from '@/components/globest/videos/VideoLibrary';
import VideoEditorialContent from '@/components/globest/videos/VideoEditorialContent';

export default function Live() {
  const [params] = useSearchParams();
  const videos = params.get('tab') === 'videos';
  return <div className="customer-module">
    <nav className="page-inner flex gap-3 pb-0" aria-label="直播与视频入口">
      <Link className={videos ? 'outline-btn' : 'primary-btn'} to="/live" aria-current={!videos ? 'page' : undefined}>直播</Link>
      <Link className={videos ? 'primary-btn' : 'outline-btn'} to="/live?tab=videos" aria-current={videos ? 'page' : undefined}>视频</Link>
    </nav>
    {videos ? <div className="page-inner"><h1 className="mb-4 font-heading text-3xl">视频专区</h1><VideoLibrary/><VideoEditorialContent/></div> : <LiveDiscovery/>}
  </div>;
}