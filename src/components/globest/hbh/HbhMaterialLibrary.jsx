import React, { useState } from 'react';
import { Download, PlayCircle } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { materialProducts, materialPosters, materialVideos } from '@/components/globest/hbh/hbhMaterials';

export default function HbhMaterialLibrary({ showDownload = false }) {
  const { t, state } = useExperience(); const [p, setP] = useState(materialProducts[0]); const [zoom, setZoom] = useState(null);
  const imgs = state.lang === 'zh' ? p.zhImgs : p.enImgs;
  return <section className="space-y-6 rounded-2xl border border-border bg-card p-5">
    <div><h3 className="text-xl font-black">{t('HBH 产品资料库', 'HBH product library')}</h3><p className="text-sm text-muted-foreground">{t('官方产品视频、详情主图与海报', 'Official product videos, detail images and posters')}</p></div>
    <div><h4 className="mb-3 flex items-center gap-2 font-bold"><PlayCircle size={18} />{t('产品视频课程', 'Product video lessons')}</h4>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{materialVideos.map(([zh, en, url, vert]) => <figure key={url} className="overflow-hidden rounded-xl bg-muted">
        <video className={`w-full bg-black ${vert ? 'aspect-[9/16]' : 'aspect-video'}`} src={url} controls playsInline preload="metadata" />
        <figcaption className="p-2 text-sm font-bold">{t(zh, en)}</figcaption></figure>)}</div></div>
    <div><h4 className="mb-3 font-bold">{t('产品详情主图', 'Product detail images')}</h4>
      <div className="mb-3 flex gap-2 overflow-x-auto">{materialProducts.map(x => <button key={x.key} onClick={() => setP(x)} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold ${p.key === x.key ? 'bg-orange-500 text-white' : 'bg-muted'}`}>{t(x.zh, x.en)}</button>)}</div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{imgs.map(u => <button key={u} onClick={() => setZoom(u)}><img src={u} alt={t(p.zh, p.en)} loading="lazy" className="w-full rounded-xl border border-border" /></button>)}</div></div>
    <div><h4 className="mb-3 font-bold">{t('宣传海报', 'Posters')}</h4>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{materialPosters.map(u => <div key={u} className="relative"><button onClick={() => setZoom(u)}><img src={u} alt="" loading="lazy" className="w-full rounded-xl border border-border" /></button>
        {showDownload && <a href={u} download target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-foreground"><Download size={12} />{t('下载', 'Download')}</a>}</div>)}</div></div>
    {zoom && <div onClick={() => setZoom(null)} className="fixed inset-0 z-[60] grid place-items-center overflow-auto bg-black/80 p-4"><img src={zoom} alt="" className="max-h-[90vh] max-w-full rounded-xl" /></div>}
  </section>;
}