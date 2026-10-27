import React from 'react';
import { Coins } from 'lucide-react';
import { useExperience, toHbh } from '@/components/globest/ExperienceProvider';

export default function HbhPrice({ sgd, className = '' }) {
  const { t } = useExperience();
  return <span className={`inline-flex items-center gap-1 text-xs font-bold text-amber-600 ${className}`}><Coins size={12} />{t('或', 'or')} {toHbh(sgd).toLocaleString()} HBH</span>;
}