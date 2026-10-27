import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';

const types = [['wellness', '健康滋补'], ['food', '餐饮食品'], ['beauty', '美容美发'], ['local_service', '本地生活服务'], ['other', '其他']];
const field = 'mt-2 w-full rounded-lg border p-3';

export default function PartnerApplicationForm({ user, onSubmitted }) {
  const [form, setForm] = useState({ name: user.full_name || '', phone: '', business_name: '', uen: '', business_type: 'wellness', business_address: '', business_description: '', declaration: false });
  const [file, setFile] = useState(null); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const set = k => e => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const submit = async e => {
    e.preventDefault(); if (!file) return setError('请上传营业执照或 ACRA 商业注册文件'); if (!form.declaration) return setError('请勾选合规声明');
    setSaving(true); setError('');
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      await base44.entities.AgentApplication.create({ ...form, license_file_uri: file_uri, email: user.email, applicant_user_id: user.id, status: 'pending' });
      await base44.auth.updateMe({ business_name: form.business_name }); onSubmitted();
    } catch (err) { setError(err.message || '申请提交失败'); } finally { setSaving(false); }
  };
  return <form onSubmit={submit} className="bg-card border rounded-2xl p-6 space-y-4">
    <h2 className="font-heading text-2xl">商家入驻申请</h2>
    <p className="text-sm text-muted-foreground">提交企业资料后由平台合规团队审核（1–3 个工作日），通过后方可提交商品；每件商品上架前仍需单独审核。</p>
    {error && <p className="text-sm text-destructive">{error}</p>}
    <div className="grid sm:grid-cols-2 gap-4">
      <label className="text-sm font-medium">联系人姓名<input className={field} value={form.name} onChange={set('name')} required /></label>
      <label className="text-sm font-medium">联系电话<input className={field} value={form.phone} onChange={set('phone')} required /></label>
      <label className="text-sm font-medium">企业／品牌名称<input className={field} value={form.business_name} onChange={set('business_name')} required /></label>
      <label className="text-sm font-medium">UEN 注册号<input className={field} value={form.uen} onChange={set('uen')} required /></label>
      <label className="text-sm font-medium">经营类目<select className={field} value={form.business_type} onChange={set('business_type')}>{types.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
      <label className="text-sm font-medium">经营地址<input className={field} value={form.business_address} onChange={set('business_address')} required /></label>
    </div>
    <label className="block text-sm font-medium">业务简介<textarea className={`${field} min-h-28`} value={form.business_description} onChange={set('business_description')} required /></label>
    <label className="block text-sm font-medium">营业执照 / ACRA 文件（PDF 或图片）<input type="file" accept=".pdf,image/*" className={field} onChange={e => setFile(e.target.files[0])} /></label>
    <label className="flex gap-2 text-sm"><input type="checkbox" checked={form.declaration} onChange={set('declaration')} />本人确认所提交资料真实有效，所售商品符合新加坡 HSA / SFA 等法规，且不作任何医疗功效宣称。</label>
    <button className="primary-btn" disabled={saving}>{saving ? '正在提交…' : '提交审核'}</button>
  </form>;
}