import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { courseTracks, courses, experts, DEMO_VIDEO } from '@/components/globest/shopper/shopperCourses';
import QiaoZhangGui from '@/components/globest/QiaoZhangGui';
import CourseCard from '@/components/globest/shopper/CourseCard';
import HbhMaterialLibrary from '@/components/globest/hbh/HbhMaterialLibrary';
import CoursePlayer from '@/components/globest/shopper/CoursePlayer';

export default function ShopperAcademy() {
  const { t } = useExperience(); const [track, setTrack] = useState('all'); const [playing, setPlaying] = useState(null);
  const list = track === 'all' ? courses : courses.filter(c => c.track === track);
  const hot = [...courses].sort((a, b) => b.learners - a.learners).slice(0, 4);
  return <div className="space-y-8 pb-10">
    <QiaoZhangGui />
    <section className="grid gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff5000] to-[#ff2a2a] p-5 text-white md:grid-cols-[1.3fr_1fr]">
      <video className="w-full rounded-xl bg-black" src={DEMO_VIDEO} controls playsInline preload="metadata" />
      <div className="flex flex-col justify-center gap-3">
        <span className="w-fit rounded-full bg-[#ffd400] px-3 py-1 text-xs font-extrabold text-[#7a1f00]">{t('网购达人学院', 'Smart Shopper Academy')}</span>
        <h2 className="text-3xl font-black text-white">{t('从会买到会卖，一站学会', 'From smart buying to selling, all in one place')}</h2>
        <p className="font-semibold opacity-90">{t(`${courses.length} 门视频课程 · 6 大学习路径 · 达人导师亲授`, `${courses.length} video courses · 6 learning paths · taught by experts`)}</p>
        <div className="grid grid-cols-3 gap-2 text-center">{[[courses.reduce((s, c) => s + c.lessons, 0), '节课', 'lessons'], ['18万+', '学员', 'learners'], ['4.9', '好评', 'rating']].map(([n, zh, en]) => <div key={en} className="rounded-xl bg-white/15 p-2"><b className="block text-xl">{n}</b><span className="text-xs">{t(zh, en)}</span></div>)}</div>
        <Link to="/live" className="w-fit rounded-full bg-white px-5 py-2 font-extrabold text-[#ff5000]">{t('看达人直播 ›', 'Watch experts live ›')}</Link>
      </div>
    </section>
    <HbhMaterialLibrary />
    <section><h3 className="mb-3 text-xl font-black">{t('热门必学', 'Most popular')}</h3><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{hot.map(c => <CourseCard key={c.id} course={c} onPlay={setPlaying} />)}</div></section>
    <section><h3 className="mb-3 text-xl font-black">{t('达人导师', 'Expert mentors')}</h3><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{experts.map(([zh, en, rz, re, img]) => <div key={en} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"><img src={img} alt="" className="h-12 w-12 rounded-full object-cover" /><div><b className="block text-sm">{t(zh, en)}</b><span className="text-xs text-muted-foreground">{t(rz, re)}</span></div></div>)}</div></section>
    <section>
      <h3 className="mb-3 text-xl font-black">{t('全部视频课程', 'All video courses')}</h3>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">{courseTracks.map(([k, zh, en]) => <button key={k} onClick={() => setTrack(k)} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold ${track === k ? 'bg-orange-500 text-white' : 'bg-muted'}`}>{t(zh, en)}</button>)}</div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{list.map(c => <CourseCard key={c.id} course={c} onPlay={setPlaying} />)}</div>
    </section>
    <CoursePlayer course={playing} onClose={() => setPlaying(null)} />
  </div>;
}