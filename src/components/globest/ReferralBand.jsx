import React from 'react';
import { Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useExperience } from '@/components/globest/ExperienceProvider';
export default function ReferralBand() {
  const { t } = useExperience();
  return <section className="referral-band"><div className="referral-symbol"><Users size={28} strokeWidth={1.3}/></div><div className="referral-copy"><span className="eyebrow">GROW TOGETHER, THRIVE TOGETHER</span><h2>{t('分享专属链接，见证每一次连接', 'Share your link. Grow your circle.')}</h2><p>{t('登录后生成您的专属邀请链接，并在我的中心查看通过链接注册的用户。', 'Create your personal invite link and track every registration in My Center.')}</p></div><div className="referral-buttons"><Link className="gold-btn" to="/crm?role=user&tab=referrals">{t('管理我的邀请', 'Manage my invites')}<ArrowUpRight size={14}/></Link></div></section>;
}