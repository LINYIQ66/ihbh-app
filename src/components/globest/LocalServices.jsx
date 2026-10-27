import React, { useMemo, useState } from 'react';
import LocalServiceCard from '@/components/globest/local/LocalServiceCard';
import { expandedLocalServices } from '@/components/globest/local/expandedLocalServices';

import { localServiceGroups } from '@/components/globest/localServiceData';

const originalServices = localServiceGroups.flatMap(([category, , merchants]) => merchants.map(([name, , description, , url]) => ({ category, name, description, url })));
const directory = [...expandedLocalServices, ...originalServices];
export default function LocalServices({ search = '' }) {
  const [extraPages, setExtraPages] = useState({ search: '', count: 0 });
  const matches = useMemo(() => {
    const words = search.toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return directory.filter(service => words.every(word => `${service.name} ${service.category} ${service.description}`.toLocaleLowerCase().includes(word)));
  }, [search]);
  const visibleCount = 24 + (extraPages.search === search ? extraPages.count : 0);
  return <section aria-label="新加坡本地服务列表" className="space-y-4 pb-6">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">{matches.slice(0, visibleCount).map((service, index) => <LocalServiceCard key={service.url + service.name} service={service} priority={index < 2}/>)}</div>
    {!matches.length && <p role="status" className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">暂无匹配服务，请尝试商家名或“清洁、餐饮、宠物、健身”等关键词。</p>}
    {visibleCount < matches.length && <div className="text-center"><button type="button" onClick={() => setExtraPages({ search, count: (extraPages.search === search ? extraPages.count : 0) + 24 })} className="rounded-lg border border-primary bg-card px-6 py-3 text-sm font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary">查看更多服务</button></div>}
    <p role="status" aria-live="polite" className="text-xs text-muted-foreground">共 {matches.length} 家服务商 · 已展示 {Math.min(visibleCount, matches.length)} 家</p>
    <p className="text-xs leading-5 text-muted-foreground">价格单位：新币 SGD。服务价格与 iHBH 9折价为参考展示，服务详情及营业信息见商家官网。</p>
    <p className="text-xs leading-relaxed text-muted-foreground">证券、银行和保险资讯不构成投资或保险建议。</p>
  </section>;
}