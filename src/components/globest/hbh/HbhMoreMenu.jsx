import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Building2, Ticket, LayoutGrid, UsersRound } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';

const items = /** @type {Array<[import('lucide-react').LucideIcon, string, string, string]>} */ ([
  [CalendarDays, '/events', '沙龙活动', 'Salon events'],
  [Building2, '/venues', '场地预定', 'Venue booking'],
  [Ticket, '/tickets', '我的票夹', 'My tickets'],
  [LayoutGrid, '/me', '全部功能', 'All features'],
  [UsersRound, '/retirement-club', '退休俱乐部', 'Retirement Club'],
]);

export default function HbhMoreMenu() {
  const { t } = useExperience();
  return <nav aria-label={t('更多快捷菜单', 'More shortcuts')} className="mt-4 flex gap-2 overflow-x-auto border-t border-border pb-2 pt-4">
    {items.map(([Icon, to, zh, en]) => <Link key={to} to={to} className="flex min-w-28 flex-1 flex-col items-center rounded-xl p-2 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-primary sm:h-14 sm:w-14"><Icon size={24} aria-hidden="true" /></span>
      <span className="mt-1 text-[11px] leading-tight sm:text-sm">{t(zh, en)}</span>
    </Link>)}
  </nav>;
}