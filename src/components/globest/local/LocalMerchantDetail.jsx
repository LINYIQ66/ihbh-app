import React from 'react';
import ResponsivePanel from '@/components/globest/ResponsivePanel';
export default function LocalMerchantDetail({ merchant: m, onClose }) {
  return <ResponsivePanel open={!!m} onOpenChange={open => !open && onClose()} title={m?.name || '商户详情'} description={m?.is_demo ? '商户服务示例资料' : '商户服务资讯'}>
    {m && <div className="customer-module space-y-4"><p className="whitespace-pre-wrap">{m.description || '暂无详细介绍'}</p>
      <dl className="space-y-3 text-sm">{m.service_name && <div><dt>服务</dt><dd>{m.service_name}</dd></div>}{Number.isFinite(m.service_price) && <div><dt>服务参考价</dt><dd>新币 SGD {m.service_price.toFixed(2)}</dd></div>}
        {m.area && <div><dt>所在区域</dt><dd>{m.area}</dd></div>}</dl>
      <p className="text-xs text-muted-foreground">本页提供服务资讯浏览，不提供在线交易。</p>
    </div>}
  </ResponsivePanel>;
}