import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const LABEL = { checkin: '每日签到', purchase: '购物奖励', referral: '推荐奖励', merchant: '商户互通', redeem: '积分抵扣', adjust: '人工调整', interaction: '互动奖励', game: '种草游戏', transfer_in: '转入', transfer_out: '转出' };

export default function LedgerList({ userId, version }) {
  const q = useInfiniteQuery({ initialPageParam: /** @type {string | undefined} */ (undefined),
    queryKey: ['ledger', userId, version],
    queryFn: ({ pageParam }) => base44.entities.PointsLedger.filter({ user_id: userId, transaction_status: { $ne: 'prepared' } }, { sort: '-created_date', limit: 20, cursor: pageParam }),
    getNextPageParam: p => p.has_more ? p.next_cursor : undefined,
  });
  const rows = q.data?.pages.flatMap(p => p.items) || [];
  return <section className="rounded-2xl bg-card p-4">
    <h3 className="mb-2 font-bold">交易流水</h3>
    {q.isLoading ? <p className="text-sm text-muted-foreground">加载中…</p> : !rows.length ? <p className="text-sm text-muted-foreground">暂无记录，先签到获取第一笔积分。</p> :
      rows.map(r => <div key={r.id} className="flex items-center justify-between border-t py-2.5 text-sm"><div><b>{LABEL[r.type]}</b><p className="text-[11px] text-muted-foreground">{new Date(r.created_date).toLocaleString()} · #{r.id.slice(-6)}</p></div><b className={r.amount > 0 ? 'text-[#3d7a1f]' : 'text-red-600'}>{r.amount > 0 ? '+' : ''}{r.amount}</b></div>)}
    {q.hasNextPage && <button onClick={() => q.fetchNextPage()} className="mt-2 w-full rounded-lg border py-2 text-sm">加载更多</button>}
  </section>;
}