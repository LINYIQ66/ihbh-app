import React, { useEffect, useRef, useState } from 'react';
import { Send, ImagePlus, Smile, Package, Loader2, Headphones } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { demoProduct } from '@/components/globest/inbox/inboxData';
import ChatProductCard from '@/components/globest/inbox/ChatProductCard';
import SignedImage from '@/components/globest/inbox/SignedImage';

const emojis = ['😀', '😂', '😍', '👍', '🙏', '🎉', '❤️', '😅'];

export default function ChatWindow({ thread, inbox }) {
  const { t, state } = useExperience(); const [text, setText] = useState(''); const [busy, setBusy] = useState(false); const [emo, setEmo] = useState(false); const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [thread.messages.length]);
  const push = m => inbox.addMessage(thread.id, { ...m, time: new Date().toISOString() });
  const replyAI = async history => {
    setBusy(true);
    const { data } = await base44.functions.invoke('customerServiceReply', { history, lang: state.lang });
    push({ from: 'them', text: data.reply });
    if (data.handoff) push({ from: 'system', text: t('已为您转接人工客服，客服将在 5 分钟内回复，聊天记录已保留。', 'Transferred to a human agent (reply within 5 min). Chat history kept.') });
    setBusy(false);
  };
  const send = async e => { e?.preventDefault(); const v = text.trim(); if (!v || busy) return; setText(''); const msg = { from: 'me', text: v };
    push(msg);
    if (thread.type === 'ai') await replyAI([...thread.messages, msg]);
    else setTimeout(() => push({ from: 'them', text: t('【自动回复】亲，已收到您的消息，客服马上为您处理～', '[Auto-reply] Got it! An agent will reply shortly.') }), 800);
  };
  const upload = async f => { if (!f) return; setBusy(true); const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file: f }); push({ from: 'me', image: file_uri }); setBusy(false); };
  return <div className="flex h-[640px] flex-col rounded-2xl border border-border bg-card">
    <div className="flex items-center justify-between border-b border-border px-4 py-3"><b>{t(thread.zh, thread.en)}</b>
      {thread.type === 'ai' && <button onClick={() => push({ from: 'system', text: t('已转接人工客服，请稍候。', 'Connecting you to a human agent.') })} className="flex items-center gap-1 text-xs font-bold text-orange-500"><Headphones size={14} />{t('转人工', 'Human agent')}</button>}</div>
    <div className="flex-1 space-y-3 overflow-y-auto bg-muted/40 p-4">{thread.messages.map((m, i) => m.from === 'system'
      ? <p key={i} className="text-center text-xs text-muted-foreground">{m.text}</p>
      : <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : ''}`}>
        {m.product ? <ChatProductCard product={m.product} /> : m.image ? <SignedImage uri={m.image} className="h-40 w-40 rounded-xl object-cover" />
          : <p className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${m.from === 'me' ? 'bg-orange-500 text-white' : 'bg-card'}`}>{m.text}</p>}</div>)}
      {busy && <Loader2 className="animate-spin text-orange-500" size={18} />}<div ref={end} /></div>
    {emo && <div className="flex gap-2 border-t border-border px-3 py-2 text-xl">{emojis.map(x => <button key={x} onClick={() => setText(v => v + x)}>{x}</button>)}</div>}
    <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
      <button type="button" aria-label="选择表情" aria-expanded={emo} onClick={() => setEmo(!emo)}><Smile size={20} /></button>
      <label className="cursor-pointer"><ImagePlus size={20} /><input type="file" accept="image/*" hidden onChange={e => upload(e.target.files[0])} /></label>
      {thread.type === 'chat' && <button type="button" title={t('发送商品', 'Send product')} onClick={() => push({ from: 'me', product: demoProduct })}><Package size={20} /></button>}
      <input aria-label="消息内容" value={text} onChange={e => setText(e.target.value)} placeholder={t('输入消息…', 'Type a message…')} className="min-w-0 flex-1 rounded-full bg-muted px-4 py-2 text-sm outline-none" />
      <button aria-label="发送消息" disabled={busy} className="grid h-9 w-9 place-items-center rounded-full bg-orange-500 text-white disabled:opacity-50"><Send size={16} /></button></form>
  </div>;
}