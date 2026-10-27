import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { wellnessCategories } from '@/components/globest/wellnessCategoryData';
import { catalogScopes } from '@/components/globest/hbh/hbhZoneData';

export default function useCatalogProducts({ source, scope, filters, sort, params }) {
  const base = { approval_status: 'published', ...(catalogScopes[scope] ? { category: { $in: catalogScopes[scope] } } : {}), ...(source === 'global' ? { source_url: { $regex: 'iherb\\.com', $options: 'i' } } : {}) };
  /** @type {Array<import('@base44/sdk').EntityFilterQuery<Record<string,unknown>>>} */
  const clauses = [base, { price: { $lte: filters.price } }];
  const categoryQuery = key => { const item = wellnessCategories.find(c => c[0] === key); return { category: item ? { $in: [key, ...item[3]] } : key }; };
  if (filters.category !== 'all') clauses.push(categoryQuery(filters.category));
  if (wellnessCategories.some(c => c[0] === params.get('concern'))) clauses.push(categoryQuery(params.get('concern')));
  if (filters.origin !== 'all') { const pattern = filters.origin === 'usa' ? 'usa|united states|美国' : 'china|中国'; clauses.push({ $or: ['origin_en', 'origin_zh'].map(field => ({ [field]: { $regex: pattern, $options: 'i' } })) }); }
  if (filters.earn) clauses.push({ is_demo: false, hbh: { $gte: 200 } });
  const text = (params.get('q') || '').trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (text) clauses.push({ $or: ['name_zh', 'name_en'].map(field => ({ [field]: { $regex: text, $options: 'i' } })) });
  const query = { $and: clauses };
  const order = { featured: 'created_date', low: 'price', high: '-price', points: '-hbh' }[sort];
  const key = JSON.stringify([query, order]);
  const activeKey = useRef(key);
  activeKey.current = key;
  const pendingMore = useRef(null);
  const [display, setDisplay] = useState({ key, count: 12 });
  useEffect(() => { setDisplay({ key, count: 12 }); }, [key]);
  const limit = display.key === key ? display.count : 12;
  const list = useInfiniteQuery({ queryKey: ['catalog-products', key], initialPageParam: null, queryFn: ({ pageParam }) => base44.entities.Product.filter(query, { sort: order, limit: 12, ...(pageParam ? { cursor: pageParam } : {}) }), getNextPageParam: page => page.has_more ? page.next_cursor : undefined });
  const total = useQuery({ queryKey: ['catalog-total', query], queryFn: () => base44.entities.Product.count(query) });
  const groups = useQuery({ queryKey: ['catalog-categories', base], queryFn: () => base44.entities.Product.aggregate({ query: base, groupBy: 'category' }) });
  const counts = { all: 0 };
  (groups.data?.rows || []).forEach(row => { counts[row.category] = row.count; counts.all += row.count; });
  const products = (list.data?.pages || []).flatMap(page => page.items);
  const loadMore = async () => {
    if (list.isFetching || pendingMore.current?.key === key) return;
    const request = { key }; pendingMore.current = request;
    try {
      if (products.length < limit + 12) {
        if (!list.hasNextPage) return;
        const result = await list.fetchNextPage({ cancelRefetch: false });
        if (result.isError) return;
      }
      if (activeKey.current === key) setDisplay({ key, count: limit + 12 });
    } finally { if (pendingMore.current === request) pendingMore.current = null; }
  };
  const id = params.get('product');
  const detail = useQuery({ queryKey: ['catalog-detail', source, scope, id], enabled: !!id, queryFn: () => base44.entities.Product.filter({ ...base, id }, { limit: 1 }) });
  const linkedState = !params.has('product') ? 'idle' : !id ? 'missing' : detail.isPending ? 'loading' : detail.isError ? 'error' : detail.data?.items?.length ? 'ready' : 'missing';
  const isError = (list.isError && !list.data) || total.isError || groups.isError;
  const retrying = list.isFetching || total.isFetching || groups.isFetching;
  return { products: products.slice(0, limit), total: total.data, counts, linkedProduct: detail.data?.items?.[0], linkedState, retryLinked: () => detail.refetch(), isLoading: !isError && (list.isPending || total.isPending || groups.isPending), isError, retrying, refreshError: list.isRefetchError && !!list.data, refetch: () => { list.refetch(); total.refetch(); groups.refetch(); }, loadMore, hasMore: products.length > limit || !!list.hasNextPage, loadingMore: list.isFetchingNextPage, moreDisabled: list.isFetching, moreError: list.isFetchNextPageError };
}