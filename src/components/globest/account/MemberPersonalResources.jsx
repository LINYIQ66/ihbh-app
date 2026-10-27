import React, { useState } from 'react';
import ReferralCenter from '@/components/globest/ReferralCenter';
import PhotoArchive from '@/components/globest/photos/PhotoArchive';
export default function MemberPersonalResources({ user }) {
  const [open, setOpen] = useState(false);
  return <details onToggle={e => setOpen(e.currentTarget.open)} className="rounded-2xl border border-border bg-card p-4 sm:p-5"><summary className="min-h-8 cursor-pointer font-semibold text-primary focus-visible:ring-2 focus-visible:ring-primary">我的邀请与健康档案</summary>{open && <div className="mt-5 space-y-5"><div id="my-invite"><ReferralCenter/></div><PhotoArchive user={user}/></div>}</details>;
}