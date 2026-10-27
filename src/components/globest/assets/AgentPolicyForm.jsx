import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bot } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const DEF = { enabled: false, per_tx_limit: 50, daily_limit: 200, approval_above: 30, use_points: true, compare_prices: true };

export default function AgentPolicyForm({ userId }) {
  const q = useQuery({ queryKey: ['agent-policy', userId], queryFn: async () => (await base44.entities.AgentPolicy.filter({ user_id: userId }, { limit: 1 })).items[0] || null });
  const [f, setF] = useState(DEF), [saved, setSaved] = useState(false), [busy, setBusy] = useState(false);
  useEffect(() => { if (q.data) setF({ ...DEF, ...q.data }); }, [q.data]);
  const set = (k, v) => { setSaved(false); setF(s => ({ ...s, [k]: v })); };
  const save = async () => {
    setBusy(true);
    const data = { user_id: userId, enabled: f.enabled, per_tx_limit: +f.per_tx_limit, daily_limit: +f.daily_limit, approval_above: +f.approval_above, use_points: f.use_points, compare_prices: f.compare_prices };
    if (q.data) await base44.entities.AgentPolicy.update(q.data.id, data); else await base44.entities.AgentPolicy.create(data);
    await q.refetch(); setBusy(false); setSaved(true);
  };
  const num = (k, l) => <label className="text-xs">{l}<input type="number" min="0" value={f[k]} onChange={e => set(k, e.target.value)} className="mt-1 w-full rounded-lg border px-2 py-1.5 text-sm"/></label>;
  const chk = (k, l) => <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f[k]} onChange={e => set(k, e.target.checked)}/>{l}</label>;
  return <section className="rounded-2xl bg-card p-4">
    <h3 className="flex items-center gap-2 font-bold"><Bot size={17}/>AI Agent 支付授权</h3>
    <p className="mb-3 text-[11px] text-muted-foreground">设定 AI 代您采购的规则。超出审批额度的订单必须由您手动确认。</p>
    <div className="space-y-2">{chk('enabled', '授权 AI Agent 代我下单')}{chk('compare_prices', '下单前自动比价')}{chk('use_points', '优先使用 HBH 积分抵扣')}</div>
    <div className="mt-3 grid grid-cols-3 gap-2">{num('per_tx_limit', '单笔上限 S$')}{num('daily_limit', '每日上限 S$')}{num('approval_above', '超过需审批 S$')}</div>
    <button onClick={save} disabled={busy} className="mt-3 w-full rounded-xl bg-[#0F382C] py-2.5 font-bold text-white disabled:opacity-60">{busy ? '保存中…' : saved ? '✓ 已保存' : '保存授权规则'}</button>
  </section>;
}