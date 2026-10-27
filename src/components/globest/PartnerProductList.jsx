import React from 'react';
const labels={pending:'待审核',published:'已上线',rejected:'未通过'};
export default function PartnerProductList({ products }) {
  return <div className="bg-card border rounded-2xl p-6"><h2 className="font-heading text-xl mb-4">我的商品</h2>{products.length?<div className="space-y-3">{products.map(p=><div key={p.id} className="flex items-center justify-between gap-4 border-b pb-3"><div><b>{p.name_zh}</b><p className="text-sm text-muted-foreground">{p.name_en} · S${Number(p.price).toFixed(2)}</p>{p.approval_status==='rejected'&&p.review_note&&<p className="text-xs text-destructive">原因：{p.review_note}</p>}</div><span className="point-pill">{labels[p.approval_status]||p.approval_status}</span></div>)}</div>:<p className="text-sm text-muted-foreground">尚未提交商品。</p>}</div>;
}