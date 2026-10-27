import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import Header from '@/components/globest/Header';
import Navigation from '@/components/globest/Navigation';
import CartPanel from '@/components/globest/CartPanel';
import UtilityPanel from '@/components/globest/UtilityPanel';
import ReferralCapture from '@/components/globest/ReferralCapture';
import '@/components/globest/globest.css';
import '@/components/globest/storefront.css';
import '@/components/globest/visual-refresh.css';
import '@/components/globest/discovery.css';
import '@/components/globest/taobao-theme.css';
import '@/components/globest/customer-modules.css';
import SiteFooter from '@/components/globest/SiteFooter';
export default function GlobestLayout() {
  const { t, claimed, claim } = useExperience(); const [cart,setCart] = useState(false); const [panel,setPanel] = useState(null);
  return <div className="globest-app"><ReferralCapture/><div className="site-header"><Header setCart={setCart}/></div><div className="app-body"><Navigation onHelp={() => setPanel('sources')} onCart={() => setCart(true)}/><main className="main-content"><Outlet/><SiteFooter/></main></div><CartPanel open={cart} onOpenChange={setCart}/><UtilityPanel type={panel} setType={setPanel}/>{!claimed('daily') && <button className="floating-claim" onClick={() => claim('daily',20)} aria-label={t('每日签到领取 20 HBH 体验积分', 'Claim 20 daily demo HBH points')}><Gift size={22}/></button>}</div>;
}