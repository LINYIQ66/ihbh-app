import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
import Catalog from '@/components/globest/Catalog';
import ProductMasonry from '@/components/globest/ProductMasonry';
import { jztCategories, slides } from '@/components/globest/site/globestSite';

export default function HbhHerbalCollection() {
  const { t } = useExperience();
  return <div className="space-y-6">
    <section className="overflow-hidden rounded-2xl border border-border bg-card sm:grid sm:grid-cols-2">
      <Image src={slides[1].image} alt={t('九珍堂滋补礼盒', 'Jiu Zhen Tang gift collection')} fittingType="fit" className="aspect-[4/3] w-full bg-muted sm:h-full"/>
      <div className="space-y-3 p-5 sm:p-6"><span className="text-xs tracking-widest text-muted-foreground">JIU ZHEN TANG</span>
        <h2 className="font-heading text-2xl text-primary">{t('一份道地滋养，一份珍贵心意', 'Thoughtful traditions, meaningful gifts')}</h2>
        <p className="text-sm leading-7 text-muted-foreground">{t('从野山参、参粉到参草礼盒，了解九珍堂的品牌故事与礼赠系列；下方传统食养目录也可按食材、产地和价格继续筛选。', 'Explore Jiu Zhen Tang’s ginseng, powders and gift collections, then browse the traditional food catalog by ingredient, origin and price.')}</p>
        <Link to="/jiuzhentang" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">{t('了解品牌、产地与产品系列', 'Explore the brand and its collections')}<ArrowUpRight size={16} aria-hidden="true"/></Link>
      </div>
    </section>
    <section aria-labelledby="jzt-collection-title"><h2 id="jzt-collection-title" className="mb-4 font-heading text-xl text-primary">{t('九珍堂礼赠系列', 'Jiu Zhen Tang gift collections')}</h2>
      <ProductMasonry className="grid grid-cols-2 gap-3 lg:grid-cols-4">{jztCategories.map(([en, zh, description, image]) => <Link key={en} to="/jiuzhentang" className="overflow-hidden rounded-xl border border-border bg-card">
        <Image src={image} alt={t(zh, en)} fittingType="fit" className="masonry-product-visual aspect-square w-full bg-muted"/>
        <div className="space-y-2 p-3"><h3 className="text-sm font-semibold text-primary">{t(zh, en)}</h3><p className="text-xs leading-6 text-muted-foreground">{t(description, 'Discover the collection and brand story.')}</p><span className="block text-xs font-medium text-primary">{t('了解系列 →', 'Explore collection →')}</span></div>
      </Link>)}</ProductMasonry>
    </section>
    <Catalog scope="herbal" title={['传统食养 · 滋补好物', 'Traditional food & tonics']}/>
  </div>;
}