import React from 'react';
import ResponsivePanel from '@/components/globest/ResponsivePanel';
import { Image } from '@/components/ui/image';
import merchantUrl from '@/components/globest/global/merchantUrl';
export default function GlobalProductDetail({ product: p, onClose }) {
  const url = merchantUrl(p?.amazon_url);
  return <ResponsivePanel open={!!p} onOpenChange={open => !open && onClose()} title={p?.name_zh || p?.name_en || '商品详情'} description="外部商家商品资讯，本站不收款、不承诺返利。">
    {p && <div className="customer-module space-y-4"><Image src={p.image} alt={p.name_zh || p.name_en} fittingType="fit" className="mx-auto aspect-square w-full max-w-sm rounded-xl bg-muted"/>
      <p>{p.brand || '品牌暂无'} · {p.category_zh || '其他分类'}</p><p className="whitespace-pre-wrap">{p.description_zh || '暂无商品介绍'}</p>
      <p className="font-semibold">{Number.isFinite(p.price_usd) && p.price_usd > 0 ? `参考价格 US$${p.price_usd.toFixed(2)}（美元 USD）` : '参考价格暂无'}</p>
      <dl className="grid grid-cols-2 gap-3 text-sm">{['核实评分', '销量', '库存', '送达时间'].map(label => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd>暂无已核实数据</dd></div>)}</dl>
      <p className="text-sm text-muted-foreground">商家可能调整售价、运费与服务条款，请在购买前核实。此导购不使用本站购物车或 HBH 积分。</p>
      {url ? <a className="primary-btn inline-flex" href={url} target="_blank" rel="noopener noreferrer">前往商家查看／购买（新窗口）</a> : <p>暂无可核实的商家链接，暂不能前往购买。</p>}
    </div>}
  </ResponsivePanel>;
}