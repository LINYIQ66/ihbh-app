import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Store } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import ListingForm from '@/components/globest/local/ListingForm';

const status = { pending: ['审核中', 'Pending', 'bg-amber-100 text-amber-700'], published: ['已上线', 'Live', 'bg-green-100 text-green-700'], rejected: ['未通过', 'Rejected', 'bg-red-100 text-red-700'] };

export default function MerchantListings({ user }) {
  const { t } = useExperience(); const admin = user.role === 'admin';
  const q = useQuery({ queryKey: ['local-listings', user.id, admin], queryFn: async () => (await base44.entities.LocalListing.filter(admin ? {} : { created_by_id: user.id }, { sort: '-created_date', limit: 50 })).items });
  const act = async (fn) => { await fn(); q.refetch(); };
  return <section className="rounded-xl border bg-card p-5">
    <h3 className="mb-1 flex items-center gap-2 text-lg font-bold"><Store size={18} />{t('商家资讯发布', 'Publish your business')}</h3>
    <p className="mb-4 text-sm text-muted-foreground">{t('发布您的本地生活服务，审核通过后将展示在“本地生活”。', 'List your local service; once approved it appears in Local Life.')}</p>
    <ListingForm onSaved={q.refetch} />
    <h4 className="mb-2 mt-6 font-bold">{admin ? t('全部商家资讯', 'All listings') : t('我的发布', 'My listings')}</h4>
    {q.isLoading ? <p className="text-sm text-muted-foreground">{t('加载中…', 'Loading…')}</p> : !q.data?.length ? <p className="text-sm text-muted-foreground">{t('暂无发布', 'No listings yet')}</p> :
      <div className="space-y-2">{q.data.map(l => { const s = status[l.approval_status] || status.pending; return <div key={l.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3 text-sm">
        <b className="flex-1">{l.name} · {l.service_name} S${l.service_price}</b><span className={`rounded-full px-2 py-0.5 text-xs ${s[2]}`}>{t(s[0], s[1])}</span>
        {admin && l.approval_status !== 'published' && <button className="text-xs font-bold text-green-700" onClick={() => act(() => base44.entities.LocalListing.update(l.id, { approval_status: 'published' }))}>{t('通过', 'Approve')}</button>}
        {admin && l.approval_status === 'pending' && <button className="text-xs font-bold text-red-600" onClick={() => act(() => base44.entities.LocalListing.update(l.id, { approval_status: 'rejected' }))}>{t('拒绝', 'Reject')}</button>}
        <button className="text-xs text-muted-foreground" onClick={() => act(() => base44.entities.LocalListing.delete(l.id))}>{t('删除', 'Delete')}</button>
      </div>; })}</div>}
  </section>;
}