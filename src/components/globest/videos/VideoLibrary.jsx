import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Link, useSearchParams } from 'react-router-dom';
import usePublicCollection from '@/components/globest/usePublicCollection';
import CollectionFeedback from '@/components/globest/CollectionFeedback';
import RecordedVideo from '@/components/globest/videos/RecordedVideo';
import ExistingVideoArchive from '@/components/globest/videos/ExistingVideoArchive';

const cats = [['qiao', '巧掌柜', 'Qiaozhanggui'], ['ip', '达人IP', 'Creators'], ['class', '课堂', 'Classes'], ['visit', '探店', 'Store visits']];

export default function VideoLibrary() {
  const t = (zh, _en = '') => zh;
  const [params] = useSearchParams(), cat = params.get('category') || 'qiao';
  const validCategory = cats.some(([key]) => key === cat);
  const [title, setTitle] = useState(''), [busy, setBusy] = useState(false), [uploadError, setUploadError] = useState('');
  const me = useQuery({ queryKey: ['video-me'], retry: false, queryFn: async () => await base44.auth.isAuthenticated() ? base44.auth.me() : null });
  const videos = usePublicCollection('VideoPost', { category: cat }, '-created_date', validCategory);
  const upload = async e => { const file = e.target.files?.[0]; if (!file || !title.trim()) return; setBusy(true); setUploadError(''); try { const { file_url } = await base44.integrations.Core.UploadFile({ file }); await base44.entities.VideoPost.create({ title: title.trim(), category: cat, video_url: file_url }); setTitle(''); videos.refetch(); } catch { setUploadError('视频上传或刊登失败，请确认权限后重试。'); } finally { setBusy(false); e.target.value = ''; } };
  return <section className="my-6 rounded-2xl bg-card p-4">
    <h2 className="text-xl font-bold">{t('视频专区', 'Video hub')}</h2>
    <p className="text-xs text-muted-foreground">{t('巧掌柜、达人IP、课堂、探店，接地气的真实内容。', 'Qiaozhanggui, creators, classes and store visits.')}</p>
    <nav className="mt-3 flex gap-2 overflow-x-auto" aria-label="视频分类">{cats.map(([k, zh]) => <Link key={k} to={`/live?tab=videos&category=${k}`} aria-current={cat === k ? 'page' : undefined} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold ${cat === k ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{zh}</Link>)}</nav>
    {validCategory && me.data?.role === 'admin' && <div className="mt-3 flex gap-2"><input aria-label="视频标题，上传前填写" value={title} onChange={e => setTitle(e.target.value)} placeholder={t('视频标题（先填写）', 'Video title (required)')} className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"/><label className={`flex items-center gap-1 rounded-lg bg-primary px-3 text-sm text-primary-foreground ${title.trim() ? 'cursor-pointer' : 'opacity-50'}`}>{busy ? <Loader2 size={16} className="animate-spin"/> : <Upload size={16}/>}{t('上传', 'Upload')}<input type="file" accept="video/*" hidden disabled={busy || !title.trim()} onChange={upload}/></label></div>}
    {uploadError && <p role="alert" className="mt-3 text-sm text-destructive">{uploadError}</p>}
    {validCategory ? <>
      <h3 className="mt-5 font-semibold">{cats.find(([key]) => key === cat)?.[1]} · 已刊登视频</h3>
      <div className="mt-4 grid grid-cols-1 items-start gap-3 sm:grid-cols-2 md:grid-cols-4">{videos.items.map(v => <RecordedVideo key={v.id} title={v.title} src={v.video_url} description={v.description} vertical/>)}</div>
      <CollectionFeedback collection={videos} unit="条视频" empty="当前分类暂无已刊登视频。站内已有预录素材仍保留在下方，不会用其他内容冒充本分类。"/>
    </> : <p role="alert" className="mt-4">视频分类参数无效，请选择上方四个分类之一；已有配置素材保留如下。</p>}
    <ExistingVideoArchive/>
  </section>;
}