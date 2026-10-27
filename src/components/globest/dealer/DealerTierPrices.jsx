import React from 'react';
import { BadgePercent } from 'lucide-react';
import { genecells } from '@/components/globest/agency/agencyData';
import { dealerDiscount, getDealerTier } from '@/components/globest/dealer/dealerTierData';

export default function DealerTierPrices({ level }) {
  const tier = getDealerTier(level);
  return <section aria-labelledby="dealer-prices-title" className="overflow-hidden rounded-2xl border border-border bg-card">
    <div className="flex items-start gap-3 p-5 sm:p-7"><BadgePercent size={20} className="mt-1 shrink-0 text-primary" aria-hidden="true"/><div><h2 id="dealer-prices-title" className="font-heading text-xl font-semibold">{tier.zh}专属折扣与拿货价</h2><p className="mt-1 text-sm text-muted-foreground">沿用现有经销制度价格，金额均为新币 SGD。</p></div></div>
    <div className="overflow-x-auto" tabIndex={0} aria-label={`${tier.zh}产品价格表，可横向滚动`}><table className="w-full min-w-[620px] text-left text-sm"><caption className="sr-only">{tier.zh} GeneCells 产品用户价、拿货价、折扣与毛差额</caption><thead className="bg-primary/5 text-primary"><tr><th scope="col" className="px-5 py-3 font-semibold">商品 / 规格</th><th scope="col" className="px-4 py-3 font-semibold">用户参考价</th><th scope="col" className="px-4 py-3 font-semibold">专属拿货价</th><th scope="col" className="px-4 py-3 font-semibold">相对用户价</th><th scope="col" className="px-4 py-3 font-semibold">用户价差（毛额）</th></tr></thead><tbody>{genecells.map(product => <tr key={product.zh} className="border-t border-border"><th scope="row" className="px-5 py-4 font-medium">{product.zh}<span className="mt-1 block text-xs font-normal text-muted-foreground">{product.spec[0]}</span></th><td className="px-4 py-4 text-muted-foreground">S${product.user.toLocaleString('en-SG')}</td><td className="px-4 py-4 font-semibold text-primary">S${product[level].toLocaleString('en-SG')}</td><td className="px-4 py-4">约 {dealerDiscount(product[level], product.user)} 折</td><td className="px-4 py-4">S${(product.user - product[level]).toLocaleString('en-SG')}</td></tr>)}</tbody></table></div>
    <p className="border-t border-border px-5 py-4 text-xs leading-6 text-muted-foreground">折扣 = 本级拿货价 ÷ 用户参考价 × 10，按各商品分别计算，非对所有商品统一打折。价差为未扣除成本的毛额，不代表实际成交价格或保证收益；具体交易条件以正式确认的价格及协议为准。</p>
  </section>;
}