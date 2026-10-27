import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Copy, Link2, LogIn, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import InviteQRCode from '@/components/globest/InviteQRCode';
import PromotionToolkit from '@/components/globest/PromotionToolkit';
import { inviteUrl } from '@/components/globest/promotionLinks';

export default function ReferralCenter() {
  const { t, notify } = useExperience();
  const userQuery = useQuery({queryKey:['referral-user'],queryFn:async()=>{if(!await base44.auth.isAuthenticated())return null;const {data}=await base44.functions.invoke('ensureInviteCode',{});const user=await base44.auth.me();return {...user,invite_code:data.inviteCode||user.invite_code};}});
  const user = userQuery.data;
  const referralsQuery = useQuery({queryKey:['my-referrals',user?.id],queryFn:()=>base44.entities.Referral.filter({inviter_user_id:user.id},'-registered_at',100),enabled:!!user?.id,refetchInterval:5000});
  if (userQuery.isLoading) return <div className="crm-table-card p-8 text-center">{t('正在准备邀请中心…','Preparing your invite center…')}</div>;
  if (!user) return <div className="referral-login"><LogIn size={30}/><h3>{t('登录后创建专属邀请链接','Sign in to create your invite link')}</h3><button className="primary-btn" onClick={()=>base44.auth.redirectToLogin('/crm?role=user&tab=referrals')}>{t('登录账户','Sign in')}</button></div>;
  const link=inviteUrl(user.invite_code||'');
  const copy=async()=>{await navigator.clipboard.writeText(link);notify(t('专属邀请链接已复制','Your invite link was copied'));};
  return <section className="referral-center"><div className="referral-link-card"><span className="referral-link-icon"><Link2/></span><div><span className="eyebrow">YOUR EXCLUSIVE INVITE</span><h2>{t('分享专属邀请链接','Share your personal invite link')}</h2><p>{link}</p><p className="mt-2 font-semibold">{t('邀约码','Invite code')}: {user.invite_code||'…'}</p></div>{user.invite_code&&<InviteQRCode link={link}/>}<button className="gold-btn" onClick={copy} disabled={!user.invite_code}><Copy size={15}/>{t('复制链接','Copy link')}</button></div>{user.invite_code&&<PromotionToolkit code={user.invite_code}/>}<div className="referral-summary"><div><b>{referralsQuery.data?.length||0}</b><span>{t('已邀请注册','Registered referrals')}</span></div><div><b>{(referralsQuery.data||[]).filter(item=>item.status==='member').length}</b><span>{t('已成为会员','Became members')}</span></div></div><div className="crm-table-card"><div className="referral-table-title"><Users size={18}/><h3>{t('我邀请的用户','People I invited')}</h3></div>{referralsQuery.data?.length?<div className="overflow-x-auto"><table className="crm-table"><thead><tr><th>{t('注册用户','Registered user')}</th><th>{t('状态','Status')}</th><th>{t('注册日期','Registration date')}</th></tr></thead><tbody>{referralsQuery.data.map(item=><tr key={item.id}><td>{item.invitee_email}</td><td><span className="new-badge">{item.status==='member'?t('已入会','Member'):t('已注册','Registered')}</span></td><td>{new Date(item.registered_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>:<div className="empty-state"><Users size={30}/><p>{t('暂时还没有通过您的链接注册的用户。','No one has registered through your link yet.')}</p></div>}</div></section>;
}