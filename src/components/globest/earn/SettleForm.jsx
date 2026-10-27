import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const TYPES = [['direct', '直销收益'], ['referral', '推荐收益'], ['downline', '下级分润'], ['service', '服务权益'], ['settlement', '结算']];

export default function SettleForm({ notify }) {
  const { data: users = [] } = useQuery({ queryKey: ['all-users'], queryFn: () => base44.entities.User.list() });
  const [f, setF] = useState({ user_id: '', amount: '', type: 'direct', period: new Date().toISOString().slice(0, 7), note: '' });
  const submit = async e => {
    e.preventDefault(); const u = users.find(x => x.id === f.user_id);
    await base44.entities.Earning.create({ ...f, amount: Number(f.amount), user_name: u?.full_name || u?.email });
    setF({ ...f, amount: '', note: '' }); notify('收益已入账');
  };
  return <form onSubmit={submit} className="grid gap-2 rounded-2xl bg-card p-4 text-sm"><h2 className="font-bold">录入结算收益</h2>
    <select required value={f.user_id} onChange={e => setF({ ...f, user_id: e.target.value })} className="rounded border px-2 py-2"><option value="">选择合伙人</option>{users.map(u => <option key={u.id} value={u.id}>{u.full_name || u.email}</option>)}</select>
    <div className="flex gap-2"><select value={f.type} onChange={e => setF({ ...f, type: e.target.value })} className="rounded border px-2 py-2">{TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select><input type="month" value={f.period} onChange={e => setF({ ...f, period: e.target.value })} className="flex-1 rounded border px-2 py-2"/></div>
    <input required type="number" step="0.01" placeholder="金额 S$" value={f.amount} onChange={e => setF({ ...f, amount: e.target.value })} className="rounded border px-2 py-2"/>
    <input placeholder="备注（选填）" value={f.note} onChange={e => setF({ ...f, note: e.target.value })} className="rounded border px-2 py-2"/>
    <button className="rounded-xl bg-[#0F382C] py-2 font-bold text-white">入账</button></form>;
}