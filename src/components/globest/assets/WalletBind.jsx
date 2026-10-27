import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const b58 = bytes => { const A = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'; let n = 0n; for (const b of bytes) n = n * 256n + BigInt(b); let s = ''; while (n > 0n) { s = A[Number(n % 58n)] + s; n /= 58n; } for (const b of bytes) { if (b) break; s = '1' + s; } return s; };

export default function WalletBind({ userId }) {
  const [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const q = useQuery({ queryKey: ['wallet', userId], queryFn: async () => (await base44.entities.WalletLink.filter({ user_id: userId }, { limit: 5 })).items });
  const bind = async () => {
    setErr('');
    const p = window.phantom?.solana;
    if (!p?.isPhantom) { window.open('https://phantom.app/download', '_blank'); return; }
    setBusy(true);
    try {
      const { publicKey } = await p.connect();
      const message = `Bind wallet to iHBH account ${userId} ts:${Date.now()}`;
      const { signature } = await p.signMessage(new TextEncoder().encode(message), 'utf8');
      await base44.functions.invoke('bindWallet', { address: publicKey.toString(), message, signature: b58(signature) });
      q.refetch();
    } catch (e) { setErr(e.response?.data?.error || e.message); } finally { setBusy(false); }
  };
  const unbind = async id => { await base44.entities.WalletLink.delete(id); q.refetch(); };
  return <section className="rounded-2xl bg-card p-4">
    <h3 className="flex items-center gap-2 font-bold"><Wallet size={17}/>Solana 钱包</h3>
    {q.data?.map(w => <div key={w.id} className="mt-2 flex items-center justify-between rounded-lg bg-muted p-2.5 text-xs"><span className="font-mono">{w.address.slice(0, 6)}…{w.address.slice(-6)} <b className="text-[#3d7a1f]">✓ 已签名验证</b></span><button onClick={() => unbind(w.id)} className="text-red-600">解绑</button></div>)}
    <button onClick={bind} disabled={busy} className="mt-3 w-full rounded-xl bg-[#ab9ff2] py-2.5 font-bold text-white disabled:opacity-60">{busy ? '等待签名…' : window.phantom?.solana ? '连接 Phantom 并签名绑定' : '安装 Phantom 钱包'}</button>
    {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
    <p className="mt-2 text-[11px] text-muted-foreground">仅签名验证地址所有权，不发起转账、不读取私钥。预览窗口内可能无法唤起钱包，请在新标签页打开站点。</p>
  </section>;
}