import React from 'react';
import PageShell from '@/components/globest/me/PageShell';
import MemberAddressManager from '@/components/globest/account/MemberAddressManager';

export default function Addresses() {
  return <PageShell title="地址管理" needLogin>{user => <MemberAddressManager user={user} showHeading={false}/>}</PageShell>;
}