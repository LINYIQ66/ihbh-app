import React from 'react';
import { localMerchants } from '@/components/globest/local/localLifeData';
import LocalMerchantCard from '@/components/globest/local/LocalMerchantCard';
export default function LocalDemoDirectory({ onSelect }) {
  return <details className="rounded-xl border border-dashed p-4"><summary className="cursor-pointer font-semibold">查看演示商户（12家）</summary>
    <p className="my-4 text-sm text-muted-foreground">以下为界面示例，不是已核实商户。原有评分、评价量、距离、折扣及可约时段均未经验证，不予展示。</p>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{localMerchants.map(m => <LocalMerchantCard key={m.id} onSelect={onSelect} merchant={{ id: m.id, name: m.zh, area: m.area, image: m.image, service_name: m.services[0]?.[0], service_price: m.services[0]?.[2], is_demo: true, description: '仅供了解服务发现界面，不代表真实商家、营业状态或交易能力。' }}/>)}</div>
  </details>;
}