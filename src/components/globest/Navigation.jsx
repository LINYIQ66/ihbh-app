import React from 'react';
import { NavLink } from 'react-router-dom';
import MobileNavigation from '@/components/globest/MobileNavigation';
import { House, MessageCircle, ShoppingBag, Video, UserRound, CircleHelp, Bot } from 'lucide-react';

export default function Navigation({ onHelp, onCart }) {
  const t = (zh, _en = '') => zh;
  return <><nav className="navigation desktop-navigation" aria-label={t('主导航', 'Main navigation')}><NavLink end to="/" className={({isActive})=>isActive?'nav-item active':'nav-item'}><House size={21}/><span>{t('首页','Home')}</span></NavLink><NavLink to="/messages" className={({isActive})=>isActive?'nav-item active':'nav-item'}><MessageCircle size={21}/><span>{t('消息','Messages')}</span></NavLink><button className="nav-cart" onClick={onCart} aria-label={t('购物车','Cart')}><ShoppingBag size={21}/><span>{t('购物车','Cart')}</span></button><NavLink to="/assistant" className={({isActive})=>isActive?'nav-item active':'nav-item'}><Bot size={21}/><span>{t('AI问答','Ask AI')}</span></NavLink><NavLink to="/live" aria-label="直播" className={({isActive})=>isActive?'nav-item active':'nav-item'}><Video size={21} aria-hidden="true"/><span>直播</span></NavLink><NavLink to="/crm?role=user&tab=account" className={({isActive})=>isActive?'nav-item active':'nav-item'}><UserRound size={21}/><span>{t('我的中心','My Center')}</span></NavLink><button className="nav-help" onClick={onHelp} aria-label={t('HBH 健康产品与全球好物', 'HBH wellness and global finds')}><CircleHelp size={20}/><span>{t('HBH好物', 'HBH Finds')}</span></button></nav><MobileNavigation onCart={onCart}/></>;
}