import React from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { base44 } from '@/api/base44Client';

export default function PendingApplications({ items, onChange }) {
  const { t } = useExperience();
  const set = async (id, status) => { await base44.entities.AllianceApplication.update(id, { status }); onChange(); };
  if (!items.length) return <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">{t('暂无待审核申请', 'No pending applications')}</p>;
  return <div className="grid gap-3 md:grid-cols-2">{items.map(a => <div key={a.id} className="rounded-xl border bg-card p-4 text-sm">
    <b className="text-base">{a.business_name}</b><span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">{a.industry}</span>
    <p className="mt-1 text-muted-foreground">{a.contact_name} · {a.phone}{a.email && ` · ${a.email}`}{a.area && ` · ${a.area}`}</p>
    {a.offer && <p className="mt-2 rounded-lg bg-muted p-2">{a.offer}</p>}
    <p className="mt-1 text-xs text-muted-foreground">{new Date(a.created_date).toLocaleString()}</p>
    <div className="mt-3 flex gap-2"><button onClick={() => set(a.id, 'approved')} className="flex-1 rounded-full bg-green-600 py-1.5 font-bold text-white">{t('通过', 'Approve')}</button><button onClick={() => set(a.id, 'rejected')} className="flex-1 rounded-full border py-1.5 font-bold">{t('拒绝', 'Reject')}</button></div>
  </div>)}</div>;
}