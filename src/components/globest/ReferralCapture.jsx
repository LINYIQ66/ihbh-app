import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function ReferralCapture() {
  useEffect(()=>{ base44.auth.isAuthenticated().then(async ok=>{ if(!ok) return; await base44.functions.invoke('ensureInviteCode',{}); const code=localStorage.getItem('globest-pending-referral'); if(code){await base44.functions.invoke('recordReferral',{inviteCode:code});localStorage.removeItem('globest-pending-referral');} }).catch(()=>{}); },[]);
  return null;
}