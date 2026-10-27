import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { findJournalArticle } from '@/components/globest/journal/journalEntries';

export default function JournalArticle({ slug }) {
  const article = findJournalArticle(slug), heading = useRef(null), location = useLocation();
  const back = ['/live?tab=videos#journal', '/#journal'].includes(location.state?.journalOrigin) ? '/live?tab=videos#journal' : '/feed?view=journal';
  const paragraphs = article?.body?.map(paragraph => Array.isArray(paragraph) ? paragraph[0] : paragraph).filter(text => typeof text === 'string' && text.trim()) || [];
  useEffect(() => { heading.current?.focus(); }, [slug]);
  return <article className="page-inner customer-module mx-auto max-w-3xl" aria-labelledby="journal-article-title">
    <nav aria-label="文章返回"><Link to={back} state={{ journalFocus: article?.id }} replace className="text-link">关闭文章并返回列表</Link></nav>
    <h1 ref={heading} id="journal-article-title" tabIndex={-1} className="my-5 font-heading text-3xl">{article?.title?.[0] || '未找到这篇文章'}</h1>
    {article ? <>
      <p className="mb-5 text-muted-foreground">{article.subtitle?.[0]}</p>
      {article.image && <Image src={article.image} alt={article.title[0]} fittingType="fit" className="mb-6 aspect-video w-full rounded-xl"/>}
      {paragraphs.length ? <div className="space-y-5 text-base leading-8">{paragraphs.map((text, index) => <p key={index}>{text}</p>)}</div> : <p role="status">完整内容筹备中</p>}
      {article.id === 'nutrition' && <p className="mt-5"><a className="text-link" href="https://genecell.com/product/stem-cell-force/" target="_blank" rel="noopener noreferrer">已有产品资料来源：GeneCell（新窗口）</a></p>}
    </> : <p role="status">链接中的文章标识不存在或为空，请返回文章列表选择。</p>}
    <Link to="/feed?view=journal" state={{ journalFocus: article?.id }} className="primary-btn mt-8 inline-flex">返回全部文章列表</Link>
  </article>;
}