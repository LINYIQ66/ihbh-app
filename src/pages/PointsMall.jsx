import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/globest/me/PageShell';
import useMe from '@/hooks/useMe';
import { useExperience } from '@/components/globest/ExperienceProvider';

const GIFTS = /** @type {Array<[string, number, string]>} */ ([
  ['养生凉茶一杯', 50, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'],
  ['陈皮礼盒（小）', 300, 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400'],
  ['AI 体质测评一次', 100, 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400'],
  ['理疗体验 30 分钟', 800, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'],
]);

export default function PointsMall() {
  const { state, redeem: redeemGift } = useExperience(); const { data: user } = useMe(); const qc = useQueryClient();
  const redeem = async ([name, pts, _image]) => {
    if (!user) return base44.auth.redirectToLogin(window.location.href);
    if (!window.confirm(`使用 ${pts} HBH 兑换「${name}」？`)) return;
    if (!await redeemGift(['tea','chenpi','assessment','therapy'][GIFTS.findIndex(g=>g[0]===name)])) return;
    qc.invalidateQueries({ queryKey: ['tickets'] });
  };
  return <PageShell title="积分商城" sub={`当前 HBH 余额：${Number(state.hbh || 0).toLocaleString()}`}>
    <Link to="/game" className="block rounded-2xl bg-[#0F382C] p-4 text-center font-bold text-white">每日签到打卡赚积分 →</Link>
    <div className="grid grid-cols-2 gap-3">{GIFTS.map(g => <div key={g[0]} className="overflow-hidden rounded-2xl bg-card"><img src={g[2]} alt={g[0]} className="h-28 w-full object-cover"/><div className="p-3"><b className="text-sm">{g[0]}</b><p className="font-black text-[#B28A45]">{g[1]} HBH</p><button onClick={() => redeem(g)} disabled={state.hbh < g[1]} className="mt-2 w-full rounded-lg bg-[#0F382C] py-1.5 text-sm font-bold text-white disabled:opacity-40">{state.hbh < g[1] ? '积分不足' : '兑换'}</button></div></div>)}</div>
    <p className="text-center text-xs text-muted-foreground">兑换后凭证放入票夹，到店出示核销</p>
  </PageShell>;
}