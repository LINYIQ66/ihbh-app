import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { localCategories } from '@/components/globest/local/localLifeData';

const empty = { name: '', category: 'food', area: '', avg_price: '', service_name: '', service_price: '', deal: '', phone: '', description: '', image: '' };

export default function ListingForm({ onSaved }) {
  const { t } = useExperience(); const [f, setF] = useState(empty); const [busy, setBusy] = useState(''); const [err, setErr] = useState('');
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const upload = async e => { const file = e.target.files?.[0]; if (!file) return; setBusy('img'); const { file_url } = await base44.integrations.Core.UploadFile({ file }); setF(s => ({ ...s, image: file_url })); setBusy(''); };
  const submit = async e => {
    e.preventDefault(); setBusy('save'); setErr('');
    try { await base44.entities.LocalListing.create({ ...f, avg_price: Number(f.avg_price) || 0, service_price: Number(f.service_price), approval_status: 'pending' }); setF(empty); onSaved(); }
    catch (x) { setErr(x.message); } setBusy('');
  };
  const inp = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm';
  return <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
    <input required className={inp} placeholder={t('商家名称 *', 'Business name *')} value={f.name} onChange={set('name')} />
    <select className={inp} value={f.category} onChange={set('category')}>{localCategories.map(([k, zh, en]) => <option key={k} value={k}>{t(zh, en)}</option>)}</select>
    <input required className={inp} placeholder={t('地区（如 Orchard）*', 'Area (e.g. Orchard) *')} value={f.area} onChange={set('area')} />
    <input type="number" min="0" className={inp} placeholder={t('人均消费 S$', 'Avg spend S$')} value={f.avg_price} onChange={set('avg_price')} />
    <input required className={inp} placeholder={t('主推服务/套餐 *', 'Main service / set *')} value={f.service_name} onChange={set('service_name')} />
    <input required type="number" min="0" step="0.01" className={inp} placeholder={t('价格 S$ *', 'Price S$ *')} value={f.service_price} onChange={set('service_price')} />
    <input className={inp} placeholder={t('优惠信息（如 首单9折）', 'Deal (e.g. 10% off first visit)')} value={f.deal} onChange={set('deal')} />
    <input className={inp} placeholder={t('联系电话 / WhatsApp', 'Phone / WhatsApp')} value={f.phone} onChange={set('phone')} />
    <textarea className={`${inp} sm:col-span-2`} rows={3} placeholder={t('商家介绍', 'Description')} value={f.description} onChange={set('description')} />
    <label className="text-sm sm:col-span-2">{t('封面图片', 'Cover image')} <input type="file" accept="image/*" onChange={upload} className="ml-2" />{busy === 'img' && t(' 上传中…', ' Uploading…')}{f.image && <img src={f.image} alt="" className="mt-2 h-24 rounded-lg object-cover" />}</label>
    {err && <p className="text-sm text-destructive sm:col-span-2">{err}</p>}
    <button disabled={!!busy} className="rounded-full bg-orange-500 py-2.5 font-bold text-white disabled:opacity-50 sm:col-span-2">{busy === 'save' ? t('提交中…', 'Submitting…') : t('提交审核', 'Submit for review')}</button>
  </form>;
}