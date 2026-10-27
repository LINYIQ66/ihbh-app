import React from 'react';
import { HeartHandshake, Leaf, ShieldCheck } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function MallStorySection() {
  const { t } = useExperience();
  const items=/** @type {Array<[import('lucide-react').LucideIcon, string, string, string, string]>} */ ([[Leaf,'东方本草智慧','Eastern botanical wisdom','从传统滋养哲学中，甄选适合现代生活的日常方案。','Time-honoured rituals, thoughtfully adapted for modern life.'],[ShieldCheck,'全球品质甄选','Globally curated quality','跨越产地与品类，以透明信息连接可信赖的健康好物。','Transparent sourcing connects you with trusted wellness essentials.'],[HeartHandshake,'一起成长的社区','A community that grows','分享心得、记录养参进度，让每一次坚持都被看见。','Share rituals and ginseng milestones with people on the same journey.']]);
  return <section className="mall-story"><div className="section-heading"><div><span className="eyebrow">ROOTED IN WISDOM · MADE FOR TODAY</span><h2>{t('不止于商城，更是滋养生活的连接','More than a mall — a connected wellness life')}</h2></div></div><div className="mall-story-grid">{items.map(([Icon,zh,en,copyZh,copyEn])=><article key={en}><span><Icon size={22}/></span><h3>{t(zh,en)}</h3><p>{t(copyZh,copyEn)}</p></article>)}</div></section>;
}