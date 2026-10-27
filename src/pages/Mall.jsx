import React from 'react';
import { Sun, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useExperience } from '@/components/globest/ExperienceProvider';
import HeroBanner from '@/components/globest/HeroBanner';
import HbhChannels from '@/components/globest/hbh/HbhChannels';
import Catalog from '@/components/globest/Catalog';
import '@/components/globest/discovery.css';
import Reveal from '@/components/globest/Reveal';
import HomeBrandShowcase from '@/components/globest/HomeBrandShowcase';
export default function Mall() {
  const { t } = useExperience();
  return <div className="page-inner mall-page"><div className="welcome-line"><span><Sun size={14} className="text-[#B28A45]"/>{t('全球好品质', 'Global quality')}</span><Link to="/crm?role=user" className="flex items-center gap-1"><span>{t('健康好生活', 'Healthy living')}</span><ArrowUpRight size={12}/></Link></div><Reveal glow><HeroBanner/></Reveal><Reveal><HbhChannels/></Reveal><HomeBrandShowcase/><Catalog/></div>;
}