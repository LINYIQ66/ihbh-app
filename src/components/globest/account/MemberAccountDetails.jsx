import React from 'react';
import { ShieldCheck, MapPin } from 'lucide-react';
import MemberProfileForm from '@/components/globest/MemberProfileForm';

export default function MemberAccountDetails({ user, onSaved }) {
  return <div id="profile-details" className="account-content-grid scroll-mt-28"><MemberProfileForm user={user} onSaved={onSaved}/><aside className="account-side"><section><ShieldCheck aria-hidden="true"/><h3>账户安全</h3><p>登录凭据由认证服务管理，修改资料不会改变登录邮箱。</p></section><section><MapPin aria-hidden="true"/><h3>配送提示</h3><p>可保存多个收货地址；具体配送安排以实际订单及商家确认为准。</p></section></aside></div>;
}