import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

export default function AutoLoadMore({ hasMore, disabled, loading, error, itemCount, onLoadMore }) {
  const sentinel = useRef(null);
  useEffect(() => {
    if (!hasMore || disabled || error || !sentinel.current) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      onLoadMore();
    }, { rootMargin: '0px 0px 300px 0px' });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [hasMore, disabled, error, itemCount, onLoadMore]);
  if (!hasMore || error) return null;
  return <div ref={sentinel} className="flex min-h-12 items-center justify-center gap-2 py-4 text-sm text-muted-foreground" role="status" aria-live="polite">
    {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true"/>}
    {loading ? '正在加载更多商品…' : '继续下滑，自动加载更多商品'}
  </div>;
}