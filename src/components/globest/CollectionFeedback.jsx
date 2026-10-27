import React from 'react';
import AutoLoadMore from '@/components/globest/AutoLoadMore';
export default function CollectionFeedback({ collection: c, empty = '暂无符合条件的内容', unit = '条', autoLoad = false }) {
  return <div className="space-y-3 py-4 text-center text-sm">
    {c.isPending && <p role="status">正在加载…</p>}
    {(c.isError || c.countError) && <div role="alert"><p>{c.moreError ? '加载更多失败，已保留当前内容。' : c.hasData ? '更新或数量获取失败，已保留当前内容。' : '内容加载失败，请重试。'}</p><button className="primary-btn mt-2" disabled={c.isFetching} onClick={c.moreError ? c.loadMore : c.refetch}>{c.isFetching ? '正在重试…' : '重试'}</button></div>}
    {!c.isPending && !c.isError && !c.items.length && <p>{empty}</p>}
    {autoLoad ? <AutoLoadMore hasMore={c.hasNextPage} disabled={c.isFetching || c.isPending || c.isError || c.countError} loading={c.loadingMore} error={c.moreError} itemCount={c.items.length} onLoadMore={c.loadMore}/> : c.hasNextPage && !c.moreError && <button className="primary-btn" disabled={c.isFetching} onClick={c.loadMore}>{c.loadingMore ? '正在加载…' : '加载更多'}</button>}
    {c.hasData && <p className="text-xs text-muted-foreground" role="status" aria-live="polite" aria-atomic="true">已展示 {c.items.length} {unit}{c.total !== undefined ? ` / 共 ${c.total} ${unit}` : '，总数暂不可用'}</p>}
  </div>;
}