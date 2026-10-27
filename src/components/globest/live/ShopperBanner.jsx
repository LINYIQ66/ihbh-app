import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function ShopperBanner() {
  const { t } = useExperience();
  return <Link to="/discover?section=merchants" className="relative my-4 block overflow-hidden rounded-2xl">
    <Image src="https://media.base44.com/images/public/6aa3280ca2d875c1b77cdd8e/2fcbf2de7_generated_image.png" alt={t('网购达人', 'Smart Shoppers')} className="h-64 w-full md:h-80" />
    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/20 to-transparent p-6 text-white md:p-8">
      <span className="text-xs font-bold tracking-widest text-[#ffb36b]">SMART SHOPPERS ACADEMY</span>
      <h2 className="mt-1 text-2xl font-black md:text-4xl">{t('网购达人课堂', 'Smart Shopper Academy')}</h2>
      <p className="mt-2 max-w-xl text-sm md:text-base">{t('巧掌柜带你学会买、会省、会选，海量视频课程，还能学开店直播带货。', 'Learn to buy smarter, save more and sell live with loads of video courses led by Qiao Zhanggui.')}</p>
      <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#ff5000] px-5 py-2 font-bold">{t('进入网购达人', 'Open Smart Shoppers')}<ArrowRight size={16} /></span>
    </div>
  </Link>;
}