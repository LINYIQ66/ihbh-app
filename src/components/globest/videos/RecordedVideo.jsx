import React, { useState } from 'react';
import safePublicUrl from '@/components/globest/safePublicUrl';

export default function RecordedVideo({ title, src, vertical = false, description = '' }) {
  const [attempt, setAttempt] = useState(0), [error, setError] = useState(false), [loading, setLoading] = useState(false), [stalled, setStalled] = useState(false);
  const url = safePublicUrl(src);
  const retry = () => { setError(false); setStalled(false); setLoading(true); setAttempt(value => value + 1); };
  return <figure className="min-w-0 overflow-hidden rounded-xl border bg-card">
    {url ? <video key={`${url}:${attempt}`} src={url} controls playsInline preload="metadata" aria-label={`预录视频：${title}`} className={vertical ? 'aspect-[9/16] w-full bg-foreground object-contain' : 'aspect-video w-full bg-foreground object-contain'}
      onLoadStart={() => setLoading(true)} onLoadedMetadata={() => setLoading(false)} onPlaying={() => { setLoading(false); setStalled(false); }}
      onWaiting={() => setStalled(true)} onStalled={() => { setLoading(false); setStalled(true); }}
      onError={() => { setError(true); setLoading(false); setStalled(false); }}>当前浏览器不支持播放此视频。</video> : null}
    <figcaption className="space-y-2 p-3"><h3 className="text-sm font-semibold">{title}</h3>{description && <p className="text-xs text-muted-foreground">{description}</p>}
      {!url || error ? <div role="alert" className="text-sm"><p>{url ? '视频加载或解码失败，请重试原来源；未替换视频。' : '该条目缺少有效视频来源，暂时无法播放。'}</p>{url && <button type="button" onClick={retry} className="text-link mt-2" aria-label={`重新加载${title}`}>重试播放</button>}</div> : <>
        {loading && <p role="status" className="text-xs text-muted-foreground">正在读取视频…</p>}
        {(stalled || loading) && <div className="text-xs"><p>{stalled ? '视频加载或缓冲暂时停滞，可重载原来源。' : '若长时间未载入，可重载原来源。'}</p><button type="button" className="text-link mt-1" onClick={retry} aria-label={`重新加载${title}`}>重新加载</button></div>}
      </>}
    </figcaption>
  </figure>;
}