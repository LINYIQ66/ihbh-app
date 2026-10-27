import React from 'react';
import { ArrowUpRight, Store, UserRound } from 'lucide-react';

const centers = [
  { key: 'account', title: '我的中心', description: '个人资料 · 收货地址 · 我的订单', Icon: UserRound },
  { key: 'dealers', title: '经销商', description: '经营账单 · 商品库存 · 分润收益', Icon: Store }
];

export default function CrmCenterButtons({ active, onSelect }) {
  return <nav aria-label="选择个人或经销商中心" className="mb-7 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-5">
    {centers.map(({ key, title, description, Icon }) => {
      const selected = active === key;
      return <button key={key} type="button" aria-pressed={selected} onClick={() => onSelect(key)} className={selected ? 'flex min-h-40 w-full flex-col rounded-2xl border border-primary bg-primary p-5 text-left text-primary-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:min-h-48 sm:p-6' : 'flex min-h-40 w-full flex-col rounded-2xl border border-primary/20 bg-card p-5 text-left text-primary shadow-sm hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:min-h-48 sm:p-6'}>
        <span className="mb-5 flex w-full items-center justify-between"><span className={selected ? 'flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10' : 'flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5'}><Icon size={23} strokeWidth={1.6} aria-hidden="true"/></span><ArrowUpRight size={19} className="opacity-70" aria-hidden="true"/></span>
        <span className="text-xl font-semibold tracking-wide sm:text-2xl">{title}</span>
        <span className="mt-2 text-xs leading-relaxed opacity-75">{description}</span>
        <span className="mt-5 text-xs font-medium opacity-85">{key === 'account' ? '进入我的中心' : '进入经销商中心'}</span>
      </button>;
    })}
  </nav>;
}