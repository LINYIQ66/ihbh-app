import React from 'react';
import { Trash2 } from 'lucide-react';

export default function MemberAddressCard({ address, busy, onDefault, onDelete }) {
  return <li className="rounded-xl border border-border p-4">
    <div className="flex flex-wrap items-center gap-2 text-sm"><strong>{address.name}</strong><span>{address.phone}</span>{address.is_default && <span className="rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">默认地址</span>}</div>
    <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{address.line} {address.postal}</p>
    <div className="mt-2 flex flex-wrap items-center justify-end gap-3">
      {!address.is_default && <button type="button" disabled={busy} aria-label={`将${address.name}的地址设为默认`} onClick={() => onDefault(address)} className="min-h-11 rounded px-2 text-xs font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50">设为默认</button>}
      <button type="button" disabled={busy} aria-label={`删除${address.name}的地址`} onClick={() => onDelete(address)} className="inline-flex min-h-11 items-center gap-1 rounded px-2 text-xs text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"><Trash2 size={14} aria-hidden="true"/>删除</button>
    </div>
  </li>;
}