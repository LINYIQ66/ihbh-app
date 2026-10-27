import React from 'react';
import { base44 } from '@/api/base44Client';
import ReviewActions from '@/components/globest/review/ReviewActions';

const checks = ['商品名称、图片与描述真实一致', '无医疗功效或疗效宣称', '成分/产地符合 HSA / SFA 规定', '价格与规格标示清晰', '商家入驻资格有效'];

export default function ProductReviewCard({ product: p, onReviewed }) {
  const review = async (status, review_note, compliance_checks) => {
    await base44.entities.Product.update(p.id, { approval_status: status === 'approved' ? 'published' : 'rejected', review_note, compliance_checks, reviewed_at: new Date().toISOString() });
    onReviewed();
  };
  return <div className="border-b py-4 text-sm">
    <div className="flex gap-3"><img src={p.image} alt="" className="h-20 w-20 rounded-lg object-cover" />
      <div><b className="text-base">{p.name_zh} / {p.name_en}</b><p className="muted">{p.partner_name} · {p.category} · S${Number(p.price).toFixed(2)} / {p.unit}</p></div></div>
    <p className="my-2">{p.description_zh}</p>
    <ReviewActions checks={checks} approveLabel="审核上线" onReview={review} />
  </div>;
}