import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, GraduationCap } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';

const lessons = [
  ['人参怎么挑？三看一闻', 'How to pick ginseng: 3 looks, 1 sniff'],
  ['节气养生茶，在家就能做', 'Seasonal herbal tea you can make at home'],
  ['药膳入门：一锅好汤', 'Food therapy 101: one good soup'],
  ['Genecells 日常使用指南', 'Daily Genecells guide'],
];

export default function QiaoZhangGui() {
  const { t } = useExperience();
  return <section className="my-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff5000] to-[#ff2a2a] p-4 text-white md:p-6">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div><span className="rounded-full bg-[#ffd400] px-3 py-1 text-xs font-extrabold text-[#7a1f00]">{t('CEO IP', 'CEO IP')}</span>
        <h2 className="mt-2 text-3xl font-black text-white">{t('巧掌柜 · 视频课堂', 'Qiao Zhanggui · Video Classes')}</h2>
        <p className="mt-1 text-base font-semibold opacity-90">{t('懂滋补的掌柜，手把手教你吃对、选对、养对。', 'A tonic expert teaching you to choose, cook and care, step by step.')}</p></div>
      <Link to="/live" className="rounded-full bg-white px-5 py-2 text-base font-extrabold text-[#ff5000]">{t('看直播 ›', 'Watch live ›')}</Link>
    </div>
    <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
      <video className="w-full rounded-xl bg-black" src="https://media.base44.com/videos/public/6aa3280ca2d875c1b77cdd8e/edd93fcdf_655.mov" controls playsInline preload="metadata" />
      <div className="grid gap-2">{lessons.map(([zh, en], i) => <Link key={en} to="/live?tab=videos&category=class" className="flex items-center gap-3 rounded-xl bg-white p-3 text-[#222] hover:bg-[#fff4ec]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff5000] text-white">{i === 0 ? <PlayCircle size={22}/> : <GraduationCap size={22}/>}</span>
        <span className="text-base font-extrabold">{t(zh, en)}<small className="mt-1 block text-xs font-normal">查看视频目录，单课视频尚待配置</small></span></Link>)}</div>
    </div>
  </section>;
}