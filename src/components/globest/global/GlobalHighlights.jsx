import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlobalProductCard from '@/components/globest/global/GlobalProductCard';
import GlobalProductDetail from '@/components/globest/global/GlobalProductDetail';
export default function GlobalHighlights() {
  const [selected, setSelected] = useState(null);
  const query = useQuery({ queryKey: ['global-highlights'], retry: false, queryFn: async () => (await base44.entities.GlobalProduct.filter({ image: { $exists: true } }, { sort: '-price_usd', limit: 10 })).items, staleTime: 300000 });
  return <section className="customer-module my-6"><div className="mb-3 flex items-end justify-between"><h2 className="text-xl font-bold">全球好物 · 精选资讯</h2><Link to="/discover?section=global" className="text-link">查看全部</Link></div>
    <p className="mb-3 text-xs text-muted-foreground">外部导购，美元参考价；本站不提供此类商品的返利、积分抵扣或支付。</p>
    {query.isPending ? <p role="status">正在加载…</p> : query.isError ? <div role="alert">商品加载失败。<button disabled={query.isFetching} onClick={() => query.refetch()}>重试</button></div> : !query.data?.length ? <p>暂无商品</p> : <div className="grid grid-cols-2 gap-3 md:grid-cols-5">{query.data.map(p => <GlobalProductCard key={p.id} product={p} onSelect={setSelected}/>)}</div>}
    <GlobalProductDetail product={selected} onClose={() => setSelected(null)}/>
  </section>;
}