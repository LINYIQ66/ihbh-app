import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import JournalCard from '@/components/globest/JournalCard';
import { journalEntries } from '@/components/globest/journal/journalEntries';

export default function JournalIndex() {
  const heading = useRef(null), location = useLocation();
  useEffect(() => { if (!location.state?.journalFocus) heading.current?.focus(); }, [location.key, location.state?.journalFocus]);
  return <section className="page-inner customer-module" aria-labelledby="journal-index-title">
    <Link className="text-link" to="/live?tab=videos#journal">返回视频页灵感区</Link>
    <h1 ref={heading} id="journal-index-title" tabIndex={-1} className="my-4 font-heading text-3xl">每日滋养灵感</h1>
    <p className="mb-6 text-muted-foreground">共 {journalEntries.length} 篇，保留原有标题、摘要与已有正文；内容仅供一般知识阅读。</p>
    <div className="journal-grid">{journalEntries.map(article => <JournalCard key={article.id} article={article}/>)}</div>
  </section>;
}