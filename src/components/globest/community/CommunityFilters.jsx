import React from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function CommunityFilters({ topic, setTopic, search, setSearch }) {
  const { t } = useExperience();
  const topics = [['all','全部','All'],['wellness','养生心得','Wellness'],['ginseng','人参养成','Ginseng'],['promotion','会员分享','Member stories']];
  return <div className="mb-5 flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center"><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('搜索帖子、作者或商品…','Search posts, authors or products…')} aria-label={t('搜索论坛','Search community')} className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2"/><div className="flex gap-2 overflow-x-auto">{topics.map(([key,zh,en])=><button key={key} type="button" onClick={()=>setTopic(key)} className={topic===key?'shrink-0 rounded-full bg-primary px-3 py-2 text-xs text-primary-foreground':'shrink-0 rounded-full border px-3 py-2 text-xs'}>{t(zh,en)}</button>)}</div></div>;
}