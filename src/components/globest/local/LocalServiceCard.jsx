import React from 'react';
import { UtensilsCrossed, Sparkles, House, HeartPulse, PawPrint, Car, GraduationCap, Ticket, Dumbbell, Package, Truck, Flower2, Shirt, Wrench, Store, Landmark, ShieldCheck } from 'lucide-react';
import LocalServiceTile from '@/components/globest/local/LocalServiceTile';
import safePublicUrl from '@/components/globest/safePublicUrl';
import getLocalServiceEstimate from '@/components/globest/local/getLocalServiceEstimate';

const visuals = {
  '餐厅': [UtensilsCrossed, 'photo-1579871494447-9811cf80d66c'],
  '美容美发': [Sparkles, 'photo-1560066984-138dadb4c035'],
  '家政清洁': [House, 'photo-1581578731548-c64695cc6952'],
  '医疗健康': [HeartPulse, 'photo-1519494026892-80bbd2d6fd0d'],
  '宠物护理': [PawPrint, 'photo-1516734212186-a967f81ad0d7'],
  '汽车养护': [Car, 'photo-1607860108855-64acf2078ed9'],
  '教育亲子': [GraduationCap, 'photo-1503676260728-1c00da094a0b'],
  '休闲娱乐与票务': [Ticket, 'photo-1526481280693-3bfa7568e0f3'],
  '运动健身': [Dumbbell, 'photo-1517836357463-d25dfeac3438'],
  '空调与除虫': [Wrench, 'photo-1621905251189-08b45d6a269e'],
  '搬家与仓储': [Package], '同城配送': [Truck], '鲜花礼赠': [Flower2],
  '洗衣护理': [Shirt], '家居亲子': [House], '证券': [Landmark], '银行': [Landmark], '保险': [ShieldCheck]
};
const officialImages = {
  'https://www.helpling.com.sg/': 'https://www.helpling.com.sg/wp-content/uploads/2026/08/Superhelper-methode-Irene-Ang-1.webp',
  'https://www.mandai.com/en.html': 'https://www.mandai.com/content/dam/mandai/about-mandai/mandai-wildlife-reserve-1200x630.png'
};
export default function LocalServiceCard({ service, priority = false }) {
  const { category, name, description, url } = service;
  const [Icon, photo] = visuals[category] || [Store];
  const officialImage = service.image || officialImages[url];
  const illustrativePhoto = url === 'https://yakun.com/' ? 'photo-1501339847302-ac426a4a7cbb' : photo;
  const image = officialImage || (illustrativePhoto ? `https://images.unsplash.com/${illustrativePhoto}?auto=format&fit=crop&w=640&q=80` : '');
  const bookingUrl = safePublicUrl(service.booking_url);
  const rating = service.rating_verified && safePublicUrl(service.rating_source_url) ? service.rating : null;
  const features = description.split(/[、，；。]/).map(text => text.trim()).filter(text => text && text.length <= 14).slice(0, 2);
  return <LocalServiceTile name={name} image={image} imageLabel={officialImage ? '商家配图' : '服务示意图'} category={category} description={description} features={features} rating={rating} price={service.price_sgd} estimate={getLocalServiceEstimate(service)} deal={service.deal} href={bookingUrl || safePublicUrl(url)} actionLabel={bookingUrl ? '前往预约' : '查看官网'} priority={priority} icon={Icon}/>;
}