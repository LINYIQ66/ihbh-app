import React from 'react';
import { Image } from '@/components/ui/image';
import Reveal from '@/components/globest/Reveal';
import SiteShowcase from '@/components/globest/site/SiteShowcase';

export default function HomeBrandShowcase() {
  return <div className="my-5 grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
    <figure className="mx-auto w-full max-w-[18rem] overflow-hidden rounded-2xl border border-border lg:order-2 lg:max-w-none">
      <Image
        src="https://media.base44.com/images/public/6aa3280ca2d875c1b77cdd8e/842780ec9_image.png"
        alt="iHBH 品牌海报：购物、体验、旅行，全球好品质，健康好生活。熊猫与地球、健康好物共同呈现。"
        fittingType="fit"
        originWidth={460}
        originHeight={1024}
        className="block aspect-[115/256] w-full object-contain"
      />
    </figure>
    <div className="min-w-0 lg:order-1"><Reveal glow><SiteShowcase /></Reveal></div>
  </div>;
}