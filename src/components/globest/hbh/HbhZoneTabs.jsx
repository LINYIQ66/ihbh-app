import React from 'react';
import { Link } from 'react-router-dom';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function HbhZoneTabs({ tabs, active }) {
  const { t } = useExperience();
  return <nav className="my-4 grid grid-cols-5 gap-1 sm:gap-2 md:flex md:flex-wrap" aria-label={t('HBH专区栏目', 'HBH Zone sections')}>
    {Object.entries(tabs).map(([id, item]) => <Link key={id} to={`/discover?section=${id}`} aria-current={id === active ? 'page' : undefined} className={`flex min-h-11 min-w-0 items-center justify-center rounded-lg border px-1 py-2 text-center text-[11px] font-semibold sm:px-4 sm:text-sm ${id === active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground hover:bg-muted'}`}>
      <span className="min-w-0 break-words leading-5">{t(...item.title)}</span>
    </Link>)}
  </nav>;
}