import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
export default function HeroVideo() {
  const { t, notify } = useExperience();
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const togglePlay = () => {
    if (!video.current) return;
    if (!video.current.paused) video.current.pause();
    else video.current.play().catch(() => notify(t('浏览器暂未允许播放，请再次点击播放。', 'Your browser paused playback. Tap play to try again.')));
  };
  return <>
    <video ref={video} className="hero-background-video" src="https://media.base44.com/videos/public/6aa3280ca2d875c1b77cdd8e/ceb974e6b_158.MP4" poster="https://media.base44.com/images/public/6aa3280ca2d875c1b77cdd8e/6d8b346cf_generated_image.png" autoPlay={!reduceMotion} muted={muted} loop playsInline preload={reduceMotion ? 'metadata' : 'auto'} disablePictureInPicture aria-label={t('iHBH 品牌视频背景', 'iHBH brand video background')} onLoadedData={() => setReady(true)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => {setFailed(true);setPlaying(false);}} />
    <div className="hero-video-controls">
      {failed ? <span role="status">{t('视频暂时无法加载', 'Video unavailable')}</span> : <>
        {!ready && !reduceMotion && <Loader2 size={15} className="animate-spin" aria-label={t('视频加载中', 'Loading video')}/>}
        <button onClick={togglePlay} aria-label={playing ? t('暂停背景视频', 'Pause background video') : t('播放背景视频', 'Play background video')} title={playing ? t('暂停', 'Pause') : t('播放', 'Play')}>{playing ? <Pause size={16}/> : <Play size={16}/>}</button>
        <button onClick={() => setMuted(value => !value)} aria-label={muted ? t('开启视频声音', 'Unmute video') : t('关闭视频声音', 'Mute video')} title={muted ? t('开启声音', 'Unmute') : t('静音', 'Mute')}>{muted ? <VolumeX size={16}/> : <Volume2 size={16}/>}</button>
      </>}
    </div>
  </>;
}