import React from 'react';
import { Plus } from 'lucide-react';
import HbhPrice from '@/components/globest/HbhPrice';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
export default function ProductCard({ product: p, onSelect, hideSupplier = false }) {
  const { state, t, addCart } = useExperience();
  const name = t(p.name_zh, p.name_en) || p.name_zh || p.name_en || '';
  const subtitle = (state.lang === 'zh' ? p.name_en : p.name_zh) || '';
  const normalize = text => text.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, '');
  const showSubtitle = subtitle && normalize(subtitle) !== normalize(name);
  return <article className="product-card"><button className="product-visual" onClick={() => onSelect(p)} aria-label={name}><Image src={p.image} alt={name} fittingType="fit" className="w-full h-full"/>{!hideSupplier && p.is_demo===false && (p.tag_zh || p.tag_en) && <span className="product-tag">{t(p.tag_zh,p.tag_en)}</span>}</button><div className="product-info"><p className="product-origin">{hideSupplier?t('全球甄选','GLOBAL SELECTION'):<>{t(p.origin_zh,p.origin_en)} <span>·</span> {t('精选系列', 'CURATED')}</>}</p><button className="product-name-button text-left w-full" onClick={() => onSelect(p)} aria-label={showSubtitle ? `${name} · ${subtitle}` : name} title={name}><h3>{name}</h3><p className="product-subtitle" title={showSubtitle ? subtitle : undefined}>{showSubtitle ? subtitle : null}</p></button><div className="price-row"><div><strong><small>SGD </small>{Number(p.price).toFixed(2)}</strong><HbhPrice sgd={p.price} className="block"/><p title={p.unit}>{p.unit}</p></div>{p.is_demo===false&&<button className="add-cart" onClick={() => addCart(p)} aria-label={t('加入购物车', 'Add to cart')}><Plus size={20}/></button>}</div></div></article>;
}