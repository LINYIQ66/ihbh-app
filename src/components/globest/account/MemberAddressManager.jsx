import React, { useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MemberAddressCard from '@/components/globest/account/MemberAddressCard';
import MemberAddressForm from '@/components/globest/account/MemberAddressForm';

const empty = { name: '', phone: '', line: '', postal: '' };
export default function MemberAddressManager({ user, showHeading = true }) {
  const qc = useQueryClient(); const [form, setForm] = useState(empty);
  const query = { created_by_id: user.id };
  const addresses = useInfiniteQuery({ queryKey: ['member-addresses', user.id], initialPageParam: null, queryFn: ({ pageParam }) => base44.entities.Address.filter(query, { sort: '-is_default', limit: 10, ...(pageParam ? { cursor: pageParam } : {}) }), getNextPageParam: page => page.has_more ? page.next_cursor : undefined });
  const count = useQuery({ queryKey: ['member-address-count', user.id], queryFn: () => base44.entities.Address.count(query) });
  const refresh = () => Promise.all([qc.invalidateQueries({ queryKey: ['member-addresses', user.id] }), qc.invalidateQueries({ queryKey: ['member-address-count', user.id] })]);
  const mutation = useMutation({ mutationFn: /** @param {{action:string,address?:{id:string},values?:Record<string,string>}} input */ async ({ action, address, values }) => {
    if (action === 'add') return base44.entities.Address.create({ ...values, is_default: count.data === 0 });
    if (action === 'delete') return base44.entities.Address.delete(address.id);
    await base44.entities.Address.updateMany({ ...query, is_default: true }, { $set: { is_default: false } });
    return base44.entities.Address.update(address.id, { is_default: true });
  }, onSuccess: async (_, variables) => { if (variables.action === 'add') setForm(empty); await refresh(); } });
  const items = addresses.data?.pages.flatMap(page => page.items) || [];
  const busy = mutation.isPending;
  return <section aria-label="收货地址管理" className="rounded-2xl border border-border bg-card p-4 sm:p-5">
    {showHeading && <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-primary"><MapPin size={19} aria-hidden="true"/>收货地址</h2>{count.isSuccess && <span className="text-xs text-muted-foreground">共 {count.data} 个地址</span>}</div>}
    {addresses.isPending && <p role="status" className="flex items-center gap-2 py-4 text-sm text-muted-foreground"><Loader2 size={16} className="animate-spin" aria-hidden="true"/>正在加载收货地址…</p>}
    {(addresses.isError || count.isError) && <div role="alert" className="mb-3 text-sm text-destructive">地址读取失败。<button type="button" onClick={refresh} className="ml-2 min-h-11 rounded px-2 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">重新加载</button></div>}
    {addresses.isSuccess && !items.length && <p role="status" className="rounded-xl bg-muted/50 p-5 text-center text-sm text-muted-foreground">尚未添加收货地址，可在下方保存多个地址。</p>}
    <ul className="space-y-3">{items.map(address => <MemberAddressCard key={address.id} address={address} busy={busy} onDefault={item => mutation.mutate({ action: 'default', address: item })} onDelete={item => mutation.mutate({ action: 'delete', address: item })}/>)}</ul>
    {addresses.hasNextPage && <button type="button" disabled={addresses.isFetchingNextPage || busy} onClick={() => addresses.fetchNextPage()} className="mt-4 min-h-11 w-full rounded-lg border border-border py-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50">{addresses.isFetchingNextPage ? '正在加载…' : '加载更多地址'}</button>}
    <MemberAddressForm value={form} onChange={(key, value) => setForm(current => ({ ...current, [key]: value }))} onSubmit={event => { event.preventDefault(); mutation.mutate({ action: 'add', values: form }); }} disabled={busy || !count.isSuccess || !addresses.isSuccess} saving={busy && mutation.variables?.action === 'add'}/>
    {mutation.isError && <p role="alert" className="mt-3 text-sm text-destructive">操作失败：{mutation.error.message || '请重试'}</p>}
  </section>;
}