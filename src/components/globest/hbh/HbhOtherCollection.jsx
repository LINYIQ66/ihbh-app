import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, BookOpen, Users, MapPin, ArrowUpRight } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import HbhAiConsult from '@/components/globest/hbh/HbhAiConsult';
import HbhMaterialLibrary from '@/components/globest/hbh/HbhMaterialLibrary';

const resources = /** @type {Array<[import('lucide-react').LucideIcon, string, string, string, string, string]>} */ ([
  [Coffee, '草本茶饮', 'Herbal tea', '了解草本茶饮文化与凉茶体验流程。', 'Explore herbal tea traditions and the tea experience.', '/herb-tea'],
  [BookOpen, '健康生活课堂', 'Lifestyle learning', '进入现有视频课堂，浏览食养与生活知识。', 'Browse existing video lessons and everyday food knowledge.', '/discover?section=merchants'],
  [Users, '退休俱乐部', 'Retirement club', '发现乐龄生活、兴趣学习与交流内容。', 'Explore later-life interests, learning and community.', '/retirement-club'],
  [MapPin, '门店与到店体验', 'Stores & visits', '查看平台已有门店资料、地址与联系方式。', 'View existing store information, addresses and contact details.', '/stores']
]);

export default function HbhOtherCollection() {
  const { t } = useExperience();
  return <div className="space-y-7">
    <section aria-labelledby="hbh-more-title"><h2 id="hbh-more-title" className="mb-4 font-heading text-xl text-primary">{t('更多健康生活灵感', 'More ways to explore healthy living')}</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{resources.map(([Icon, zh, en, dz, de, to]) => <Link key={to} to={to} className="flex flex-col rounded-2xl border border-border bg-card p-4 hover:bg-muted/40"><Icon size={24} className="mb-3 text-primary" aria-hidden="true"/><h3 className="text-sm font-semibold text-primary">{t(zh, en)}</h3><p className="mb-3 mt-2 flex-1 text-xs leading-6 text-muted-foreground">{t(dz, de)}</p><span className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-primary">{t('进入了解', 'Explore')}<ArrowUpRight size={14} aria-hidden="true"/></span></Link>)}</div>
    </section>
    <section className="space-y-4"><h2 className="font-heading text-xl text-primary">{t('AI 健康咨询', 'AI wellness guidance')}</h2><HbhAiConsult/></section>
    <HbhMaterialLibrary/>
  </div>;
}