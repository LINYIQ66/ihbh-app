import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import PhotoTile from '@/components/globest/photos/PhotoTile';
import PhotoCompare from '@/components/globest/photos/PhotoCompare';
import PhotoUploadForm from '@/components/globest/photos/PhotoUploadForm';
import { stages, services } from '@/components/globest/photos/photoData';

export default function PhotoArchive({ user }) {
  const { t } = useExperience();
  const [service, setService] = useState('oxygen');
  const photos = useQuery({ queryKey: ['photos', user.id], queryFn: async () => (await base44.entities.CustomerPhoto.filter({ created_by_id: user.id }, { sort: '-taken_at', limit: 100 })).items });
  const remove = async id => { if (!confirm(t('确定删除这张照片？', 'Delete this photo?'))) return; await base44.entities.CustomerPhoto.delete(id); photos.refetch(); };
  const all = photos.data || [];
  const items = all.filter(p => (p.service || 'oxygen') === service);
  const sessions = Math.max(0, ...items.map(p => p.session_no || 0));
  return <section className="space-y-4 rounded-2xl border bg-card p-5">
    <div><h3 className="text-lg font-bold">{t('我的效果档案', 'My progress archive')}</h3><p className="mt-1 text-xs text-muted-foreground">{t('记录做之前、做之后、一个月后的变化与面诊照片，仅您本人与客服可见。', 'Track before, after, 1-month changes and face-reading photos. Visible only to you and our care team.')}</p></div>
    <div className="grid grid-cols-3 gap-2 text-center">{[[all.length, '照片总数', 'Photos'], [sessions, '最近疗程', 'Latest session'], [all.filter(p => p.share_consent).length, '授权案例', 'Shared cases']].map(([v, zh, en]) => <div key={zh} className="rounded-xl bg-muted p-2"><b className="text-lg">{v}</b><p className="text-[11px] text-muted-foreground">{t(zh, en)}</p></div>)}</div>
    <div className="flex gap-2 overflow-x-auto">{services.map(([k, zh, en]) => <button key={k} onClick={() => setService(k)} className={`whitespace-nowrap border-b-2 px-2 pb-1 text-sm font-semibold ${service === k ? 'border-primary' : 'border-transparent text-muted-foreground'}`}>{t(zh, en)} ({all.filter(p => (p.service || 'oxygen') === k).length})</button>)}</div>
    {photos.isLoading ? <p className="py-6 text-center text-sm text-muted-foreground">{t('加载中…', 'Loading…')}</p> : <>
      {service !== 'face' && <PhotoCompare items={items}/>}
      {stages.map(([k, zh, en]) => { const list = items.filter(p => p.stage === k); return list.length > 0 && <div key={k}><b className="text-sm">{t(zh, en)} · {list.length}</b><div className="mt-2 grid grid-cols-3 gap-2">{list.map(p => <PhotoTile key={p.id} photo={p} onDelete={() => remove(p.id)}/>)}</div></div>; })}
      {!items.length && <p className="py-2 text-center text-sm text-muted-foreground">{t('该项目还没有照片，上传第一张开始记录吧。', 'No photos for this service yet.')}</p>}
    </>}
    <PhotoUploadForm onSaved={photos.refetch}/>
  </section>;
}