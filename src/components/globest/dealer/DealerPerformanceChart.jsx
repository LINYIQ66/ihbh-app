import React from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function DealerPerformanceChart({ rows }) {
  const money = value => `S$${Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return <>
    <div className="min-w-0 rounded-2xl bg-primary p-4 text-primary-foreground sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-medium">每日成交与分润趋势</p><div className="flex flex-wrap gap-4 text-xs"><span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-primary-foreground/35"/>实际成交</span><span className="inline-flex items-center gap-2"><span className="h-0.5 w-4 bg-champagne"/>分润收益</span></div></div>
      <div className="h-72 w-full min-w-0 sm:h-80" role="img" aria-label="每日已完成订单实收金额柱状图与已入账分润收益折线图，金额单位为新加坡元">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} accessibilityLayer margin={{ top: 10, right: 8, left: 0, bottom: 5 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--primary-foreground) / 0.12)" strokeDasharray="3 5"/>
            <XAxis dataKey="date" tickFormatter={day => day.slice(5).replace('-', '/')} tick={{ fill: 'hsl(var(--primary-foreground) / 0.75)', fontSize: 11 }} minTickGap={24} tickMargin={10} axisLine={false} tickLine={false}/>
            <YAxis width={58} tick={{ fill: 'hsl(var(--primary-foreground) / 0.75)', fontSize: 11 }} tickFormatter={value => Math.abs(value) >= 1000 ? `${Number((value / 1000).toFixed(1))}k` : value} axisLine={false} tickLine={false}/>
            <Tooltip formatter={(value, name) => [money(value), name]} labelFormatter={day => `${day} · 新加坡时间`} contentStyle={{ background: 'hsl(var(--card))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} labelStyle={{ color: 'hsl(var(--foreground))' }} itemStyle={{ color: 'hsl(var(--foreground))' }} cursor={{ fill: 'hsl(var(--primary-foreground) / 0.06)' }}/>
            <Bar name="实际成交" dataKey="receipts" fill="hsl(var(--primary-foreground))" fillOpacity={0.35} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false}/>
            <Line name="分润收益" dataKey="earnings" type="linear" stroke="hsl(var(--storefront-gold))" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: 'hsl(var(--storefront-gold))', stroke: 'hsl(var(--primary))' }} isAnimationActive={false}/>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-primary-foreground/70">单位：S$ · 按订单完成日期累计；分润仅计已入账记录。</p>
    </div>
    <table className="sr-only"><caption>新加坡时间每日实际成交及分润收益明细</caption><thead><tr><th scope="col">日期</th><th scope="col">完成销售单</th><th scope="col">实际成交金额</th><th scope="col">分润收益</th></tr></thead><tbody>{rows.map(row => <tr key={row.date}><th scope="row">{row.date}</th><td>{row.orders}</td><td>{money(row.receipts)}</td><td>{money(row.earnings)}</td></tr>)}</tbody></table>
  </>;
}