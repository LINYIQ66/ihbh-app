import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { command } from '@/api/commerce';

const REASONS = { recipient_not_found: '找不到该电邮的会员', insufficient: 'HBH 余额不足', self_transfer: '不能转给自己', invalid_amount: '请输入有效数量', duplicate: '该笔转账已处理' };

export default function TransferForm({ balance, onDone }) {
  const [email, setEmail] = useState(''), [amount, setAmount] = useState(''), [busy, setBusy] = useState(false), [msg, setMsg] = useState(null);
  const submit = async e => {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      const data = await command('pointsLedger', { action: 'transfer', email:email.trim().toLowerCase(), amount: Number(amount) });
      setMsg({ ok: true, text: `已转出 ${amount} HBH 给 ${data.transfer?.email || email}` }); setEmail(''); setAmount(''); onDone();
    } catch (err) { setMsg({ ok: false, text: err.response?.data?.error || REASONS[err.response?.data?.reason] || err.message }); }
    setBusy(false);
  };
  return <form onSubmit={submit} className="rounded-2xl bg-card p-4">
    <h3 className="flex items-center gap-2 font-bold"><Send size={16}/>转让积分</h3>
    <p className="mb-3 text-[11px] text-muted-foreground">输入对方注册会员的电邮。转出立即扣除，对方余额实时增加。可用：{balance.toLocaleString()} HBH</p>
    <input type="email" required placeholder="对方会员电邮" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm"/>
    <input type="number" required min="1" max={balance} placeholder="转让数量" value={amount} onChange={e => setAmount(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"/>
    <button disabled={busy} className="mt-3 w-full rounded-xl bg-[#0F382C] py-2.5 font-bold text-white disabled:opacity-60">{busy ? '处理中…' : '确认转让'}</button>
    {msg && <p className={`mt-2 text-xs ${msg.ok ? 'text-[#3d7a1f]' : 'text-red-600'}`}>{msg.text}</p>}
  </form>;
}