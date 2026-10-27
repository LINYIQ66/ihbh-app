import React, { useState } from 'react';
import { ArrowUpRight, Coins } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import UtilityPanel from '@/components/globest/UtilityPanel';

export default function MemberPointsBanner() {
  const { state } = useExperience();
  const [panel, setPanel] = useState(null);
  return <>
    <section className="rounded-2xl border border-primary/20 bg-primary p-5 text-primary-foreground sm:p-6" aria-label="我的 HBH 积分">
      <button type="button" onClick={() => setPanel('wallet')} aria-label="查看我的 HBH 积分与签到记录" aria-haspopup="dialog" className="flex w-full flex-wrap items-center justify-between gap-4 text-left">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-sm font-semibold"><Coins size={18} aria-hidden="true"/>我的 HBH 积分</h2>
          <p className="mt-3 flex flex-wrap items-baseline gap-2" role="status" aria-live="polite" aria-atomic="true"><strong className="break-all text-4xl font-semibold tabular-nums sm:text-5xl">{Number(state.hbh || 0).toLocaleString()}</strong><span className="text-base font-semibold">HBH</span></p>
          <p className="mt-2 text-xs opacity-75">体验积分，不可兑换现金</p>
        </div>
        <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-foreground/30 px-4 py-2 text-sm font-semibold">查看积分<ArrowUpRight size={17} aria-hidden="true"/></span>
      </button>
    </section>
    <UtilityPanel type={panel} setType={setPanel}/>
  </>;
}