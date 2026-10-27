import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChartNoAxesCombined, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import DealerPerformanceChart from '@/components/globest/dealer/DealerPerformanceChart';
import DealerPerformanceTotals from '@/components/globest/dealer/DealerPerformanceTotals';

export default function DealerPerformance({ user }) {
  const [days, setDays] = useState(30);
  const report = useQuery({ queryKey: ['dealer-performance', user.id, days], queryFn: async () => (await base44.functions.invoke('dealerOperations', { action: 'performance', days })).data, staleTime: 30000, refetchOnWindowFocus: false, retry: false });
  return <section aria-label="本人业绩看板" className="min-w-0 space-y-5 rounded-2xl border border-champagne/35 bg-card p-4 sm:p-6">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><span className="mb-2 inline-flex items-center gap-2 text-xs font-medium tracking-widest text-muted-foreground"><ChartNoAxesCombined size={16} className="text-primary" aria-hidden="true"/>经营 · 实绩</span><h2 className="text-xl font-semibold text-primary">我的业绩看板</h2><p className="mt-2 text-xs leading-relaxed text-muted-foreground">仅统计本人实收成交与实际入账收益，不随权益预览等级切换。</p></div><div className="flex flex-wrap items-center gap-2"><div role="group" aria-label="选择业绩统计期间" className="flex rounded-lg border border-border p-1">{[7, 30, 90].map(value => <button key={value} type="button" aria-pressed={days === value} onClick={() => setDays(value)} className={days === value ? 'min-h-9 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' : 'min-h-9 rounded-md px-3 text-xs text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'}>{value} 天</button>)}</div><button type="button" onClick={() => report.refetch()} disabled={report.isFetching} aria-label="刷新我的业绩" className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border text-primary focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"><RefreshCw size={16} className={report.isFetching ? 'animate-spin' : ''} aria-hidden="true"/></button></div></header>
    {report.isPending && <p role="status" className="py-16 text-center text-sm text-muted-foreground">正在汇总实际成交与分润…</p>}
    {report.isError && <p role="alert" className="py-5 text-sm text-destructive">业绩读取失败：{report.error.response?.data?.error || report.error.message}，可点击刷新重试。</p>}
    {report.isSuccess && <><DealerPerformanceTotals totals={report.data.totals}/><DealerPerformanceChart rows={report.data.rows}/>{report.data.totals.orders === 0 && report.data.totals.entries === 0 && <p role="status" className="text-center text-sm text-muted-foreground">所选期间暂无已完成订单或已入账分润，图表按实际记录显示为 0。</p>}<footer className="flex flex-wrap justify-between gap-2 text-xs leading-relaxed text-muted-foreground"><span>新加坡时间 · 订单完成自动累加 · 未完成与取消订单不计入</span><span>更新于 {new Date(report.data.generated_at).toLocaleTimeString('zh-CN', { timeZone: 'Asia/Singapore', hour12: false })}</span></footer></>}
  </section>;
}