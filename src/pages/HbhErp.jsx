import React from 'react';
import { Lock } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import KpiBoard from '@/components/globest/erp/KpiBoard';
import ModuleGrid from '@/components/globest/erp/ModuleGrid';
import SettlementFlow from '@/components/globest/erp/SettlementFlow';
import { roles } from '@/components/globest/erp/erpData';

const H = ({ children }) => <h2 className="mb-3 text-lg font-bold text-[#0F382C]">{children}</h2>;
export default function HbhErp() {
  const { t } = useExperience();
  return <div className="page-inner space-y-8 pb-12">
    <section className="rounded-3xl bg-gradient-to-br from-[#0F382C] to-[#1d5a47] p-5 text-white">
      <span className="text-xs tracking-widest text-[#e8d3a7]">HBH ERP · MEMBER APP · SETTLEMENT</span>
      <h1 className="mt-1 text-2xl font-bold">{t('HBH 支付、购物、会员与分润管理看板', 'HBH Payments, Shopping, Members & Commission Dashboard')}</h1>
      <p className="mt-2 text-sm opacity-90">{t('统一 ERP 管理后台 + 会员 APP + 支付结算系统，整合购物、充值、推荐关系、佣金与财务对账。所有交易自动留痕，所有分润可以追溯。', 'Unified ERP + member app + settlement: shopping, recharge, referrals, commissions and reconciliation. Every transaction logged, every commission traceable.')}</p>
    </section>
    <section><H>{t('一、总部经营总看板', '1. HQ overview')}</H><KpiBoard /></section>
    <section><H>{t('二、六大核心模块', '2. Six core modules')}</H><ModuleGrid /></section>
    <section><H>{t('三、关键结算逻辑', '3. Settlement logic')}</H><SettlementFlow /></section>
    <section><H>{t('四、分级权限与审计', '4. Permissions & audit')}</H>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">{roles.map(r => <div key={r[0]} className="rounded-2xl border bg-card p-3"><b className="flex items-center gap-1 text-sm"><Lock size={14} className="text-[#c9a063]" />{t(r[0], r[1])}</b><p className="mt-1 text-xs text-muted-foreground">{t(r[2], r[3])}</p></div>)}</div>
    </section>
    <section className="rounded-3xl bg-[#e8d3a7] p-5 text-black">
      <h3 className="font-bold">{t('最终目标', 'Goal')}</h3>
      <p className="mt-1 text-sm">{t('总部掌握每一笔资金，代理查看自己的收益，会员查询消费和储值明细，财务可追溯到每笔订单。设置完整审计日志，形成支持多门店、多国家运营的 HBH 数字化管理平台。', 'HQ sees every dollar, agents see their earnings, members see spend and balances, finance traces every order. Full audit logs power a multi-store, multi-country HBH platform.')}</p>
    </section>
  </div>;
}