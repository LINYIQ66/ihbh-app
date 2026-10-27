import React from 'react';
import { Image } from '@/components/ui/image';
export default function GlobalProductCard({ product: p, onSelect }) {
  const priced = Number.isFinite(p.price_usd) && p.price_usd > 0;
  return <button type="button" onClick={() => onSelect(p)} aria-label={`查看商品详情：${p.name_zh || p.name_en}`} className="flex h-auto min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-shadow hover:shadow-md">
    <Image src={p.image} alt={p.name_zh || p.name_en} loading="lazy" fittingType="fit" className="masonry-product-visual aspect-square w-full bg-muted"/>
    <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4"><span className="truncate text-xs text-muted-foreground">{p.brand || '品牌暂无'}</span>
      <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5">{p.name_zh || p.name_en}</h3>
      <span className="truncate text-xs text-muted-foreground">{p.category_zh || '其他分类'}</span>
      <p className="line-clamp-2 text-xs text-muted-foreground">{p.description_zh || '暂无商品介绍'}</p>
      <div className="mt-auto border-t pt-3"><b className="text-sm text-primary">{priced ? `参考 US$${p.price_usd.toFixed(2)}（美元）` : '参考价格暂无'}</b><span className="mt-2 block text-xs text-muted-foreground">查看详情与商家入口</span></div>
    </div>
  </button>;
}