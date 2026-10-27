import { command } from '@/api/commerce';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const MIN_WITHDRAW = 50;

export default function WithdrawForm({ user, cards, available, onDone, notify }) {
  const [amount, setAmount] = useState(''); const [bank, setBank] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  if (!cards.length) return <p className="rounded-2xl bg-card p-4 text-sm">提现前请先 <Link to="/bank-cards" className="underline">添加银行卡</Link></p>;
  const submit = async e => {
    e.preventDefault(); const n = Number(amount);
    if (n < MIN_WITHDRAW) return notify(`最低提现 S$${MIN_WITHDRAW}`);
    if (n > available) return notify('超出可提现余额');
    setBusy(true); setError('');
    try { await command('commerce',{action:'withdraw',amount:n,bank_id:bank || cards[0].id}); setAmount(''); await onDone(); notify('提现申请已提交，等待审核'); }
    catch (e) { setError(e.response?.data?.error || e.message); }
    finally { setBusy(false); }
  };
  return <form onSubmit={submit} className="grid gap-2 rounded-2xl bg-card p-4 text-sm"><h2 className="font-bold">申请提现（最低 S${MIN_WITHDRAW}）</h2>
    <select value={bank} onChange={e => setBank(e.target.value)} className="rounded border px-2 py-2">{cards.map(c => <option key={c.id} value={c.id}>{c.bank} ****{c.last4}</option>)}</select>
    <input required type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`可提现 S$${available.toFixed(2)}`} className="rounded border px-2 py-2"/>
    <button disabled={busy} className="rounded-xl bg-[#0F382C] py-2 font-bold text-white disabled:opacity-50">{busy ? '提交中…' : '提交申请'}</button>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <p className="text-xs text-muted-foreground">审核通过后由财务线下打款</p></form>;
}