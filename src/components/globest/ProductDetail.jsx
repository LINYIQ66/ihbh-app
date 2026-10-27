import React from 'react';
import { Image } from '@/components/ui/image';
import ProductPay from '@/components/globest/ProductPay';
import ContentLink from '@/components/globest/ContentLink';
import HbhPrice from '@/components/globest/HbhPrice';
import ResponsivePanel from '@/components/globest/ResponsivePanel';
import { useExperience } from '@/components/globest/ExperienceProvider';
export default function ProductDetail({ product: p, onClose, hideSupplier = false }) {
  const { t } = useExperience();
  return <ResponsivePanel wide open={!!p} onOpenChange={onClose} title={p ? t(p.name_zh,p.name_en) : ''} description={t('商品详情', 'Product details')}>
    {p && <div className="product-detail-layout">
      <Image src={p.image} alt={t(p.name_zh,p.name_en)} className="product-detail-image" fittingType="fit"/>
      <div className="product-detail-copy">
        <h3 className="product-detail-title">{p.name_en}</h3>
        <p className="product-detail-origin">{hideSupplier?p.unit:`${t(p.origin_zh,p.origin_en)} · ${p.unit}`}</p>
        <div className="product-detail-price"><b>SGD {Number(p.price).toFixed(2)}</b> <HbhPrice sgd={p.price}/></div>
        <p className="product-detail-description">{hideSupplier?t('图片和 SGD 价格供选品参考，实际资料与价格可能变化。商品信息不构成医疗建议。','Images and SGD prices are for browsing; details and prices may change. Product information is not medical advice.'):t(p.description_zh,p.description_en)}</p>
        {!hideSupplier && p.source_url && <ContentLink href={p.source_url} className="product-detail-source">{p.source_url.includes('iherb.com')?t('查看 iHerb 原始资料 ↗','View original iHerb listing ↗'):t('查看资料来源 ↗','View product source ↗')}</ContentLink>}
        <ProductPay key={p.id} product={p}/>
        {p.is_demo===false&&<p className="demo-note mt-3">{t('商品信息不构成医疗建议。','Product information is not medical advice.')}</p>}
      </div>
    </div>}
  </ResponsivePanel>;
}