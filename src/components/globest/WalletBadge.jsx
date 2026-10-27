import React from 'react';
import { Coins, Sprout } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
export default function WalletBadge({ onClick }) {
  const { state } = useExperience(); const t = (zh, _en = '') => zh;
  return <button onClick={onClick} className="wallet-badge" aria-label={t('查看体验积分钱包', 'View demo points wallet')}><Coins size={15}/><span><b>{state.hbh.toLocaleString()}</b> HBH</span><Sprout size={14} className="game-status"/></button>;
}