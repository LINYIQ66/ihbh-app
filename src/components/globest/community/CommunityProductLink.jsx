import React from 'react';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { productPath } from '@/components/globest/promotionLinks';

export default function CommunityProductLink({ product }) {
  const { t, addCart } = useExperience();
  if (!product) return null;
  return <div className="community-product"><Image src={product.image} className="community-product-image"/><div><small>{t('帖子关联好物','FEATURED PRODUCT')}</small><b>{t(product.name_zh,product.name_en)}</b><span>S${product.price.toFixed(2)}</span></div><div className="community-product-actions"><a href={productPath(product)}>{t('查看','View')}<ArrowUpRight size={13}/></a>{product.is_demo===false&&<button onClick={()=>addCart(product)}><ShoppingBag size={14}/>{t('购买','Buy')}</button>}</div></div>;
}