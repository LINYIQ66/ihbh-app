import React from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function AllianceStats({ statusRows, txTotal, txCount }) {
  const { t } = useExperience();
  const c = s => statusRows.find(r => r.status === s)?.count || 0;
  const items = [[t('待审核', 'Pending'), c('pending')], [t('已通过商家', 'Approved'), c('approved')], [t('已拒绝', 'Rejected'), c('rejected')], [t('累计流水', 'Total volume'), `S$${Number(txTotal || 0).toLocaleString()}`], [t('流水笔数', 'Transactions'), txCount || 0]];
  return <div className="grid grid-cols-2 gap-2 md:grid-cols-5">{items.map(([l, v]) => <div key={l} className="rounded-xl border bg-card p-3"><span className="text-xs text-muted-foreground">{l}</span><b className="block text-xl">{v}</b></div>)}</div>;
}