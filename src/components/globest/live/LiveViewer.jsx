import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import useLivePlayback from '@/components/globest/live/useLivePlayback';
import LiveRoomPanels from '@/components/globest/live/LiveRoomPanels';
export default function LiveViewer({ room, onClose }) {
  const [attempt, setAttempt] = useState(0), [controlError, setControlError] = useState(''), [muted, setMuted] = useState(true);
  const stageRef = useRef(null);
  const { videoRef, canvasRef, direct, status, viewers } = useLivePlayback(room.id, attempt);
  const fullScreen = async () => {
    try {
      const video = videoRef.current;
      if (stageRef.current?.requestFullscreen) await stageRef.current.requestFullscreen();
      else if (direct && video?.webkitEnterFullscreen) video.webkitEnterFullscreen();
      else setControlError('当前设备不支持此全屏入口，请使用视频原生控件。');
    } catch { setControlError('暂时无法全屏，请使用视频原生控件。'); }
  };
  return <Dialog open onOpenChange={open => !open && onClose()}><DialogContent className="live-customer-dialog customer-module">
    <div className="pr-7"><DialogTitle>{room.title}</DialogTitle><DialogDescription>主播：{room.host_name} · {status ? '尚无可确认的播放画面' : direct ? '直连画面播放中' : '兼容画面接收中（低帧率，无声音）'}</DialogDescription></div>
    <div ref={stageRef} className="live-customer-stage"><video ref={videoRef} autoPlay muted={muted} onVolumeChange={e => setMuted(e.currentTarget.muted)} playsInline controls aria-label="直播视频，使用原生控件播放与调整音量"/>{!direct && <canvas ref={canvasRef} className="pointer-events-none" aria-label="兼容直播画面"/>}{status && <div className="signal-status pointer-events-none" role="status" aria-live="polite">{status}</div>}</div>
    <div className="flex flex-wrap items-center gap-3 text-sm"><button className="primary-btn" onClick={onClose}>退出直播房</button><button className="text-link" disabled={!direct || !!status} aria-pressed={!muted} onClick={() => { if (videoRef.current) videoRef.current.muted = !muted; setMuted(value => !value); }}>{muted ? '开启声音' : '静音'}</button><button className="text-link" disabled={!!status} onClick={fullScreen}>画面全屏</button>{status && <button className="text-link" onClick={() => { setControlError(''); setAttempt(value => value + 1); }}>重新连接</button>}<span>{!status && viewers !== null ? `实时连接观众：${viewers} 人` : '在线人数暂不可核实'}</span></div>
    <p className="text-xs text-muted-foreground">视频默认静音，可通过视频原生控件开启声音、调节音量；兼容画面不含音轨。</p>{controlError && <p role="alert">{controlError}</p>}
    <LiveRoomPanels/>
  </DialogContent></Dialog>;
}