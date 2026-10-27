import React, { useState } from 'react';
import { Handshake, Loader2, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import ResponsivePanel from '@/components/globest/ResponsivePanel';

/** @type {Array<[string,string,string,boolean?]>} */
const fields = [['business_name', '商家名称', 'Business name', true], ['contact_name', '联系人', 'Contact person', true], ['phone', '电话', 'Phone', true], ['email', '邮箱', 'Email'], ['industry', '所属行业', 'Industry', true], ['area', '所在区域', 'Area'], ['offer', '可提供的互推资源/会员权益', 'Cross-promotion resources / member perks']];
const perks = [['客源互导', 'Shared customers'], ['联合优惠', 'Joint deals'], ['HBH 积分通用', 'HBH points accepted']];

export default function AllianceJoin() {
  const { t } = useExperience();
  const [open, setOpen] = useState(false); const [form, setForm] = useState({}); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false); const [err, setErr] = useState('');
  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await base44.entities.AllianceApplication.create({ ...form, status: 'pending' }); setDone(true); setForm({}); }
    catch { setErr(t('提交失败，请稍后再试', 'Submission failed, please try again')); }
    setBusy(false);
  };
  return <section className="rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 p-5">
    <div className="flex items-center gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-500 text-white"><Handshake /></span><div className="min-w-0 flex-1"><h3 className="text-lg font-black">{t('异业联盟', 'Cross-Industry Alliance')}</h3><p className="text-sm text-muted-foreground">{t('不同行业商家抱团互推，共享客源与会员。', 'Businesses across industries share customers and members.')}</p></div></div>
    <div className="mt-3 flex flex-wrap gap-2">{perks.map(p => <span key={p[1]} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-orange-600">{t(...p)}</span>)}</div>
    <button onClick={() => { setOpen(true); setDone(false); }} className="mt-4 w-full rounded-full bg-orange-500 py-2.5 font-bold text-white">{t('申请加入', 'Apply to join')}</button>
    <ResponsivePanel open={open} onOpenChange={setOpen} title={t('申请加入异业联盟', 'Join the alliance')} description={t('提交后我们将在 3 个工作日内联系您。', 'We will contact you within 3 business days.')}>
      {done ? <div className="flex flex-col items-center gap-2 py-8 text-center"><CheckCircle2 className="text-green-600" size={40} /><b>{t('申请已提交', 'Application submitted')}</b><p className="text-sm text-muted-foreground">{t('请留意电话或邮件通知。', 'Watch for our call or email.')}</p></div>
        : <form onSubmit={submit} className="space-y-3 p-1">{fields.map(([k, zh, en, req]) => <label key={k} className="block text-sm font-semibold">{t(zh, en)}{req && ' *'}<input required={req} type={k === 'email' ? 'email' : 'text'} value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-normal" /></label>)}
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 py-2.5 font-bold text-white disabled:opacity-60">{busy && <Loader2 className="animate-spin" size={16} />}{t('提交申请', 'Submit')}</button></form>}
    </ResponsivePanel>
  </section>;
}