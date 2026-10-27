import React from 'react';
import { ShoppingCart, CreditCard, Users, Percent, Wallet, Activity } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { modules } from './erpData';

const icons = { ShoppingCart, CreditCard, Users, Percent, Wallet, Activity };
export default function ModuleGrid() {
  const { t } = useExperience();
  return <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">{modules.map(m => { const Icon = icons[m[0]]; return <div key={m[1]} className="rounded-2xl border bg-card p-4"><div className="mb-2 flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F382C] text-[#e8d3a7]"><Icon size={18} /></span><b>{t(m[1], m[2])}</b></div><p className="text-xs text-muted-foreground">{t(m[3], m[4])}</p></div>; })}</div>;
}