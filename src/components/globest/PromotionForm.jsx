import React, { useState } from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function PromotionForm({ products, initial, onSave, onCancel }) {
  const { t } = useExperience();
  const [title, setTitle] = useState(initial?.title || '');
  const [body, setBody] = useState(initial?.body || '');
  const [productId, setProductId] = useState(initial?.product_id || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const submit = async e => {
    e.preventDefault(); setError(''); setSaving(true);
    try { await onSave({ title: title.trim(), body: body.trim(), product_id: productId }); }
    catch (err) { setError(err.message || t('保存失败','Could not save')); }
    finally { setSaving(false); }
  };
  return <form onSubmit={submit} className="space-y-4 rounded-xl border bg-card p-5">
    <h3 className="font-heading text-xl">{initial?t('编辑推广文章','Edit promotion'):t('创建推广文章','Create a promotion')}</h3>
    <label className="block text-sm">{t('标题','Title')}<input required maxLength={120} value={title} onChange={e=>setTitle(e.target.value)} className="mt-2 w-full rounded-lg border bg-background p-3" /></label>
    <label className="block text-sm">{t('文章内容','Article')}<textarea required maxLength={5000} rows={6} value={body} onChange={e=>setBody(e.target.value)} className="mt-2 w-full rounded-lg border bg-background p-3" placeholder={t('分享您真实的体验，不要作出未经证实的健康承诺。','Share your genuine experience without unverified health claims.')} /></label>
    <label className="block text-sm">{t('关联商品','Linked product')}<select required value={productId} onChange={e=>setProductId(e.target.value)} className="mt-2 w-full rounded-lg border bg-background p-3"><option value="">{t('选择商品','Choose a product')}</option>{products.map(p=><option key={p.id} value={p.id}>{t(p.name_zh,p.name_en)} · SGD {Number(p.price).toFixed(2)}</option>)}</select></label>
    {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="flex gap-2"><button type="submit" disabled={saving||!products.length} className="primary-btn">{saving?t('保存中…','Saving…'):t('保存文章','Save article')}</button>{initial&&<button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2">{t('取消','Cancel')}</button>}</div>
  </form>;
}