import { useEffect } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useDealerSummary(user) {
  const qc = useQueryClient();
  const query = useInfiniteQuery({ queryKey: ['dealer-overview', user.id], initialPageParam: 0, staleTime: 30000, refetchOnWindowFocus: false, retry: false, queryFn: async ({ pageParam }) => (await base44.functions.invoke('dealerOperations', { action: 'overview', offset: pageParam })).data, getNextPageParam: page => page.next_offset ?? undefined });
  useEffect(() => {
    let timer; let nextRefresh = 0;
    const update = () => {
      if (timer) return;
      timer = setTimeout(() => { timer = null; nextRefresh = Date.now() + 15000; ['dealer-overview', 'po', 'ship', 'dealer-ledger', 'dealer-performance', 'wd'].forEach(key => qc.invalidateQueries({ queryKey: [key, user.id] })); }, Math.max(500, nextRefresh - Date.now()));
    };
    const off = ['DealerAccount', 'PurchaseOrder', 'ShipOrder', 'Earning', 'Withdrawal'].map(name => base44.entities[name].subscribe(event => {
      const row = event.data;
      if (row && event.type !== 'delete') {
        if (['DealerAccount', 'Earning'].includes(name) && row.user_id && row.user_id !== user.id) return;
        if (['PurchaseOrder', 'Withdrawal'].includes(name) && (row.user_id ? row.user_id !== user.id : row.created_by_id && row.created_by_id !== user.id)) return;
        if (name === 'ShipOrder' && (row.dealer_user_id ? row.dealer_user_id !== user.id : (row.user_id ? row.user_id !== user.id : row.created_by_id && row.created_by_id !== user.id))) return;
        if (name === 'Earning' && row.posting_status === 'pending') return;
        const account = (/** @type {{pages?:Array<{account?:{tier:string,active:boolean}}>}} */ (qc.getQueryData(['dealer-overview', user.id])))?.pages?.[0]?.account;
        if (name === 'DealerAccount' && event.type === 'update' && account && row.tier === account.tier && row.active === account.active) return;
      }
      update();
    }));
    return () => { clearTimeout(timer); off.forEach(unsubscribe => unsubscribe()); };
  }, [user.id, qc]);
  return { ...query, summary: query.data?.pages[0], inventory: query.data?.pages.flatMap(page => page.inventory) || [] };
}