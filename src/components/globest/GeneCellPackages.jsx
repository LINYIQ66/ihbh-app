import { command } from '@/api/commerce';
const checkoutCommand=async(name,payload)=>({data:await command(name,payload)});
import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { tiers } from '@/components/globest/genecells/genecellsData';

export default function GeneCellPackages() {
  const { t } = useExperience();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');
  const checkout = async tier => {
    setBusy(tier); setError('');
    const signedIn = await base44.auth.isAuthenticated();
    if (!signedIn) { base44.auth.redirectToLogin(window.location.pathname + window.location.search); return; }
    const isFramed = window.self !== window.top;
    const tab = isFramed ? window.open('', '_blank') : null;
    if (isFramed && !tab) { setError(t('请允许弹出窗口以继续付款。', 'Allow popups to continue to checkout.')); setBusy(null); return; }
    if (tab) tab.opener = null;
    try {
      const { data } = await checkoutCommand('createGeneCellCheckout', { packageTier: tier });
      if (tab) { tab.location.replace(data.url); setBusy(null); } else window.location.assign(data.url);
    } catch (err) { tab?.close(); setError(err.response?.data?.error || err.message || t('无法开始购买', 'Could not start checkout')); setBusy(null); }
  };
  return <section className="rounded-2xl border bg-card p-5">
    <h2 className="font-heading text-xl font-semibold text-primary">{t('购买 Genecells', 'Buy Genecells')}</h2>
    <p className="mt-1 text-sm text-muted-foreground">{t('选择 SGD 1,500 或 SGD 5,000 Genecells 礼包，即可享受对应会员福利。', 'Choose the SGD 1,500 or SGD 5,000 Genecells package to enjoy the matching member benefits.')}</p>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">{tiers.map(p => <div key={p.tier} className={`rounded-xl border p-5 ${p.tier === 'vip' ? 'border-[#B28A45] bg-[#FBF6EC]' : ''}`}>
      <span className="text-xs tracking-widest text-[#B28A45]">{t(p.zh, p.en)}</span>
      <strong className="mt-2 block font-heading text-2xl">{t('Genecells 礼包', 'Genecells Package')}</strong>
      <p className="text-sm font-semibold text-[#B28A45]">SGD {p.coins.toLocaleString()}</p>
      <ul className="mt-4 space-y-2 text-sm">{p.perks.map(([zh, en]) => <li key={en} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary" />{t(zh, en)}</li>)}</ul>
      <button type="button" className="primary-btn mt-5" disabled={!!busy} onClick={() => checkout(p.tier)}>{busy === p.tier ? <><Loader2 size={16} className="animate-spin" />{t('正在跳转…', 'Opening checkout…')}</> : t(`购买 SGD ${p.coins.toLocaleString()} 礼包`, `Buy SGD ${p.coins.toLocaleString()} Package`)}</button>
    </div>)}</div>
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
  </section>;
}