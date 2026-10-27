import React from 'react';

export default function CatalogLinkStatus({ state, onRetry, onReturn }) {
  if (state === 'idle' || state === 'ready') return null;
  if (state === 'loading') return <p role="status" className="mb-4">正在读取链接中的商品…</p>;
  return <section role="alert" className="mb-4 space-y-3 rounded-xl border bg-card p-4">
    <h3 className="font-semibold">{state === 'error' ? '链接商品暂时无法读取' : '未找到链接中的已发布商品'}</h3>
    <p>商品可能未发布、已下架或链接参数无效，不会绕过访问限制读取。</p>
    <div className="flex gap-4">{state === 'error' && <button className="text-link" onClick={onRetry}>重试读取</button>}<button className="text-link" onClick={onReturn}>返回商品列表</button></div>
  </section>;
}