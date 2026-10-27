import React from 'react';
import { Link } from 'react-router-dom';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function FaceReadingResult({ result }) {
  const { t } = useExperience();
  if (!result.face_detected) return <p className="mt-4 rounded-lg bg-muted p-3 text-sm">{result.note || t('未识别到清晰人脸，请正面重拍。','No clear face detected, please retake.')}</p>;
  return <div className="mt-5 space-y-4 text-sm">
    <div className="rounded-xl bg-primary p-4 text-primary-foreground"><span className="text-xs opacity-80">{t('参考体质','Likely constitution')}</span><b className="block font-heading text-2xl">{result.constitution}</b><p className="mt-1 opacity-90">{result.constitution_reason}</p></div>
    <div className="grid gap-2 sm:grid-cols-2">{(result.observations || []).map((o, i) => <div key={i} className="rounded-lg border p-3"><b className="text-primary">{o.area}</b><p className="mt-1">{o.finding}</p><p className="mt-1 text-muted-foreground">{o.tcm_meaning}</p></div>)}</div>
    <div><h3 className="mb-2 font-semibold">{t('调养建议','Care advice')}</h3><ul className="list-disc space-y-1 pl-5">{(result.advice || []).map((a, i) => <li key={i}>{a}</li>)}</ul></div>
    {!!result.products?.length && <div><h3 className="mb-2 font-semibold">{t('推荐补品','Suggested tonics')}</h3><div className="grid gap-2 sm:grid-cols-3">{result.products.map(p => <Link key={p.id} to={`/?q=${encodeURIComponent(p.name_en)}#catalog`} className="flex gap-3 rounded-lg border p-2 hover:bg-muted"><img src={p.image} alt={t(p.name_zh, p.name_en)} className="h-14 w-14 rounded object-cover" /><div><b className="line-clamp-1">{t(p.name_zh, p.name_en)}</b><span className="block text-xs text-primary">SGD {p.price}</span><span className="line-clamp-2 text-xs text-muted-foreground">{p.reason}</span></div></Link>)}</div></div>}
    <p className="text-xs text-muted-foreground">{result.note || t('仅为中医体质参考，不构成医疗诊断。','TCM constitution reference only, not a medical diagnosis.')}</p>
  </div>;
}