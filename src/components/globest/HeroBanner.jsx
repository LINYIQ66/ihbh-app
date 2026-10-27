import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Leaf, Globe2, ShieldCheck } from 'lucide-react';
import HeroVideo from '@/components/globest/HeroVideo';
import { useExperience } from '@/components/globest/ExperienceProvider';
export default function HeroBanner() {
  const { t } = useExperience();
  return <div className="hero-banner"><HeroVideo/><div className="hero-shade"/><div className="hero-copy"><div className="hero-kicker"><span/> {t('承东方智慧 · 融现代科技', 'ANCIENT WISDOM. MODERN WELLNESS.')}</div><h1>{t('健康，美丽，快乐。', 'Health. Beauty. Happiness.')}<br/><span>{t('汇集全球好物。', 'The world’s finest, gathered for you.')}</span></h1><p className="hero-english">Health · Beauty · Happiness</p><p className="hero-description">{t('长白山野山参 × 美国 GeneCell', 'Wild Mountain Ginseng × GeneCell USA')}<br/>{t('从山林珍萃到细胞营养，开启您的滋养旅程。', 'From treasured botanicals to a modern wellness ritual.')}</p><a className="gold-btn" href="#catalog">{t('探索滋养好物', 'Discover the collection')}<ArrowRight size={16}/></a><div className="hero-trust"><span><Leaf size={13}/>{t('天然甄选', 'Nature inspired')}</span><span><Globe2 size={13}/>{t('环球滋养', 'Global wellness')}</span><span><ShieldCheck size={13}/>{t('用心选品', 'Thoughtfully curated')}</span></div></div><Link to="/live" className="hero-live"><span className="live-play"><Play size={14} fill="currentColor"/></span><span><b>{t('好物直播间', 'Wellness, live')}</b><small>{t('即将开启 · 敬请期待', 'Coming soon · Stay inspired')}</small></span><ArrowRight size={14}/></Link><div className="hero-pagination"><span/><i/><i/></div></div>;
}