import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { wellnessCategories } from '@/components/globest/wellnessCategoryData';
import { categories } from '@/components/globest/CatalogFilters';
export default function WellnessCategories(){
  const {t}=useExperience();
  return <section className="wellness-categories"><div className="section-heading"><div><span className="eyebrow">SHOP BY WELLNESS INTEREST</span><h2>{t('按健康关注点探索','Explore by wellness interest')}</h2></div></div><p className="wellness-disclaimer">{t('以下为食材与生活方式导览，不表示商品具有治疗或预防疾病功效。','Ingredient and lifestyle discovery only; no treatment or disease-prevention claims.')}</p><div className="wellness-category-grid">{wellnessCategories.map(([key,zh,en,ingredients,copyZh,copyEn])=><Link to={`/?concern=${key}#catalog`} key={key} className="wellness-category-tile"><span>{t(zh,en)}</span><small>{t(copyZh,copyEn)}</small><small>{t('食材参考：','Ingredient ideas: ')}{ingredients.slice(0,2).map(item=>{const found=categories.find(cat=>cat[0]===item);return found?t(found[1],found[2]):item;}).join(' · ')}</small><ArrowRight size={15}/></Link>)}</div></section>;
}