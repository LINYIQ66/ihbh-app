import React from 'react';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
import GeneCellPackages from '@/components/globest/GeneCellPackages';
import GeneCellsGallery from '@/components/globest/genecells/GeneCellsGallery';
import Catalog from '@/components/globest/Catalog';
import { gallery, products, stats, stages } from '@/components/globest/genecells/genecellsData';

export default function GeneCellsShowcase() {
  const { t } = useExperience();
  return <section className="mb-8 space-y-6">
    <div className="overflow-hidden rounded-2xl border bg-card sm:grid sm:grid-cols-2">
      <Image src={gallery[0]} alt="GENECELLS" className="h-64 w-full sm:h-full" />
      <div className="p-6">
        <span className="text-xs tracking-widest text-[#B28A45]">GENECELLS · HBH</span>
        <h2 className="mt-2 font-heading text-2xl text-primary">{t('干细胞科技与精准抗衰方案', 'Stem cell technology & precision anti-aging')}</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{t('从细胞根源出发，先以基础片打通能量、循环、解毒、内分泌四大通道，再按男女不同生理特点精准协同。美国制造，FDA 注册，亚太区由 HBH Global Health Holding 独家授权。', 'Start at the cellular root: the base tablet supports energy, circulation, detox and endocrine balance, then gender-specific formulas add targeted support. Made in USA, FDA registered, exclusively licensed in APAC by HBH Global Health Holding.')}</p>
      </div>
    </div>
    <Catalog scope="genecells" title={['GeneCells 系列商品', 'GeneCells products']}/>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{stats.map(([v, zh, en]) => <div key={en} className="rounded-xl border bg-card p-4 text-center"><b className="font-heading text-2xl text-[#B28A45]">{v}</b><p className="mt-1 text-xs text-muted-foreground">{t(zh, en)}</p></div>)}</div>
    <div className="grid gap-3 sm:grid-cols-3">{products.map(p => <article key={p.en} className="rounded-xl border bg-card p-5"><span className="text-xs text-[#B28A45]">{t(p.tagZh, p.tagEn)}</span><h3 className="mt-1 font-heading text-lg text-primary">{t(p.zh, p.en)}</h3><p className="mt-2 text-sm text-muted-foreground">{t(p.ingZh, p.ingEn)}</p><p className="mt-3 text-xs font-medium">{t(p.useZh, p.useEn)}</p></article>)}</div>
    <div className="rounded-xl border bg-card p-5"><h3 className="font-heading text-lg text-primary">{t('三段式改善周期', '3-stage improvement cycle')}</h3><div className="mt-3 grid gap-3 sm:grid-cols-3">{stages.map(([d, zh, en]) => <div key={d} className="rounded-lg bg-muted p-4"><b className="text-xl text-[#B28A45]">{d}{t('天', ' days')}</b><p className="mt-1 text-sm">{t(zh, en)}</p></div>)}</div><p className="mt-3 text-xs text-muted-foreground">{t('膳食补充剂，非药品；个人感受因人而异，如有健康状况请先咨询专业人士。', 'Dietary supplement, not a medicine. Results vary; consult a professional if you have health concerns.')}</p></div>
    <GeneCellPackages />
    <GeneCellsGallery />
  </section>;
}