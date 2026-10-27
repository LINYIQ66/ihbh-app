import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Coins, Ticket, MessageCircle } from 'lucide-react';
import RetirementHero from '@/components/globest/retirement/RetirementHero';
import RetirementLife from '@/components/globest/retirement/RetirementLife';

const SERVICES = /** @type {Array<[import('lucide-react').LucideIcon, string, string, string]>} */ ([
  [Coins, '积分与权益', '沿用已有积分账户与权益入口，不另设一套余额。', '/rewards'],
  [Ticket, '我的票夹', '查询已有服务、活动与卡券凭证的实际状态。', '/tickets'],
  [MessageCircle, '在线咨询', '通过现有消息中心了解平台服务与参与方式。', '/messages'],
]);
const QUESTIONS = [
  ['怎样开始参与？', '可以先浏览兴趣内容或平台公开活动，核对主办方、时间、地点、费用与参与规则，再按现有页面要求操作。通用活动不等于退休俱乐部专场。'],
  ['是否需要另付俱乐部会费？', '本页没有新增俱乐部会费或自动扣费入口。已有会员、活动、商品和服务仍适用各自页面的规则，不承诺未公布的优惠。'],
  ['能直接报名退休旅游团吗？', '目前没有开放俱乐部专属旅游线路或团费支付，可从“出游需求咨询”进入平台客服。只有正式公布主办方、行程与规则后，才按对应服务说明参与。'],
];
export default function RetirementClub() {
  return <div className="customer-module page-inner mx-auto max-w-6xl space-y-9 sm:space-y-12">
    <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-primary"><ArrowLeft size={17} aria-hidden="true"/>返回商城首页</Link>
    <RetirementHero/>
    <RetirementLife/>
    <section aria-labelledby="club-services-title" className="rounded-3xl bg-primary p-6 text-primary-foreground sm:p-8">
      <h2 id="club-services-title" className="font-heading text-2xl">已有账户，生活权益自然相连</h2><p className="mt-3 text-base leading-8 opacity-80">连接现有积分、票夹和消息服务，少找几个入口，多留一点时间给生活。</p>
      <div className="mt-6 grid gap-3 lg:grid-cols-3">{SERVICES.map(([Icon, title, detail, to]) => <Link to={to} key={to} className="rounded-2xl border border-primary-foreground/25 p-5"><div className="flex items-center justify-between"><Icon size={25} aria-hidden="true"/><ArrowRight size={18} aria-hidden="true"/></div><h3 className="mt-4 text-lg font-semibold">{title}</h3><p className="mt-2 text-base leading-7 opacity-80">{detail}</p></Link>)}</div>
    </section>
    <section className="rounded-3xl border bg-card p-6 sm:p-8"><h2 className="font-heading text-2xl">参与之前，先说清楚</h2><div className="mt-4 divide-y">{QUESTIONS.map(([question, answer]) => <details key={question} className="py-2"><summary className="min-h-12 cursor-pointer py-3 text-base font-semibold text-primary">{question}</summary><p className="pb-4 text-base leading-8 text-muted-foreground">{answer}</p></details>)}</div></section>
    <p className="text-center text-sm leading-7 text-muted-foreground">iHBH 独立生活内容专区，并非第三方退休俱乐部的官方页面。具体服务与活动以平台实际公布的信息为准。</p>
  </div>;
}