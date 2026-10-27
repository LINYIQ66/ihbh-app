import { journal } from '@/components/globest/journalData';
import { journalMore } from '@/components/globest/journalMore';

export const journalEntries = [...journal, ...journalMore];
export const findJournalArticle = slug => journalEntries.find(article => article.id === slug);