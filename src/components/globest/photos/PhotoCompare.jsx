import React, { useState } from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import PhotoTile from '@/components/globest/photos/PhotoTile';
import { scores } from '@/components/globest/photos/photoData';

export default function PhotoCompare({ items }) {
  const { t } = useExperience();
  const [to, setTo] = useState('month');
  const sorted = [...items].sort((a, b) => (a.taken_at || '').localeCompare(b.taken_at || ''));
  const first = sorted.find(p => p.stage === 'before');
  const last = [...sorted].reverse().find(p => p.stage === to) || [...sorted].reverse().find(p => p.stage === 'after');
  if (!first || !last) return <div className="rounded-xl bg-muted p-4 text-center text-xs text-muted-foreground">{t('上传“做之前”和“做之后 / 一个月后”照片，即可生成效果对比。', 'Upload a "Before" and an "After / 1 month" photo to see your comparison.')}</div>;
  const days = Math.max(0, Math.round((new Date(last.taken_at).getTime() - new Date(first.taken_at).getTime()) / 86400000));
  return <div className="rounded-xl border p-3">
    <div className="flex items-center justify-between"><b className="text-sm">{t('效果对比', 'Before vs after')}</b>
      <div className="flex gap-1 text-xs">{[['after', '做之后', 'After'], ['month', '一个月后', '1 month']].map(([k, zh, en]) => <button key={k} onClick={() => setTo(k)} className={`rounded-full px-2.5 py-1 ${to === k ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{t(zh, en)}</button>)}</div></div>
    <div className="mt-2 grid grid-cols-2 gap-2"><div><PhotoTile photo={first}/><p className="mt-1 text-center text-xs font-semibold">{t('做之前', 'Before')}</p></div><div><PhotoTile photo={last}/><p className="mt-1 text-center text-xs font-semibold">{last.stage === 'month' ? t('一个月后', '1 month') : t('做之后', 'After')}</p></div></div>
    <p className="mt-2 text-center text-xs text-muted-foreground">{t(`间隔 ${days} 天`, `${days} days apart`)}</p>
    <div className="mt-2 space-y-1.5">{scores.map(([k, zh, en]) => first[k] != null && last[k] != null && <div key={k} className="flex items-center gap-2 text-xs"><span className="w-12">{t(zh, en)}</span><div className="h-2 flex-1 rounded-full bg-muted"><div className="h-2 rounded-full bg-[#6CBB3C]" style={{ width: `${last[k] * 10}%` }}/></div><b className={last[k] >= first[k] ? 'text-[#3d7a1f]' : 'text-red-600'}>{first[k]}→{last[k]}</b></div>)}</div>
  </div>;
}