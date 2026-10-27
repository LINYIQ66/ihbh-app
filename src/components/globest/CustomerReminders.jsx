import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function CustomerReminders() {
  const { state, t } = useExperience();
  const account = useQuery({ queryKey: ['message-reminders-account'], queryFn: async () => {
    if (!await base44.auth.isAuthenticated()) return null;
    const user = await base44.auth.me();
    const profiles = await base44.entities.MemberProfile.filter({ transaction_status: {$ne:'prepared'}, email: user.email }, '-joined_at', 1);
    return { user, member: profiles[0] };
  } });
  const reminders = [];
  if (account.data?.user && !account.data.user.address_line1) reminders.push([t('完善收货地址', 'Complete your shipping address'), t('可在我的中心保存地址，方便日后使用。', 'Save an address in your account for future use.'), '/crm?role=user&tab=account']);
  if (account.data?.member?.payment_status === 'test') reminders.push([t('GeneCell 测试礼包', 'GeneCell test package'), t('沙盒订单已记录为测试等级，不产生真实权益。', 'Your sandbox order is recorded as a test tier, with no real benefits.'), '/crm?role=user&tab=account']);
  if (state.reminders.includes('first-live')) reminders.push([t('直播关注提醒', 'Live interest reminder'), t('您已关注首场直播；开播时间尚未公布。', 'You saved interest in the first livestream; no date has been announced.'), '/live']);
  return <section className="mb-8"><h2 className="mb-4 font-heading text-xl">{t('客户提醒', 'Your reminders')}</h2>{account.isLoading ? <p>{t('正在获取提醒…', 'Loading reminders…')}</p> : account.isError ? <p>{t('提醒暂时无法加载。', 'Reminders are unavailable right now.')}</p> : reminders.length ? <div className="message-feed">{reminders.map(([title, body, href]) => <Link key={title} to={href}><Bell size={20} className="shrink-0"/><div><b>{title}</b><p>{body}</p></div></Link>)}</div> : <p className="text-sm text-muted-foreground">{t('暂无客户提醒。', 'No reminders right now.')}</p>}</section>;
}