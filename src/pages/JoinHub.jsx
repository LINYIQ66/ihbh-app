import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Dna, Leaf, Coffee, Package, Store } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';

const options = /** @type {Array<[import('lucide-react').LucideIcon, string, string, string, string, string]>} */ ([
  [Dna, 'GeneCells 加盟', 'GeneCells franchise', '细胞健康项目合作', 'Cellular wellness partnership', '/discover?section=hbh'],
  [Leaf, '九珍堂加盟', 'Jiuzhentang franchise', '传统滋补门店', 'Traditional tonic stores', '/partner'],
  [Coffee, 'AI 凉茶铺加盟', 'AI Herbal Tea Shop', '智能养生茶饮', 'Smart wellness tea', '/partner'],
  [Package, 'iHBH 产品', 'iHBH products', '选购与分享好物', 'Shop and share', '/'],
  [Store, '商家入驻', 'Merchant onboarding', '开店接单，触达用户', 'Open shop, reach customers', '/seller'],
]);

export default function JoinHub() {
  const { t } = useExperience();
  return <div className="mx-auto max-w-4xl space-y-6 py-6">
    <header className="rounded-2xl bg-gradient-to-r from-[#0F382C] to-[#6CBB3C] p-6 text-white"><span className="text-xs font-bold tracking-widest">GLOBAL RECRUITMENT</span><h1 className="mt-2 text-3xl font-black">{t('全球招募', 'Join us worldwide')}</h1><p className="mt-2 text-lg">{t('让用户更省钱，创业更轻松', 'Save more as a user, start a business with ease')}</p><p className="mt-1 text-sm opacity-90">{t('不止于商城，更是平方生活的连接', 'More than a mall: connecting everyday life')}</p></header>
    <div className="grid gap-3 sm:grid-cols-2">{options.map(([Icon, zh, en, dz, de, to]) => <Link key={en} to={to} className="flex items-center gap-4 rounded-2xl border bg-card p-5 hover:border-[#6CBB3C]"><Icon className="h-8 w-8 shrink-0 text-[#6CBB3C]"/><div className="flex-1"><b className="block">{t(zh, en)}</b><span className="text-sm text-muted-foreground">{t(dz, de)}</span></div><ArrowUpRight className="text-muted-foreground"/></Link>)}</div>
  </div>;
}