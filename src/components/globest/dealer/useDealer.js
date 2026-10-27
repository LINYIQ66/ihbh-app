import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import useDealerSummary from '@/components/globest/dealer/useDealerSummary';

export const FIRST_LINE = 1500;
export default function useDealer(user) {
  const qc = useQueryClient(); const overview = useDealerSummary(user);
  const po = useInfiniteQuery({ queryKey: ['po', user.id], initialPageParam: null, queryFn: ({ pageParam }) => base44.entities.PurchaseOrder.filter({ $or: [{ user_id: user.id }, { created_by_id: user.id }] }, { sort: '-created_date', limit: 20, ...(pageParam ? { cursor: pageParam } : {}) }), getNextPageParam: page => page.has_more ? page.next_cursor : undefined });
  const ship = useInfiniteQuery({ queryKey: ['ship', user.id], initialPageParam: null, queryFn: ({ pageParam }) => base44.entities.ShipOrder.filter({ $or: [{ dealer_user_id: user.id }, { $and: [{ $or: [{ user_id: user.id }, { created_by_id: user.id }] }, { $or: [{ dealer_user_id: { $exists: false } }, { dealer_user_id: null }, { dealer_user_id: '' }] }] }] }, { sort: '-created_date', limit: 20, ...(pageParam ? { cursor: pageParam } : {}) }), getNextPageParam: page => page.has_more ? page.next_cursor : undefined });
  const reload = () => Promise.all(['po', 'ship', 'dealer-overview', 'dealer-ledger', 'dealer-performance'].map(key => qc.invalidateQueries({ queryKey: [key, user.id] })));
  return { summary: overview.summary, inventory: overview.inventory, stock: Object.fromEntries(overview.inventory.map(item => [item.product_id, item])),
    orders: po.data?.pages.flatMap(page => page.items) || [], ships: ship.data?.pages.flatMap(page => page.items) || [], balance: overview.summary?.balance || 0, isFirst: overview.summary?.is_first ?? true,
    loading: overview.isPending || po.isPending || ship.isPending, refreshing: overview.isFetching, error: overview.error || po.error || ship.error, reload,
    hasMoreStock: overview.hasNextPage, moreStock: () => overview.fetchNextPage(), loadingMoreStock: overview.isFetchingNextPage,
    moreOrders: po.hasNextPage, loadOrders: () => po.fetchNextPage(), loadingMoreOrders: po.isFetchingNextPage,
    moreShips: ship.hasNextPage, loadShips: () => ship.fetchNextPage(), loadingMoreShips: ship.isFetchingNextPage };
}