import React, { useState } from 'react';
import { ChevronDown, Upload, Loader2, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import SignedImage from '@/components/globest/inbox/SignedImage';

export default function NoticeCard({ n, onContact }) {
  const { t } = useExperience(); const [open, setOpen] = useState(false); const [proofs, setProofs] = useState([]); const [busy, setBusy] = useState(false);
  const upload = async f => { if (!f) return; setBusy(true); const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file: f }); setProofs(p => [...p, file_uri]); setBusy(false); };
  return <div className="rounded-xl border border-border bg-card p-4">
    <div className="flex justify-between text-xs text-muted-foreground"><span>{new Date(n.time).toLocaleString()}</span>{n.order && <span>{t('订单', 'Order')} {n.order}</span>}</div>
    <b className="mt-1 block">{t(...n.title)}</b><p className="text-sm text-muted-foreground">{t(...n.body)}</p>
    {n.track && <button onClick={() => setOpen(!open)} className="mt-2 flex items-center gap-1 text-sm font-bold text-orange-500">{t('物流轨迹与订单详情', 'Tracking & order details')}<ChevronDown size={14} className={open ? 'rotate-180' : ''} /></button>}
    {open && <ol className="mt-3 space-y-2 border-l-2 border-orange-200 pl-4 text-sm">{n.track.map((s, i) => <li key={i} className={i === 0 ? 'font-bold text-orange-600' : 'text-muted-foreground'}>{t(...s)}</li>)}</ol>}
    {n.steps && <div className="mt-3"><div className="flex gap-1">{n.steps.map((s, i) => <div key={i} className="flex-1 text-center text-xs"><div className={`mb-1 h-1.5 rounded-full ${i <= n.step ? 'bg-emerald-500' : 'bg-muted'}`} />{t(...s)}</div>)}</div>
      <div className="mt-3 flex flex-wrap items-center gap-2">{proofs.map(u => <SignedImage key={u} uri={u} className="h-16 w-16 rounded-lg object-cover" />)}
        <label className="flex cursor-pointer items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold">{busy ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}{t('上传凭证照片', 'Upload proof')}<input type="file" accept="image/*" hidden onChange={e => upload(e.target.files[0])} /></label>
        <button onClick={onContact} className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white"><MessageCircle size={13} />{t('联系客服', 'Contact support')}</button></div></div>}
  </div>;
}