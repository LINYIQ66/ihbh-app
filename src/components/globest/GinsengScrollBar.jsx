import React, { useEffect, useState } from 'react';
import WalkingGinseng from '@/components/globest/WalkingGinseng';

export default function GinsengScrollBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return <div className="pointer-events-none fixed inset-x-0 bottom-16 z-50 h-2 bg-[#ffe3d1] md:bottom-0" aria-hidden="true">
    <div className="h-full bg-gradient-to-r from-[#c98a3a] via-[#ff7a00] to-[#ff2a2a]" style={{ width: `${p}%` }} />
    <WalkingGinseng className="absolute -top-12 h-14 w-11 drop-shadow" style={{ left: `calc(${p}% - 22px)` }} />
  </div>;
}