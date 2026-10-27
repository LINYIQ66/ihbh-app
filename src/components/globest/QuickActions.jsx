import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Globe2, MapPin, Store, ArrowUpRight } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
export default function QuickActions() {
  const { t } = useExperience();
  return <div className="quick-actions">{/** @type {Array<[import('lucide-react').LucideIcon, string, string, string, string, string]>} */ ([[HeartPulse,'/discover?section=hbh','HBH专区','HBH Zone','健康关注点与食养','Wellness interests'],[Globe2,'/discover?section=global','全球好物','Global Finds','发现多地食养传统','Explore global traditions'],[MapPin,'/discover?section=local','本地生活','Local Living','社区与本地灵感','Local stories'],[Store,'/live','直播视频','Live videos','直播带货与互动','Live shopping']]).map(([Icon,path,zh,en,sub,suben]) => <Link to={path} key={path}><span className="quick-icon"><Icon size={23} strokeWidth={1.5}/></span><span><b>{t(zh,en)}</b><small>{t(sub,suben)}</small></span><ArrowUpRight size={16} className="quick-arrow"/></Link>)}</div>;
}