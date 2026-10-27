import React, { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import FaceReadingResult from '@/components/globest/FaceReadingResult';

const shrink = file => new Promise((resolve, reject) => {
  const img = new window.Image();
  img.onload = () => {
    const s = Math.min(1, 1024 / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    c.toBlob(b => resolve(new File([b], 'face.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.85);
  };
  img.onerror = reject;
  img.src = URL.createObjectURL(file);
});

export default function FaceReading() {
  const { state, t } = useExperience();
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const pick = async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) { setError(t('照片不能超过 25MB','Photo must be under 25MB')); return; }
    setPreview(URL.createObjectURL(file)); setResult(null); setError(''); setLoading(true);
    try {
      const res = await base44.functions.invoke('analyzeFaceReading', {file:await shrink(file),lang:state.lang});
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || t('分析失败，请重试','Analysis failed, please retry'));
    } finally { setLoading(false); }
  };
  return <section className="mb-6 rounded-2xl border bg-card p-5">
    <h2 className="font-heading text-xl text-primary">{t('AI 中医面诊','AI TCM face reading')}</h2>
    <p className="mt-1 text-sm text-muted-foreground">{t('拍一张光线充足、素颜正面照，依据中医望诊理论分析体质并推荐合适补品。','Take a well-lit, bare-faced front photo for a TCM constitution reading and tonic suggestions.')}</p>
    <div className="mt-4 flex flex-wrap items-center gap-4">
      {preview && <img src={preview} alt={t('面部照片','Face photo')} className="h-28 w-28 rounded-xl object-cover" />}
      <label className="primary-btn cursor-pointer">{loading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}{loading ? t('正在望诊分析…','Analysing…') : t('拍照 / 上传面相','Take / upload photo')}<input type="file" accept="image/*" capture="user" className="hidden" disabled={loading} onChange={pick} /></label>
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    {result && <FaceReadingResult result={result} />}
  </section>;
}