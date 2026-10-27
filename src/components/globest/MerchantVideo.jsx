import React from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function MerchantVideo() {
  const { t } = useExperience();
  return <section className="my-6 overflow-hidden rounded-xl border border-border bg-card" aria-label={t('巧掌柜视频', 'Local Merchant Picks video')}>
    <video className="block w-full max-h-[70vh] bg-foreground object-contain" src="https://media.base44.com/videos/public/6aa3280ca2d875c1b77cdd8e/edd93fcdf_655.mov" controls playsInline preload="metadata" aria-label={t('巧掌柜介绍视频', 'Local Merchant Picks introduction video')}>
      {t('当前浏览器不支持此视频。', 'Your browser does not support this video.')}
    </video>
  </section>;
}