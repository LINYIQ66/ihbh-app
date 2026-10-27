import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Clock, BookOpen } from 'lucide-react';
import { Image } from '@/components/ui/image';
export default function JournalCard({ article: a }) {
  const t = (zh, _en = '') => zh;
  const location = useLocation(), link = useRef(null);
  useEffect(() => {
    if (location.state?.journalFocus !== a.id) return;
    const frame = requestAnimationFrame(() => { link.current?.focus(); link.current?.scrollIntoView({ block: 'center' }); });
    return () => cancelAnimationFrame(frame);
  }, [location.key, location.state?.journalFocus, a.id]);
  return <Link ref={link} id={`journal-card-${a.id}`} className="journal-card" to={`/feed?article=${encodeURIComponent(a.id)}`} state={{ journalOrigin: location.pathname === '/live' && new URLSearchParams(location.search).get('tab') === 'videos' ? '/live?tab=videos#journal' : '/feed?view=journal' }}><div className="journal-image"><Image src={a.image} className="w-full h-full"/><span><BookOpen size={12}/>{t('滋养手记', 'JOURNAL')}</span></div><div className="journal-copy"><span className="eyebrow">{t(...a.tag)}</span><h3>{t(...a.title)}</h3><p>{t(...a.subtitle)}</p><div><span><Clock size={12}/>{t(`${a.minutes} 分钟阅读`, `${a.minutes} min read`)}</span><ArrowUpRight size={16}/></div></div></Link>;
}