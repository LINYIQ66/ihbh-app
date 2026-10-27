import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import AllianceStats from '@/components/globest/alliance/AllianceStats';
import PendingApplications from '@/components/globest/alliance/PendingApplications';
import ApprovedMerchants from '@/components/globest/alliance/ApprovedMerchants';
import RecentTransactions from '@/components/globest/alliance/RecentTransactions';

const App = base44.entities.AllianceApplication; const Tx = base44.entities.AllianceTransaction;
export default function AllianceAdmin() {
  const { t } = useExperience();
  const me = useQuery({ queryKey: ['me'], queryFn: () => base44.auth.me() });
  const ok = me.data?.role === 'admin';
  const q = useQuery({ queryKey: ['alliance-admin'], enabled: ok, queryFn: async () => {
    const [status, pending, approved, txByMerchant, recent] = await Promise.all([
      App.aggregate({ groupBy: 'status' }), App.filter({ status: 'pending' }, { sort: '-created_date', limit: 50 }), App.filter({ status: 'approved' }, { sort: '-created_date', limit: 100 }),
      Tx.aggregate({ groupBy: 'alliance_id', sum: 'amount', sort: '-sum_amount', limit: 1000 }), Tx.filter({}, { sort: '-date', limit: 20 })]);
    return { status: status.rows, pending: pending.items, approved: approved.items, totals: txByMerchant.rows, recent: recent.items };
  } });
  if (me.isLoading || (ok && q.isLoading)) return <div className="p-10 text-center text-muted-foreground">{t('加载中…', 'Loading…')}</div>;
  if (!ok) return <div className="p-10 text-center">{t('仅管理员可访问', 'Admins only')}</div>;
  const d = q.data; const sum = d.totals.reduce((s, r) => s + (r.sum_amount || 0), 0); const cnt = d.totals.reduce((s, r) => s + r.count, 0);
  const H = ({ children }) => <h2 className="mb-2 mt-6 text-lg font-black">{children}</h2>;
  return <div className="page-inner pb-12">
    <h1 className="mb-4 text-2xl font-black">{t('异业联盟管理看板', 'Alliance Dashboard')}</h1>
    <AllianceStats statusRows={d.status} txTotal={sum} txCount={cnt} />
    <H>{t(`待审核申请（${d.pending.length}）`, `Pending applications (${d.pending.length})`)}</H><PendingApplications items={d.pending} onChange={q.refetch} />
    <H>{t('已通过商家与流水', 'Approved merchants & volume')}</H><ApprovedMerchants items={d.approved} totals={d.totals} onChange={q.refetch} />
    <H>{t('最近流水', 'Recent transactions')}</H><RecentTransactions items={d.recent} />
  </div>;
}