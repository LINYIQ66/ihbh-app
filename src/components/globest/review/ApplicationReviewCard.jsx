import React from 'react';
import { base44 } from '@/api/base44Client';
import ReviewActions from '@/components/globest/review/ReviewActions';

const checks = ['UEN 已在 ACRA 核实且状态有效', '营业执照与企业名称一致', '联系人与联系方式已核实', '经营类目符合平台准入要求'];

export default function ApplicationReviewCard({ app: a, onReviewed }) {
  const openLicense = async () => { const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: a.license_file_uri }); window.open(signed_url, '_blank'); };
  const review = async (status, review_note) => {
    await Promise.all([
      base44.entities.AgentApplication.update(a.id, { status, review_note, reviewed_at: new Date().toISOString() }),
      base44.entities.User.update(a.applicant_user_id, { partner_status: status, business_name: a.business_name })
    ]); onReviewed();
  };
  return <div className="border-b py-4 text-sm">
    <b className="text-base">{a.business_name}</b>
    <p className="muted">{a.name} · {a.email} · {a.phone || '—'}</p>
    <p>UEN：{a.uen || '—'} · 类目：{a.business_type || '—'}</p>
    <p>地址：{a.business_address || '—'}</p>
    <p className="my-2">{a.business_description}</p>
    {a.license_file_uri ? <button className="underline" onClick={openLicense}>查看营业执照 ↗</button> : <p className="text-destructive">未上传营业执照</p>}
    <p className="muted">合规声明：{a.declaration ? '已确认' : '未确认'}</p>
    <ReviewActions checks={checks} approveLabel="批准入驻" onReview={review} />
  </div>;
}