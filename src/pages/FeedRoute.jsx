import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Feed from '@/pages/Feed';
import JournalArticle from '@/components/globest/journal/JournalArticle';
import JournalIndex from '@/components/globest/journal/JournalIndex';

export default function FeedRoute() {
  const [params] = useSearchParams();
  if (params.has('article')) return <JournalArticle slug={params.get('article')}/>;
  if (params.get('view') === 'journal') return <JournalIndex/>;
  return <Feed/>;
}