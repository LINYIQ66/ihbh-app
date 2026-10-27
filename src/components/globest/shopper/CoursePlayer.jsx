import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { DEMO_VIDEO } from '@/components/globest/shopper/shopperCourses';

export default function CoursePlayer({ course, onClose }) {
  const { t } = useExperience();
  return <Dialog open={!!course} onOpenChange={o => !o && onClose()}>
    <DialogContent className="max-w-3xl">
      {course && <>
        <DialogTitle>{t(course.zh, course.en)}</DialogTitle>
        <video key={course.id} className="w-full rounded-xl bg-black" src={DEMO_VIDEO} poster={course.image} controls autoPlay playsInline />
        <p className="text-sm text-muted-foreground">{t(`共 ${course.lessons} 节 · ${course.min} 分钟 · 演示视频`, `${course.lessons} lessons · ${course.min} min · demo video`)}</p>
        <ol className="grid gap-1 text-sm sm:grid-cols-2">{Array.from({ length: course.lessons }, (_, i) => <li key={i} className="rounded-lg bg-muted px-3 py-2">{t(`第 ${i + 1} 节`, `Lesson ${i + 1}`)}</li>)}</ol>
      </>}
    </DialogContent>
  </Dialog>;
}