import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/globest/me/PageShell';
import { useExperience } from '@/components/globest/ExperienceProvider';

const FAQ = [['HBH 积分怎么获得？', '每日签到、阅读文章、种草游戏、购物和邀请好友都可获得 HBH 积分。'], ['券码如何使用？', '在「票夹」中出示券码，由门店工作人员扫码或录入核销。'], ['已支付订单可以取消吗？', '实物未发货或服务未使用的订单可在「订单」中申请取消。'], ['如何成为经销合伙人？', '进入「经销合作」查看等级权益，提交申请后由主理人审核。']];
const card = 'scroll-mt-20 rounded-2xl bg-card p-4';

export default function Help() {
  const { notify } = useExperience(); const [f, setF] = useState({ topic: '功能建议', content: '', contact: '' }); const [busy, setBusy] = useState(false);
  const send = async e => { e.preventDefault(); if (!(await base44.auth.isAuthenticated())) return base44.auth.redirectToLogin(window.location.href); setBusy(true); await base44.entities.Feedback.create(f); setBusy(false); setF({ ...f, content: '' }); notify('感谢反馈，我们会尽快处理'); };
  return <PageShell title="帮助与设置" sub="常见问题 · 联系我们 · 协议 · 反馈">
    <section id="faq" className={card}><h2 className="mb-2 font-bold">常见问题</h2>{FAQ.map(([q, a]) => <details key={q} className="border-b py-2 text-sm"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-1 text-muted-foreground">{a}</p></details>)}</section>
    <section id="contact" className={card}><h2 className="mb-2 font-bold">联系我们</h2><p className="text-sm">Globest Mall · 九珍堂商城（新加坡）</p><p className="text-sm text-muted-foreground">在线客服：<Link to="/messages" className="underline">消息中心</Link></p></section>
    <section id="policy" className={card}><h2 className="mb-2 font-bold">协议政策</h2><p className="text-sm text-muted-foreground">用户协议、隐私政策与积分规则请见页面底部「法律条款」。积分不可兑现，仅限平台内使用。</p></section>
    <section id="feedback" className={card}><h2 className="mb-2 font-bold">问题反馈</h2><form onSubmit={send} className="grid gap-2">
      <select aria-label="反馈主题" value={f.topic} onChange={e => setF({ ...f, topic: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">{['功能建议', '订单问题', '账户问题', '其他'].map(x => <option key={x}>{x}</option>)}</select>
      <textarea aria-label="问题描述" required rows={4} placeholder="请描述您的问题" value={f.content} onChange={e => setF({ ...f, content: e.target.value })} className="rounded-lg border px-3 py-2 text-sm"/>
      <input aria-label="联系方式，选填" placeholder="联系方式（选填）" value={f.contact} onChange={e => setF({ ...f, contact: e.target.value })} className="rounded-lg border px-3 py-2 text-sm"/>
      <button disabled={busy} className="rounded-xl bg-[#0F382C] py-2 font-bold text-white disabled:opacity-60">{busy ? '提交中…' : '提交反馈'}</button></form></section>
    <section id="about" className={card}><h2 className="mb-2 font-bold">关于我们</h2><p className="text-sm text-muted-foreground">让人类更健康，生活更美好。<Link to="/jiuzhentang" className="underline">了解九珍堂</Link></p></section>
  </PageShell>;
}