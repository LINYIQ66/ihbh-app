import React from 'react';
import { NavLink } from 'react-router-dom';
import { House, MessageCircle, ShoppingBag, UserRound } from 'lucide-react';
import { Image } from '@/components/ui/image';
import '@/components/globest/mobile-navigation.css';

export default function MobileNavigation({ onCart }) {
  return <nav className="navigation mobile-navigation" aria-label="手机底部导航">
    <NavLink end to="/" className="mobile-nav-item"><House size={22} aria-hidden="true"/><span>首页</span></NavLink>
    <NavLink to="/messages" className="mobile-nav-item"><MessageCircle size={22} aria-hidden="true"/><span>消息</span></NavLink>
    <NavLink to="/rewards" className="mobile-nav-item mobile-rewards-link" aria-label="兑换积分资产">
      <Image src="https://media.base44.com/images/public/6aa3280ca2d875c1b77cdd8e/32d156a8f_image.png" alt="" aria-hidden="true" fittingType="fill" focalPointX={0.44} focalPointY={0.5} className="mobile-rewards-image"/><span className="mobile-rewards-caption text-rewards" aria-hidden="true">积分资产</span>
    </NavLink>
    <button type="button" className="mobile-nav-item" onClick={onCart} aria-label="打开购物车"><ShoppingBag size={22} aria-hidden="true"/><span>购物车</span></button>
    <NavLink to="/crm?role=user&tab=account" className="mobile-nav-item"><UserRound size={22} aria-hidden="true"/><span>我的中心</span></NavLink>
  </nav>;
}