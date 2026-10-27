import React, { useState } from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import '@/components/globest/discovery.css';
import WellnessNews from '@/components/globest/WellnessNews';
import useInbox from '@/components/globest/inbox/useInbox';
import ThreadList from '@/components/globest/inbox/ThreadList';
import ChatWindow from '@/components/globest/inbox/ChatWindow';
import NoticeThread from '@/components/globest/inbox/NoticeThread';

export default function Messages() {
  const { t } = useExperience(); const inbox = useInbox(); const [active, setActive] = useState('ai');
  const thread = inbox.threads.find(x => x.id === active);
  const open = id => { setActive(id); inbox.markRead([id]); };
  return <div className="page-inner discover-page space-y-6">
    <div className="page-title"><span className="eyebrow">NEWS & MESSAGES</span><h1>{t('消息', 'Messages')}</h1><p>{t('聊天咨询、订单物流、售后、平台通知与优惠，一站搞定。', 'Chats, orders, delivery, after-sales, notices and deals in one place.')}</p></div>
    <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
      <ThreadList inbox={inbox} active={active} onOpen={open} />
      {!thread ? <div className="grid h-[640px] place-items-center rounded-2xl border border-border text-sm text-muted-foreground">{t('选择一个会话', 'Select a conversation')}</div>
        : thread.notices ? <NoticeThread thread={thread} inbox={inbox} onContact={() => open('ai')} /> : <ChatWindow key={thread.id} thread={thread} inbox={inbox} />}
    </div>
    <WellnessNews />
  </div>;
}