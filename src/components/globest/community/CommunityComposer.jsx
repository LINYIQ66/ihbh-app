import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function CommunityComposer({ products, onPublish, publishing }) {
  const { t } = useExperience();
  const [form, setForm] = useState({ author_name:'', content:'', topic:'wellness', ginseng_level:'', product_id:'' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const change = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const submit = async e => {
    e.preventDefault();
    const product = products.find(item => item.id === form.product_id);
    setBusy(true);setError('');
    try {await onPublish({ ...form, ginseng_level: form.topic === 'ginseng' && form.ginseng_level ? Number(form.ginseng_level) : undefined, product_name_zh: product?.name_zh, product_name_en: product?.name_en });setForm(current => ({ ...current, content:'', ginseng_level:'', product_id:'' }));}
    catch(err){setError(err.message||t('发布失败','Could not publish'));}
    finally{setBusy(false);}
  };
  return <form className="community-composer" onSubmit={submit}>
    <div className="community-composer-head"><div><span className="eyebrow">SHARE WITH THE COMMUNITY</span><h2>{t('分享此刻的养生心得', 'Share your wellness moment')}</h2></div><input required value={form.author_name} onChange={e=>change('author_name',e.target.value)} placeholder={t('你的昵称','Your name')} /></div>
    <textarea required maxLength={600} value={form.content} onChange={e=>change('content',e.target.value)} placeholder={t('记录今日养生心得，或分享人参养成的新进度…','Share a wellness insight or your latest ginseng progress…')} />
    <div className="community-composer-tools">
      <select value={form.topic} onChange={e=>change('topic',e.target.value)}><option value="wellness">{t('养生心得','Wellness insight')}</option><option value="ginseng">{t('人参养成','Ginseng progress')}</option></select>
      {form.topic === 'ginseng' && <select value={form.ginseng_level} onChange={e=>change('ginseng_level',e.target.value)}><option value="">{t('选择参苗等级','Choose ginseng level')}</option>{[1,2,3,4,5,6].map(level=><option value={level} key={level}>{t(`第 ${level} 阶段`,`Level ${level}`)}</option>)}</select>}
      <select value={form.product_id} onChange={e=>change('product_id',e.target.value)}><option value="">{t('关联商城商品（可选）','Link a product (optional)')}</option>{products.map(product=><option value={product.id} key={product.id}>{t(product.name_zh,product.name_en)}</option>)}</select>
      <button className="primary-btn" disabled={publishing||busy}><Send size={16}/>{publishing?t('发布中…','Publishing…'):t('发布动态','Publish')}</button>
    </div>{error&&<p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
  </form>;
}