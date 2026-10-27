import React, { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { stages, services, scores, tips } from '@/components/globest/photos/photoData';

const empty = { stage: 'before', service: 'oxygen', session_no: '', note: '', share_consent: false, energy_score: 5, sleep_score: 5, skin_score: 5 };

export default function PhotoUploadForm({ onSaved }) {
  const { t } = useExperience();
  const [f, setF] = useState(empty), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const upload = async e => {
    const file = e.target.files?.[0]; if (!file) return; setBusy(true); setError('');
    try { const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file }); await base44.entities.CustomerPhoto.create({ ...f, file_uri, session_no: f.session_no ? Number(f.session_no) : undefined, taken_at: new Date().toISOString().slice(0, 10) }); setF(s => ({ ...empty, service: s.service })); onSaved(); }
    catch (err) { setError(err.message || t('上传失败，请重试', 'Upload failed, please retry')); }
    finally { setBusy(false); e.target.value = ''; }
  };
  const chip = (on) => `rounded-full px-3 py-1.5 text-xs font-semibold ${on ? 'bg-primary text-primary-foreground' : 'bg-muted'}`;
  return <div className="space-y-3 rounded-xl bg-muted/50 p-3">
    <div className="flex flex-wrap gap-2">{services.map(([k, zh, en]) => <button key={k} onClick={() => set('service', k)} className={chip(f.service === k)}>{t(zh, en)}</button>)}</div>
    <div className="flex flex-wrap gap-2">{stages.map(([k, zh, en]) => <button key={k} onClick={() => set('stage', k)} className={chip(f.stage === k)}>{t(zh, en)}</button>)}</div>
    <p className="text-xs text-muted-foreground">📸 {t(...tips[f.stage])}</p>
    <div className="grid grid-cols-3 gap-2">{scores.map(([k, zh, en]) => <label key={k} className="text-xs">{t(zh, en)} <b>{f[k]}</b>/10<input type="range" min="1" max="10" value={f[k]} onChange={e => set(k, Number(e.target.value))} className="w-full"/></label>)}</div>
    <div className="flex gap-2"><input type="number" min="1" value={f.session_no} onChange={e => set('session_no', e.target.value)} placeholder={t('第几次', 'Session #')} className="w-24 rounded-lg border px-3 py-2 text-sm"/><input value={f.note} onChange={e => set('note', e.target.value)} maxLength={200} placeholder={t('感受备注', 'How do you feel?')} className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"/></div>
    <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={f.share_consent} onChange={e => set('share_consent', e.target.checked)}/>{t('同意匿名用作真实用户案例展示', 'Allow anonymous use as a real customer case')}</label>
    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-card p-4 text-sm font-semibold">{busy ? <Loader2 className="animate-spin" size={18}/> : <Camera size={18}/>}{t('拍照 / 上传照片', 'Take or upload photo')}<input type="file" accept="image/*" capture="user" hidden onChange={upload} disabled={busy}/></label>
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>;
}