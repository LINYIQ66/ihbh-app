import React from 'react';
import { Loader2, Plus } from 'lucide-react';

export default function MemberAddressForm({ value, onChange, onSubmit, disabled, saving }) {
  const fields = [['name', '收件人', 'text'], ['phone', '联系电话', 'tel'], ['line', '详细收货地址', 'text'], ['postal', '邮政编码（选填）', 'text']];
  return <form onSubmit={onSubmit} aria-label="新增收货地址" className="mt-5 rounded-xl bg-muted/50 p-4">
    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary"><Plus size={16} aria-hidden="true"/>新增收货地址</h3>
    <div className="grid gap-3 sm:grid-cols-2">{fields.map(([key, label, type]) => <label key={key} className={`flex min-w-0 flex-col gap-2 text-xs font-medium ${key === 'line' ? 'sm:col-span-2' : ''}`}>
      {label}<input type={type} required={key !== 'postal'} value={value[key]} onChange={event => onChange(key, event.target.value)} disabled={disabled} className="min-h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"/>
    </label>)}</div>
    <button type="submit" disabled={disabled} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50">{saving && <Loader2 size={16} className="animate-spin" aria-hidden="true"/>}{saving ? '正在保存…' : '保存新地址'}</button>
  </form>;
}