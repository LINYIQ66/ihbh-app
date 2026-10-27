import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { channels, stats } from './hbhContent';
import HbhMoreMenu from '@/components/globest/hbh/HbhMoreMenu';

export default function HbhChannels() {
  const { t } = useExperience();
  const [moreOpen, setMoreOpen] = useState(false);
  return <section className="my-5 rounded-2xl border bg-card p-3 sm:p-5">
    <div className="grid grid-cols-5 gap-y-3">
      {channels.map(c => {
        const inner = <><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-xl sm:h-14 sm:w-14 sm:text-2xl">{c.Icon ? <c.Icon size={24} aria-hidden="true"/> : c.icon}</span><span className="mt-1 text-center text-[11px] leading-tight sm:text-sm">{t(c.zh, c.en)}</span></>;
        const cls = 'flex flex-col items-center';
        if (c.to === '/more') return <button key={c.zh} type="button" className={cls} aria-expanded={moreOpen} aria-controls="hbh-more-menu" aria-label={t(moreOpen ? '收起更多菜单' : '展开更多菜单', moreOpen ? 'Collapse more shortcuts' : 'Expand more shortcuts')} onClick={() => setMoreOpen(open => !open)}>{inner}</button>;
        return c.to.startsWith('#') ? <a key={c.zh} href={c.to} className={cls}>{inner}</a> : <Link key={c.zh} to={c.to} className={cls}>{inner}</Link>;
      })}
    </div>
    <div id="hbh-more-menu" hidden={!moreOpen}><HbhMoreMenu /></div>
    <div className="mt-4 grid grid-cols-4 divide-x rounded-xl bg-primary py-3 text-primary-foreground">
      {stats.map(s => <div key={s.v} className="px-1 text-center"><b className="block font-heading text-base sm:text-xl">{s.v}</b><span className="text-[10px] opacity-80 sm:text-xs">{t(s.zh, s.en)}</span></div>)}
    </div>
  </section>;
}