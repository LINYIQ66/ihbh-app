import React from 'react';
import { Link } from 'react-router-dom';
import useMe from '@/hooks/useMe';
import RewardsSummary from '@/components/globest/rewards/RewardsSummary';
import RewardsLinks from '@/components/globest/rewards/RewardsLinks';

const QUESTIONS = [
  ['账户积分与体验积分有什么区别？', '账户积分以已登录账户的积分账本为准。浏览器内的体验余额、游戏进度与示例权益不应当视为现金或真实资产，本页不会将两者相加。'],
  ['如何找到兑换后的权益？', '现有兑换与领券入口保留各自规则。实际生成的服务、卡券或活动凭证可在“我的票夹”中查看，能否使用以活动、门店确认及核销状态为准。'],
  ['可以兑换现金或链上资产吗？', '当前不提供现金兑换或积分转换为 RWA Token。钱包绑定、AI 策略和 RWA 说明沿用现有页面，不代表已开放链上发行、自动支付或投资收益。'],
];
export default function Rewards() {
  const me = useMe();
  return <div className="customer-module page-inner mx-auto max-w-3xl space-y-7">
    <header><span className="text-xs font-semibold tracking-wider text-rewards">iHBH · 会员权益</span><h1 className="mt-3 font-heading text-3xl">兑换 · 积分资产</h1><p className="mt-3 text-sm leading-7 text-muted-foreground">把赚积分、兑换权益、查看票夹与管理资产，连接到同一个入口。</p></header>
    <RewardsSummary me={me}/>
    <RewardsLinks user={me.data}/>
    <section className="rounded-2xl border bg-card p-5"><h2 className="font-heading text-xl">积分与权益说明</h2><div className="mt-3 divide-y">{QUESTIONS.map(([question, answer]) => <details key={question} className="py-2"><summary className="flex min-h-11 cursor-pointer items-center py-2 text-sm font-semibold">{question}</summary><p className="pb-3 text-sm leading-7 text-muted-foreground">{answer}</p></details>)}</div><Link to="/help#contact" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4">权益问题与客服联系</Link></section>
  </div>;
}