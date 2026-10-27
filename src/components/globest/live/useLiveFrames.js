import { useEffect } from 'react';
export default function useLiveFrames(active, viewers, streamRef, roomRef) {
  useEffect(() => {
    if (!active || !viewers || !streamRef.current?.getVideoTracks().length) return;
    const source = document.createElement('video');
    source.muted = true; source.playsInline = true; source.srcObject = streamRef.current;
    source.play().catch(() => {});
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const timer = setInterval(() => {
      if (source.readyState < 2 || !context) return;
      canvas.width = 480; canvas.height = Math.max(1, Math.round(480 * source.videoHeight / source.videoWidth));
      context.drawImage(source, 0, 0, canvas.width, canvas.height);
      const frame = canvas.toDataURL('image/jpeg', 0.5);
      if (frame.length <= 96000) roomRef.current?.send({ type: 'frame', frame });
    }, 500);
    return () => { clearInterval(timer); source.pause(); source.srcObject = null; };
  }, [active, viewers > 0]);
}