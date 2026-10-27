import React from 'react';
import { Link } from 'react-router-dom';

export default function PageStatus({ title = '暂时无法加载', message = '请稍后重试，原有访问限制不会改变。', onRetry, busy = false }) {
  return <section className="page-inner customer-module space-y-4 py-12" role="alert">
    <h1 className="font-heading text-2xl">{title}</h1><p>{message}</p>
    <div className="flex flex-wrap gap-4">{onRetry && <button className="primary-btn" disabled={busy} onClick={onRetry}>{busy ? '正在重试…' : '重试加载'}</button>}<Link className="outline-btn" to="/">返回首页</Link></div>
  </section>;
}