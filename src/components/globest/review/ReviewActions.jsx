import React, { useState } from 'react';

// Approve is only enabled once every compliance check is ticked; reject requires a reason.
export default function ReviewActions({ checks, approveLabel, onReview }) {
  const [done, setDone] = useState([]); const [note, setNote] = useState(''); const [busy, setBusy] = useState(false);
  const toggle = c => setDone(d => d.includes(c) ? d.filter(x => x !== c) : [...d, c]);
  const run = async (status) => { setBusy(true); await onReview(status, note, done); setBusy(false); };
  return <div className="mt-3 space-y-2 rounded-lg bg-muted p-3">
    <b className="text-xs">合规核查清单</b>
    {checks.map(c => <label key={c} className="flex gap-2 text-sm"><input type="checkbox" checked={done.includes(c)} onChange={() => toggle(c)} />{c}</label>)}
    <textarea className="w-full rounded-lg border p-2 text-sm" placeholder="审核备注（拒绝时必填，将展示给商家）" value={note} onChange={e => setNote(e.target.value)} />
    <div className="flex gap-2">
      <button className="primary-btn" disabled={busy || done.length < checks.length} onClick={() => run('approved')}>{approveLabel}</button>
      <button className="secondary-btn" disabled={busy || !note.trim()} onClick={() => run('rejected')}>拒绝</button>
    </div>
  </div>;
}