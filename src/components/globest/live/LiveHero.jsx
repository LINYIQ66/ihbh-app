import React from 'react';
import { Image } from '@/components/ui/image';
import { images } from '@/components/globest/live/LiveStories';

export default function LiveHero({ t }){
  return <section className="live-recommend"><div className="live-hero"><Image className="live-hero-art" src={images[1]} alt="Natural-light wellness expert interview"/><div className="live-hero-copy"><span className="live-eyebrow">A CLOSER LOOK AT WELLNESS</span><h1>{t('好物相见，滋养有声','Discover the stories behind the roots.')}</h1><p>{t('走进产地，认识选品，与健康生活的分享者面对面。','Meet the growers, discover the ingredients, and get closer to your wellness ritual.')}</p></div></div><div className="live-profile-card live-glass"><div><h3>Discover your wellness circle</h3><p>Meet the growers, discover the ingredients, and get closer to your wellness ritual.</p></div><div className="live-avatars"><Image src={images[0]} alt="Natural-light wellness livestream portrait"/><Image src={images[2]} alt="Natural-light kitchen wellness demonstration"/><Image src={images[1]} alt="Natural-light wellness expert interview"/><b>+ 28 friends</b></div></div></section>;
}