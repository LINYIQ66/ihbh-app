import React from 'react';
import { Link } from 'react-router-dom';
import safePublicUrl from '@/components/globest/safePublicUrl';

export default function ContentLink({ href, children, allowInternal = false, ...props }) {
  if (allowInternal && typeof href === 'string' && /^\/(?!\/)/.test(href) && !/[\\\u0000-\u0020]/.test(href)) return <Link to={href} {...props}>{children}</Link>;
  const url = safePublicUrl(href);
  return url ? <a href={url} target="_blank" rel="noopener noreferrer" {...props}>{children}</a> : <span {...props}>{children}<small className="block text-muted-foreground">来源链接暂不可用</small></span>;
}