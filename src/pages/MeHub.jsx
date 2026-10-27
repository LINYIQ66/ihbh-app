import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PageShell from '@/components/globest/me/PageShell';
import { meMenu } from '@/components/globest/me/meMenu';

export default function MeHub() {
  return <PageShell title="我的 · 全部功能" sub="HBH APP 功能总览，点击进入" back="/">
    {meMenu.map(([group, items]) => <section key={group} className="rounded-2xl bg-card p-4">
      <h2 className="mb-2 text-sm font-bold text-[#0F382C]">{group}</h2>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">{items.map(([label, to]) => <Link key={label} to={to} className="flex items-center justify-between rounded-lg px-2 py-2.5 text-sm hover:bg-muted"><span>{label}</span><ChevronRight size={15} className="text-muted-foreground"/></Link>)}</div>
    </section>)}
  </PageShell>;
}