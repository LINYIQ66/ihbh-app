import React from 'react';
import { Switch } from '@/components/ui/switch';
import { useExperience } from '@/components/globest/ExperienceProvider';
import NoticeCard from '@/components/globest/inbox/NoticeCard';

export default function NoticeThread({ thread, inbox, onContact }) {
  const { t } = useExperience();
  return <div className="h-[640px] space-y-3 overflow-y-auto rounded-2xl border border-border bg-muted/40 p-4">
    <div className="flex items-center justify-between"><b className="text-lg">{t(thread.zh, thread.en)}</b>
      {thread.type === 'marketing' && <label className="flex items-center gap-2 text-xs">{t('接收营销推送', 'Promotional messages')}<Switch checked={inbox.marketing} onCheckedChange={inbox.setMarketing} /></label>}</div>
    {thread.type === 'marketing' && !inbox.marketing ? <p className="py-10 text-center text-sm text-muted-foreground">{t('已关闭营销推送', 'Promotional messages are off')}</p>
      : thread.notices.map((n, i) => <NoticeCard key={i} n={n} onContact={onContact} />)}
  </div>;
}