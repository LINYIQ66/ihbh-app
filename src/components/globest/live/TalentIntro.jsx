import React from 'react';
import RecordedVideo from '@/components/globest/videos/RecordedVideo';

const source = 'https://kopiagent.amt.land/sites/ihbh-ip-incubate/';
export default function TalentIntro() {
  return <section className="rounded-2xl border bg-card p-4 sm:p-5" aria-labelledby="talent-intro-title">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 id="talent-intro-title" className="font-semibold">iHBH Talent · 网红IP孵化 · 巧掌柜手作养生</h2><p className="mt-2 text-sm text-muted-foreground">预录介绍视频，非实时直播；会员开播与共同观看入口在下方。</p></div><a className="text-link text-sm" href={source} target="_blank" rel="noopener noreferrer">查看原页面</a></div>
    <div className="mx-auto max-w-3xl"><RecordedVideo title="iHBH Talent · 网红IP孵化介绍" src={`${source}final_tg.mp4`}/></div>
    <div className="mt-3 flex flex-wrap gap-4 text-sm" aria-label="原页面提供的其他视频版本"><a className="text-link" href={`${source}delivery.mp4`} target="_blank" rel="noopener noreferrer">delivery 版本</a><a className="text-link" href={`${source}final.mp4`} target="_blank" rel="noopener noreferrer">final 版本</a></div>
  </section>;
}