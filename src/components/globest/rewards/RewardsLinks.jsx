import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Gift, Ticket, Coins, Sprout, UsersRound, Wallet, Bot, ShieldCheck } from 'lucide-react';

const GROUPS = [
  { title: '兑换与权益', subtitle: '连接已有积分商城、卡券与个人票夹。', items: [
    { title: '积分商城', to: '/points-mall', Icon: Gift, tag: '体验入口', detail: '查看现有礼品与服务兑换展示，先确认活动规则与实际履约条件。' },
    { title: '领券中心', to: '/coupons', Icon: Ticket, tag: '以活动为准', detail: '查看已有促销券、异业券与配送券，权益以页面实际规则为准。' },
    { title: '我的票夹', to: '/tickets', Icon: Ticket, tag: '个人权益', detail: '查看服务、卡券、活动票与场地凭证，集中管理使用状态。', protected: true },
  ] },
  { title: '赚取与积累', subtitle: '签到、体验与邀请，各自规则清晰区分。', items: [
    { title: '每日签到', to: '/assets?tab=assets', Icon: Coins, tag: '账户积分', detail: '在资产页完成签到，奖励以账户账本实际入账为准。', protected: true },
    { title: '种草小游戏', to: '/game', Icon: Sprout, tag: '游戏体验', detail: '回到现有人参合成游戏；本机体验进度不等于可提现资产。' },
    { title: '邀请与分享', to: '/crm?role=user&tab=referrals', Icon: UsersRound, tag: '查看规则', detail: '关联现有邀请码与邀请记录，奖励以审核规则和实际入账为准。', protected: true },
  ] },
  { title: '资产与账户管理', subtitle: '沿用现有账户功能，不另建一套积分余额。', items: [
    { title: '余额与流水', to: '/assets?tab=assets', Icon: Coins, tag: '账户记录', detail: '追踪积分获得、抵扣与调整记录，核对每一笔账户变动。', protected: true },
    { title: 'Web3 钱包', to: '/assets?tab=wallet', Icon: Wallet, tag: '身份绑定', detail: '进入现有钱包绑定页面；绑定钱包不代表资产已上链。', protected: true },
    { title: 'AI 支付策略', to: '/assets?tab=agent', Icon: Bot, tag: '现有设置', detail: '查看已有授权与限额设置，策略保存不等于已执行支付。', protected: true },
    { title: 'RWA 资产说明', to: '/assets?tab=rwa', Icon: ShieldCheck, tag: '合规待开放', detail: '了解资产架构与开放条件，暂不提供积分转链或现金兑换。', protected: true },
  ] },
];
export default function RewardsLinks({ user }) {
  return <div className="space-y-7">{GROUPS.map(group => <section key={group.title}>
    <h2 className="font-heading text-xl">{group.title}</h2><p className="mb-3 mt-2 text-sm leading-6 text-muted-foreground">{group.subtitle}</p>
    <div className="grid grid-cols-2 gap-3">{group.items.map(({ title, to, Icon, tag, detail, protected: needLogin }) => <Link key={title} to={needLogin && !user ? `/login?returnTo=${encodeURIComponent(to)}` : to} className="flex min-w-0 flex-col rounded-2xl border bg-card p-4 hover:bg-muted/50">
      <div className="flex items-center justify-between gap-2 text-primary"><Icon size={24} aria-hidden="true"/><ArrowUpRight size={16} aria-hidden="true"/></div>
      <span className="mt-4 text-base font-semibold">{title}</span><span className="mt-2 w-fit rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{tag}</span>
      <p className="mt-3 text-xs leading-6 text-muted-foreground">{detail}</p>
    </Link>)}</div>
  </section>)}</div>;
}