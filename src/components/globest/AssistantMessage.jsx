import React from 'react';
import ReactMarkdown from 'react-markdown';
import ContentLink from '@/components/globest/ContentLink';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function AssistantMessage({ message }) {
  const { t } = useExperience();
   const user = message.role === 'user';
  return <div className={`flex ${user ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${user ? 'bg-primary text-primary-foreground' : 'bg-card border shadow-sm'}`}>
      {user ? <p className="whitespace-pre-wrap">{message.content}</p> : <ReactMarkdown className="prose prose-sm max-w-none" components={{a:({href,children})=><ContentLink href={href} allowInternal className="font-semibold text-primary underline underline-offset-2">{children}</ContentLink>}}>{message.content}</ReactMarkdown>}
      {message.tool_calls?.map((call,index)=><p key={index} className="mt-2 text-xs opacity-70">{call.status === 'failed' || call.status === 'error' ? t('商品资料读取失败','Could not load product details') : call.status === 'completed' || call.status === 'success' ? t('已查阅商城商品','Checked mall products') : t('正在查阅商城商品…','Checking mall products…')}</p>)}
    </div>
  </div>;
}