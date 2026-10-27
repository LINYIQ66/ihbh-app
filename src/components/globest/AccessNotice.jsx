import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function AccessNotice({ title = '请先登录', returnTo = '/' }) {
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <section className="page-inner customer-module space-y-4 py-12" aria-labelledby="access-notice-title">
    <h1 ref={heading} id="access-notice-title" tabIndex={-1} className="font-heading text-2xl">{title}</h1>
    <p>此页面需要登录后访问，当前未登录或登录已失效，尚未读取账户资料。</p>
    <div className="flex flex-wrap gap-4"><Link className="primary-btn" to={`/login?returnTo=${encodeURIComponent(returnTo)}`}>登录后继续</Link><Link className="outline-btn" to="/">返回首页</Link></div>
  </section>;
}