import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import createLivePeer, { receiveCandidate, receiveDescription } from '@/components/globest/live/livePeer';
export default function useLivePlayback(roomId, attempt) {
  const videoRef = useRef(null), canvasRef = useRef(null);
  const [direct, setDirect] = useState(false), [status, setStatus] = useState('正在连接直播…'), [viewers, setViewers] = useState(null);
  useEffect(() => {
    let disposed = false, drawing = false, candidates = [], peer, socket, sub, lastFrame = 0, ended = false;
    setDirect(false); setStatus('正在连接直播…'); setViewers(null);
    const fail = message => { if (!disposed) { setStatus(message); setDirect(false); } };
    const handle = async msg => {
      if (disposed) return;
      if (msg.type === 'status') { if (msg.live) { ended = false; setStatus('主播已连接，等待实际画面…'); socket.send({ type: 'join' }); } else { ended = true; fail('暂无可用直播信号，主播尚未连接。'); } }
      else if (msg.type === 'frame' && !ended && !drawing && canvasRef.current) {
        drawing = true; const image = new window.Image();
        image.onload = () => { if (!disposed && !ended && canvasRef.current) { const canvas = canvasRef.current; canvas.width = image.width; canvas.height = image.height; canvas.getContext('2d')?.drawImage(image, 0, 0); lastFrame = Date.now(); setStatus(''); } drawing = false; };
        image.onerror = () => { drawing = false; fail('画面加载失败，请重新连接。'); }; image.src = msg.frame;
      } else if (msg.type === 'offer' && !ended) {
        peer?.close(); const currentPeer = createLivePeer(); peer = currentPeer; currentPeer.pendingCandidates.push(...candidates); candidates = [];
        currentPeer.ontrack = e => { if (disposed || ended || peer !== currentPeer || !videoRef.current) return; const video = videoRef.current; video.srcObject = e.streams[0] || new MediaStream([e.track]); video.onplaying = () => { if (!disposed && !ended) { setDirect(true); setStatus(''); } }; video.play().catch(() => fail('请点击视频播放控件开始观看。')); };
        currentPeer.onconnectionstatechange = () => { if (peer === currentPeer && ['failed', 'disconnected'].includes(currentPeer.connectionState)) fail('直连中断，正在等待兼容画面或重连。'); };
        currentPeer.onicecandidate = e => !disposed && peer === currentPeer && e.candidate && socket.send({ type: 'ice', targetSeat: msg.fromSeat, candidate: e.candidate });
        await receiveDescription(currentPeer, msg.sdp); if (disposed || ended || peer !== currentPeer) return; const answer = await currentPeer.createAnswer(); await currentPeer.setLocalDescription(answer); if (!disposed && !ended && peer === currentPeer) socket.send({ type: 'answer', targetSeat: msg.fromSeat, sdp: answer });
      } else if (msg.type === 'ice') { if (peer) await receiveCandidate(peer, msg.candidate); else if (msg.candidate) candidates.push(msg.candidate); }
      else if (msg.type === 'viewer_count' && Number.isFinite(msg.viewers)) setViewers(msg.viewers);
      else if (msg.type === 'host_ended') { ended = true; peer?.close(); videoRef.current?.pause(); fail('直播已结束。'); }
      else if (msg.type === 'error') fail('直播连接不可用，请稍后重试。');
    };
    try { socket = base44.actors.LiveBroadcast(roomId).connect({ id: crypto.randomUUID() }); sub = socket.subscribe(msg => { handle(msg).catch(() => fail('直播连接失败，请重新连接。')); }); }
    catch { fail('无法连接直播服务，请稍后重试。'); }
    const timeout = setTimeout(() => { if (!disposed) setStatus(value => value.includes('正在连接') || value.includes('等待实际画面') ? '暂无可用直播画面，请稍后重试。' : value); }, 15000);
    const stale = setInterval(() => { if (lastFrame && Date.now() - lastFrame > 15000 && (!videoRef.current?.srcObject || videoRef.current.readyState < 3)) fail('直播画面已中断，请重新连接。'); }, 5000);
    return () => { disposed = true; clearTimeout(timeout); clearInterval(stale); sub?.unsubscribe(); socket?.close(); peer?.close(); };
  }, [roomId, attempt]);
  return { videoRef, canvasRef, direct, status, viewers };
}