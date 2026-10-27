import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Building2, Ticket, LayoutGrid } from 'lucide-react';

const items = /** @type {Array<[import('lucide-react').LucideIcon, string, string]>} */ ([[CalendarDays, '沙龙活动', '/events'], [Building2, '场地预定', '/venues'], [Ticket, '我的票夹', '/tickets'], [LayoutGrid, '全部功能', '/me']]);

export default function HomeShortcuts() {
  return <div className="my-3 grid grid-cols-4 gap-2">{items.map(([Icon, label, to]) => <Link key={to} to={to} className="flex flex-col items-center gap-1 rounded-2xl bg-card py-3 text-xs font-semibold"><Icon size={22} className="text-[#0F382C]"/>{label}</Link>)}</div>;
}