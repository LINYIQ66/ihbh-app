import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { journalEntries } from '@/components/globest/journal/journalEntries';
import { useLocation } from 'react-router-dom';
import JournalCard from '@/components/globest/JournalCard';
import { useExperience } from '@/components/globest/ExperienceProvider';
export default function JournalStrip() {
  const {t} = useExperience();
  const location = useLocation();
  const [expanded, setExpanded] = useState(() => journalEntries.findIndex(article => article.id === location.state?.journalFocus) >= 6);
  const articles = journalEntries;
  const id = useId();
  const titleId = `${id}-title`, articlesId = `${id}-articles`, hintId = `${id}-hint`;
  const remaining = Math.max(0, articles.length - 6);
  return <section id="journal" className="journal-section" aria-labelledby={titleId}><div className="section-heading"><div><span className="eyebrow">A LITTLE INSPIRATION, EVERY DAY</span><h2 id={titleId}>{t('每日滋养灵感', 'Your daily dose of inspiration')}</h2></div><Link className="text-link" to="/feed?view=journal">{t('发现更多', 'Explore the journal')}<ArrowRight size={15}/></Link></div><div className="journal-grid" id={articlesId} role="group" aria-labelledby={titleId}>{(expanded ? articles : articles.slice(0, 6)).map(a=><JournalCard key={a.id} article={a}/>)}</div>{articles.length > 6 && <div className="mt-5 flex flex-col items-center gap-2"><p id={hintId} className="text-sm text-muted-foreground" aria-live="polite" aria-atomic="true">{expanded ? t(`已展示全部 ${articles.length} 条灵感`, `Showing all ${articles.length} articles`) : t(`还有 ${remaining} 条灵感可展开`, `${remaining} more articles to explore`)}</p><button className="primary-btn" aria-expanded={expanded} aria-controls={articlesId} aria-describedby={hintId} onClick={() => setExpanded(value => !value)}>{t(expanded ? '收起文章' : '展开更多', expanded ? 'Show fewer articles' : 'Show more articles')}</button></div>}</section>;
}