import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';
import ContentLink from '@/components/globest/ContentLink';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function WellnessNews() {
  const { t } = useExperience();
  const news = useQuery({ queryKey: ['wellness-news'], queryFn: async () => (await base44.functions.invoke('getWellnessNews', {})).data.articles, staleTime: 60 * 60 * 1000 });
  return <section className="mb-8"><h2 className="mb-2 font-heading text-xl">{t('最新科技保健资讯', 'Latest wellness research')}</h2><p className="mb-4 text-sm text-muted-foreground">{t('自动更新的 PubMed 研究标题；点击阅读原文。研究结果不等于产品疗效。', 'Automatically updated PubMed research. Open a source to read more; research findings are not product claims.')}</p>{news.isLoading ? <p>{t('正在获取资讯…', 'Loading research…')}</p> : news.isError ? <div><p>{t('资讯暂时无法加载。', 'Research is unavailable right now.')}</p><button className="primary-btn mt-2" onClick={() => news.refetch()}>{t('重试', 'Retry')}</button></div> : news.data?.length ? <div className="message-feed">{news.data.map(item => <ContentLink key={item.id} href={item.url}><BookOpen size={20} className="shrink-0"/><div><b>{item.title}</b><small>{item.journal} · {item.date} · PubMed ↗</small></div></ContentLink>)}</div> : <p>{t('近期暂无相关研究。', 'No recent research found.')}</p>}</section>;
}