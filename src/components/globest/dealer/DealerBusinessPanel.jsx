import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExperience } from '@/components/globest/ExperienceProvider';
import useDealer from '@/components/globest/dealer/useDealer';
import DealerMoneyCards from '@/components/globest/dealer/DealerMoneyCards';
import DealerTierSwitch from '@/components/globest/dealer/DealerTierSwitch';
import DealerCalculationRules from '@/components/globest/dealer/DealerCalculationRules';
import DealerPurchaseList from '@/components/globest/dealer/DealerPurchaseList';
import DealerInventory from '@/components/globest/dealer/DealerInventory';
import DealerPerformance from '@/components/globest/dealer/DealerPerformance';
import DealerShipList from '@/components/globest/dealer/DealerShipList';
import DealerLedger from '@/components/globest/dealer/DealerLedger';
import DealerResources from '@/components/globest/dealer/DealerResources';
import PurchaseForm from '@/components/globest/dealer/PurchaseForm';
import ShipForm from '@/components/globest/dealer/ShipForm';
import { getDealerTier } from '@/components/globest/dealer/dealerTierData';
const tabs = [['overview', '经营概览'], ['bills', '账单'], ['inventory', '库存'], ['earnings', '分润收益']];
export default function DealerBusinessPanel({ user }) {
  const { notify } = useExperience(); const d = useDealer(user); const [tab, setTab] = useState('overview'); const [selected, setSelected] = useState(null);
  if (d.loading) return <p role="status" className="p-6 text-center text-muted-foreground">正在加载经营账目…</p>;
  if (d.error) return <div className="space-y-3 rounded-2xl border border-border bg-card p-5"><p role="alert" className="text-sm text-destructive">账目读取失败：{d.error.response?.data?.error || d.error.message}</p><button type="button" onClick={d.reload} disabled={d.refreshing} className="min-h-11 rounded-lg border border-border px-4 text-sm text-primary focus-visible:ring-2 focus-visible:ring-ring">重新加载</button></div>;
  const account = d.summary.account; const tier = getDealerTier(selected || account?.tier || 'partner');
  return <div className="space-y-5"><DealerTierSwitch selected={tier.key} onSelect={setSelected} account={account}/><div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground"><p>{account?.active ? `当前结算身份：${getDealerTier(account.tier).zh}。切换上方等级仅查看权益，不改变本人账务。` : '尚未开通有效经销身份，请由管理员授权后办理采购与出货。'}所有账目均为本人真实记录，无示例收益。</p>{user.role === 'admin' && <Link to="/crm?role=admin&tab=dealer-settings" className="inline-flex min-h-11 items-center rounded text-primary underline">身份与实收审核</Link>}</div><DealerMoneyCards summary={d.summary}/><nav aria-label="经销商账目分类" className="grid grid-cols-4 gap-1 rounded-xl border border-border bg-card p-1">{tabs.map(([key, label]) => <button key={key} type="button" aria-current={tab === key ? 'page' : undefined} onClick={() => setTab(key)} className={tab === key ? 'min-h-11 rounded-lg bg-primary px-1 text-xs font-semibold text-primary-foreground sm:text-sm' : 'min-h-11 rounded-lg px-1 text-xs text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary sm:text-sm'}>{label}</button>)}</nav>{tab === 'overview' && <><DealerPerformance user={user}/><section className="rounded-2xl border border-border bg-card p-5"><h2 className="font-semibold text-primary">{tier.zh}权益介绍</h2><p className="mt-3 text-sm text-muted-foreground">{tier.intro}</p><p className="mt-3 text-sm">全业返利 {tier.rebate}% · 每月氧舱体验权益 {tier.oxygen} 次</p><div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center text-xs text-muted-foreground"><span>采购单<strong className="mt-1 block text-lg text-primary">{d.summary.purchase_count}</strong></span><span>出货单<strong className="mt-1 block text-lg text-primary">{d.summary.sales_count}</strong></span><span>库存件数<strong className="mt-1 block text-lg text-primary">{d.summary.stock_qty}</strong></span></div></section><DealerCalculationRules/><DealerResources user={user}/></>}{tab === 'bills' && <>{account?.active && <PurchaseForm user={user} d={d} notify={notify}/>}<DealerPurchaseList d={d} notify={notify}/><DealerShipList d={d}/></>}{tab === 'inventory' && <><DealerInventory d={d}/>{account?.active && <ShipForm d={d} notify={notify}/>}</>}{tab === 'earnings' && <><DealerLedger user={user} summary={d.summary}/><Link to="/earnings" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm text-primary">查看可提现余额与提现记录</Link><DealerCalculationRules/></>}</div>;
}