import React from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useExperience } from '@/components/globest/ExperienceProvider';

import DiscoverEditorial from '@/components/globest/DiscoverEditorial';
import ShopperAcademy from '@/components/globest/shopper/ShopperAcademy';
import LocalLife from '@/components/globest/local/LocalLife';
import GeneCellsShowcase from '@/components/globest/genecells/GeneCellsShowcase';
import GlobalFinds from '@/components/globest/global/GlobalFinds';
import HbhCare from '@/components/globest/hbh/HbhCare';
import HbhStores from '@/components/globest/hbh/HbhStores';
import HbhZoneTabs from '@/components/globest/hbh/HbhZoneTabs';
import HbhHerbalCollection from '@/components/globest/hbh/HbhHerbalCollection';
import HbhSupplementCollection from '@/components/globest/hbh/HbhSupplementCollection';
import HbhOtherCollection from '@/components/globest/hbh/HbhOtherCollection';
import { hbhTabs } from '@/components/globest/hbh/hbhZoneData';
import '@/components/globest/discovery.css';

const sections={
  global:{title:['全球好物','Global Finds'],intro:['直接发现全球商品，参考价格与购买信息以商家页面为准。','Browse global products; confirm prices and purchases on the merchant site.']},
  local:{title:['本地生活','Local Living'],intro:['发现新加坡美食、美容、家政、健康、亲子与休闲服务，前往商家官方渠道咨询与预约。','Discover Singapore services and enquire or book through each provider’s official channels.']},
  merchants:{title:['网购达人','Smart Shoppers'],intro:['海量视频课程，教你会买、会省、会选，也能开店直播。','Loads of video courses to buy smarter, save more, and even start selling live.']}
};
export default function Discover(){
 const {t:translate}=useExperience();const [params]=useSearchParams();const requested=params.get('section');const key=requested==='ai'?'other':requested;const t=['global','local'].includes(key)?zh=>zh:translate;
 const isHbh=!sections[key];const k=isHbh?(hbhTabs[key]?key:'hbh'):key;const section=isHbh?hbhTabs[k]:sections[k];
 if(key==='global' && params.has('product'))return <Navigate replace to={`/?product=${encodeURIComponent(params.get('product'))}#catalog`}/>;
 if(key && !hbhTabs[key] && !sections[key])return <section className="page-inner customer-module space-y-4"><h1 className="font-heading text-2xl">未找到该栏目</h1><p>栏目参数无效，请从发现入口重新选择。</p><Link className="primary-btn" to="/discover">返回发现</Link></section>;
 return <div className="page-inner discover-page">{!['global','local'].includes(k) && <div className="page-title"><span className="eyebrow">{isHbh?'HBH ZONE':'环球发现'}</span><h1>{isHbh?t('HBH专区','HBH Zone'):t(...section.title)}</h1><p>{t(...section.intro)}</p></div>}
  {isHbh&&<HbhZoneTabs tabs={hbhTabs} active={k}/>}
  {k==='hbh'&&<><GeneCellsShowcase/><DiscoverEditorial section="hbh"/></>}
  {k==='herbal'&&<HbhHerbalCollection/>}
  {k==='care'&&<><HbhCare/><HbhStores/></>}
  {k==='supplements'&&<HbhSupplementCollection/>}
  {k==='other'&&<HbhOtherCollection/>}
  {k==='global'&&<GlobalFinds/>}
  {k==='local'&&<LocalLife/>}
  {k==='merchants'&&<ShopperAcademy/>}
 </div>;
}