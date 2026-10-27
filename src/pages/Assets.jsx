import React, { useEffect, useState } from 'react';
import TransferForm from '@/components/globest/assets/TransferForm';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AssetOverview from '@/components/globest/assets/AssetOverview';
import LedgerList from '@/components/globest/assets/LedgerList';
import WalletBind from '@/components/globest/assets/WalletBind';
import AgentPolicyForm from '@/components/globest/assets/AgentPolicyForm';
import RwaRoadmap from '@/components/globest/assets/RwaRoadmap';
import AccessNotice from '@/components/globest/AccessNotice';
import PageStatus from '@/components/globest/PageStatus';
import useMe from '@/hooks/useMe';
import { useSearchParams } from 'react-router-dom';

const TABS = [['assets', '资产'], ['transfer', '转让'], ['wallet', 'Web3 钱包'], ['agent', 'AI 支付'], ['rwa', 'RWA']];

export default function Assets() {
  const [params, setParams] = useSearchParams();
  const tab = TABS.some(([key]) => key === params.get('tab')) ? params.get('tab') : 'assets';
  const [busy, setBusy] = useState(false), [v, setV] = useState(0), [msg, setMsg] = useState('');
  const me = useMe();
  const s = useQuery({ queryKey: ['points-summary', me.data?.id, v], queryFn: async () => (await base44.functions.invoke('pointsLedger', { action: 'summary' })).data, enabled: !!me.data, retry: false });
  useEffect(() => { if (!me.data?.id) return; return base44.entities.PointsLedger.subscribe(() => setV(x => x + 1)); }, [me.data?.id]);
  const checkin = async () => {
    setBusy(true); setMsg('');
    try { await base44.functions.invoke('pointsLedger', { action: 'checkin' }); setMsg('签到成功 +20 HBH'); }
    catch (e) { setMsg(e.response?.status === 409 ? '今日已签到' : e.message); }
    setBusy(false); setV(x => x + 1);
  };
  if (me.isPending) return <div className="p-10 text-center text-sm text-muted-foreground" role="status">正在检查登录状态…</div>;
  if (me.isError) return <PageStatus title="无法确认登录状态" onRetry={() => me.refetch()} busy={me.isFetching}/>;
  if (!me.data || (s.error?.status || s.error?.response?.status) === 401) return <AccessNotice title="登录后查看资产" returnTo="/assets"/>;
  if (s.isError) return <PageStatus title="资产资料暂时无法加载" message={(s.error?.status || s.error?.response?.status) === 403 ? '当前账户无权读取资产资料，请确认账户权限。' : '读取资产失败，可重试或返回首页；不会显示推算余额。'} onRetry={() => s.refetch()} busy={s.isFetching}/>;
  if (s.isPending) return <div className="p-10 text-center text-sm text-muted-foreground" role="status">加载资产中…</div>;
  if (!s.data) return <PageStatus title="暂无可读取的资产资料" onRetry={() => s.refetch()} busy={s.isFetching}/>;
  return <div className="page-inner mx-auto max-w-xl space-y-4 pb-24">
    <AssetOverview s={s.data} onCheckin={checkin} busy={busy}/>
    {msg && <p className="text-center text-sm font-semibold text-[#3d7a1f]">{msg}</p>}
    <div className="flex rounded-full bg-muted p-1">{TABS.map(([k, n]) => <button key={k} onClick={() => setParams({ tab: k })} className={`flex-1 rounded-full py-2 text-xs font-bold ${tab === k ? 'bg-card shadow' : 'text-muted-foreground'}`}>{n}</button>)}</div>
    {tab === 'assets' && <LedgerList userId={me.data.id} version={v}/>}
    {tab === 'transfer' && <TransferForm balance={s.data.balance} onDone={() => setV(x => x + 1)}/>}
    {tab === 'wallet' && <WalletBind userId={me.data.id}/>}
    {tab === 'agent' && <AgentPolicyForm userId={me.data.id}/>}
    {tab === 'rwa' && <RwaRoadmap/>}
  </div>;
}