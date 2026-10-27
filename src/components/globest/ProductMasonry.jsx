import React, { useLayoutEffect, useRef } from 'react';
import '@/components/globest/product-masonry.css';

export default function ProductMasonry({ children, className = 'product-grid' }) {
  const gridRef = useRef(null);
  useLayoutEffect(() => {
    const grid = gridRef.current;
    const measure = items => {
      const gap = parseFloat(window.getComputedStyle(grid).columnGap) || 0;
      const sizes = items.map(item => [item, Math.max(1, Math.ceil(item.getBoundingClientRect().height + gap))]);
      sizes.forEach(([item, span]) => { item.style.gridRowEnd = `span ${span}`; });
    };
    const observer = new ResizeObserver(entries => measure(entries.map(({ target }) => target)));
    const items = Array.from(grid.children);
    measure(items);
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [children]);
  return <div ref={gridRef} className={`product-masonry ${className}`}>{children}</div>;
}