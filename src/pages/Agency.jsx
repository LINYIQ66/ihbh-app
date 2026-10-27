import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { HERO_IMG, roles } from '@/components/globest/agency/agencyData';
import RoleIntro from '@/components/globest/agency/RoleIntro';
import RolePriceTable from '@/components/globest/agency/RolePriceTable';
import ReferralDiagram from '@/components/globest/agency/ReferralDiagram';
import ReferralExamples from '@/components/globest/agency/ReferralExamples';
import ProfitSharing from '@/components/globest/agency/ProfitSharing';
import CatalogExtras from '@/components/globest/agency/CatalogExtras';
import SystemRules from '@/components/globest/agency/SystemRules';
import MemberAndTraffic from '@/components/globest/agency/MemberAndTraffic';

const H = ({ n, children }) => <h2 className="mb-3 flex items-center gap-2 text-xl font-bold"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8a5a2b] text-sm text-white">{n}</span>{children}</h2>;

export default function Agency() {
  const { t } = useExperience();
  const qRole = new URLSearchParams(window.location.search).get('role');
  const [role, setRole] = useState(['agent', 'official'].includes(qRole) ? qRole : 'partner');
  const r = roles[role];
  return <div className="page-inner space-y-8 pb-12">
    <section className="relative overflow-hidden rounded-3xl">
      <Image src={HERO_IMG} alt="HBH" className="h-56 w-full" />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-5 text-white">
        <span className="text-xs tracking-widest text-[#e8d3a7]">HBH GLOBAL WELLNESS EXPERIENCE HUB</span>
        <h1 className="text-2xl font-bold">{t('全球招募合伙人 · 总代', 'Partners & General Agents Wanted')}</h1>
        <p className="text-sm">{t('让创业更赚钱，用户更省钱', 'More profit for founders, more savings for users')}</p>
      </div>
    </section>
    <div className="flex gap-2 rounded-full bg-muted p-1">{['partner', 'official', 'agent'].map(k => <button key={k} onClick={() => setRole(k)} className={`flex-1 rounded-full py-2 font-bold ${role === k ? 'bg-[#8a5a2b] text-white' : ''}`}>{t(roles[k].zh, roles[k].en)}</button>)}</div>
    <section><H n="1">{t(`${r.zh}是谁`, `Who is a ${r.en}`)}</H><RoleIntro role={role} /></section>
    <section><H n="2">{t('主业直销价格表（GeneCells，新币）', 'Direct-sales price list (GeneCells, SGD)')}</H><RolePriceTable role={role} /></section>
    <section><H n="3">{t('平级介绍示意图（三代循环）', 'Peer referral diagram (3-gen cycle)')}</H><div className="grid gap-3 md:grid-cols-2"><ReferralDiagram role={role} /><ReferralExamples role={role} /></div></section>
    <section><H n="4">{t('全业产品分润说明', 'All-industry profit sharing')}</H><ProfitSharing role={role} /></section>
    <section><H n="5">{t('全业产品价格目录', 'Full-business catalog')}</H><CatalogExtras /></section>
    <section><H n="6">{t('会员与流量支持', 'Membership & traffic support')}</H><MemberAndTraffic /></section>
    <SystemRules />
    <Link to="/hbh-erp" className="flex items-center justify-between rounded-2xl bg-[#0F382C] p-4 text-white"><div><b className="block">{t('HBH 支付·会员·分润管理看板', 'HBH payments & commission dashboard')}</b><span className="text-xs text-[#e8d3a7]">{t('总部看板 · 六大模块 · 结算逻辑', 'HQ KPIs · 6 modules · settlement')}</span></div><span>→</span></Link>
    <section className="rounded-3xl bg-gradient-to-r from-[#8a5a2b] to-[#c9a063] p-6 text-center text-white">
      <h3 className="text-xl font-bold">{t('立即申请成为' + r.zh, 'Apply now')}</h3>
      <p className="my-2 text-sm">{t('HBH全球健康（新加坡）控股有限公司', 'HBH Global Health (Singapore) Holding Co., Ltd.')}</p>
      <Link to="/partner" className="inline-block rounded-full bg-white px-6 py-2 font-bold text-[#8a5a2b]">{t('提交申请', 'Submit application')}</Link>
    </section>
  </div>;
}