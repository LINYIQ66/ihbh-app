import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
import '@/components/globest/brand-logo.css';
export const LOGO_URL = 'https://media.base44.com/images/public/6aa3280ca2d875c1b77cdd8e/0183c5aea_152.jpeg';
export default function BrandLogo() {
  const { t } = useExperience();
  return <Link to="/" className="brand-lockup" aria-label={t('iHBH · Globest Mall 首页', 'iHBH · Globest Mall home')}>
    <span className="flex shrink-0 flex-col items-center gap-1">
      <span className="brand-logo-frame"><Image src={LOGO_URL} alt="iHBH" fittingType="fit" className="brand-logo-image h-16 w-24 shrink-0 sm:h-20 sm:w-[120px] lg:h-28 lg:w-[168px]" /></span>
      <span lang="zh-CN" className="brand-wellness-typing whitespace-nowrap font-brand text-base font-normal text-primary sm:text-sm lg:text-base">健康美丽快乐</span>
    </span>
    <span className="brand-lockup-copy flex min-w-0 flex-col leading-tight"><strong className="flex flex-wrap items-center gap-x-1 text-lg sm:text-lg lg:gap-x-10"><span className="whitespace-nowrap">好物相链</span><span className="whitespace-nowrap">商业相通</span></strong><small lang="en" className="text-[10px] tracking-wide opacity-70">Linking Great Goods · Connecting Business</small></span>
  </Link>;
}