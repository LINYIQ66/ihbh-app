import React from 'react';
import { PlayCircle, Users, Clock } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';

const levels = [null, ['入门', 'Beginner'], ['进阶', 'Intermediate'], ['高阶', 'Advanced']];

export default function CourseCard({ course, onPlay }) {
  const { t } = useExperience();
  return <button onClick={() => onPlay(course)} className="group overflow-hidden rounded-xl border border-border bg-card text-left transition hover:-translate-y-0.5 hover:shadow-lg">
    <div className="relative aspect-video overflow-hidden">
      <img src={course.image} alt="" className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
      <PlayCircle className="absolute inset-0 m-auto text-white opacity-90 drop-shadow" size={44} />
      <span className="absolute left-2 top-2 rounded bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">{t(...levels[course.level])}</span>
    </div>
    <div className="p-3">
      <h4 className="line-clamp-2 min-h-[2.5rem] text-sm font-extrabold">{t(course.zh, course.en)}</h4>
      <div className="mt-2 flex gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Clock size={12} />{course.min}{t('分钟', 'm')}</span><span className="flex items-center gap-1"><Users size={12} />{course.learners.toLocaleString()}</span></div>
    </div>
  </button>;
}