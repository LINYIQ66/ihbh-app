import React, { useEffect, useState } from 'react';
import { Image } from '@/components/ui/image';

const poster = 'https://media.base44.com/images/public/6aa3280ca2d875c1b77cdd8e/6f3d53f59_EmeraldiHBHGlobalShoppingPoster.png';

export default function MobileSplash({ children }) {
  const [open, setOpen] = useState(() => window.matchMedia('(max-width: 767px)').matches && window.location.pathname === '/');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const media = window.matchMedia('(max-width: 767px)');
    const resize = event => { if (!event.matches) setOpen(false); };
    document.body.style.overflow = 'hidden';
    media.addEventListener('change', resize);
    return () => {
      document.body.style.overflow = previousOverflow;
      media.removeEventListener('change', resize);
    };
  }, [open]);
  useEffect(() => {
    if (!open || !ready) return;
    const timer = window.setTimeout(() => setOpen(false), 3000);
    return () => window.clearTimeout(timer);
  }, [open, ready]);
  return <>
    {open && <div role="status" aria-live="polite" className="fixed inset-0 z-[1000] h-[100dvh] w-screen overflow-hidden bg-primary">
      <Image src={poster} alt="iHBH 环球购物，购物、体验、旅行，全球好品质，健康好生活" fittingType="fill" className="h-full w-full" loading="eager" fetchPriority="high" onLoad={() => setReady(true)} onError={() => setOpen(false)}/>
      <span className="sr-only">开屏展示 3 秒后自动进入主页。</span>
    </div>}
    <div className={open ? 'invisible' : ''} aria-hidden={open || undefined}>{children}</div>
  </>;
}