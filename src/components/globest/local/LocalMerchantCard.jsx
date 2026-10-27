import React from 'react';
import LocalServiceTile from '@/components/globest/local/LocalServiceTile';
import safePublicUrl from '@/components/globest/safePublicUrl';
import getLocalServiceEstimate from '@/components/globest/local/getLocalServiceEstimate';
const categoryNames = { food: '美食餐饮', beauty: '美容美发', home: '家政服务', activities: '休闲娱乐', health: '医疗健康', pets: '宠物护理', auto: '汽车养护', education: '教育亲子' };
export default function LocalMerchantCard({ merchant: m, onSelect }) {
  const bookingUrl = !m.is_demo ? safePublicUrl(m.booking_url) : '';
  const rating = !m.is_demo && m.rating_verified && safePublicUrl(m.rating_source_url) ? m.rating : null;
  return <LocalServiceTile name={m.name} image={m.image} imageLabel={m.is_demo ? '演示配图' : '商户刊登图片'} category={categoryNames[m.category] || '本地服务'} area={m.area || '新加坡'} description={m.description || m.service_name} features={m.service_name ? [m.service_name] : []} rating={rating} price={m.service_price} estimate={m.is_demo ? null : getLocalServiceEstimate(m)} deal={m.deal} isDemo={m.is_demo} href={bookingUrl} onClick={() => onSelect(m)} actionLabel={bookingUrl ? '前往预约' : '查看服务详情'}/>;
}