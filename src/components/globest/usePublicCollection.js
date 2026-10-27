import { useRef } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function usePublicCollection(entity, query, sort, enabled = true) {
  const key = JSON.stringify([entity, query, sort]);
  const pending = useRef(null);
  const list = useInfiniteQuery({ queryKey: ['public-collection', entity, key], enabled, retry: false, initialPageParam: null,
    queryFn: ({ pageParam }) => base44.entities[entity].filter(query, { sort, limit: 12, ...(pageParam ? { cursor: pageParam } : {}) }),
    getNextPageParam: page => page.has_more ? page.next_cursor : undefined });
  const count = useQuery({ queryKey: ['public-count', entity, query], enabled, retry: false, queryFn: () => base44.entities[entity].count(query) });
  const loadMore = async () => {
    if (pending.current?.key === key || list.isFetching || !list.hasNextPage) return;
    const request = { key }; pending.current = request;
    try { await list.fetchNextPage({ cancelRefetch: false }); }
    finally { if (pending.current === request) pending.current = null; }
  };
  return { items: list.data?.pages.flatMap(page => page.items) || [], total: count.data, countError: count.isError,
    isPending: list.isPending, isError: list.isError, hasData: !!list.data, isFetching: list.isFetching || count.isFetching,
    moreError: list.isFetchNextPageError, hasNextPage: list.hasNextPage, loadingMore: list.isFetchingNextPage,
    loadMore, refetch: () => { list.refetch(); count.refetch(); } };
}