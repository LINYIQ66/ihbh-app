import React, { useEffect, useRef, useState } from 'react';
import { Send, Ban } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';

const bot = [['小美', '这个枕头真的好睡吗？'], ['Jason', 'Ordered 2!'], ['阿明', '主播讲得很专业👍'], ['Lily', '优惠券怎么领？'], ['老王', '已关注～']];
const banned = /(傻|骗子|scam|fuck)/i;

export default function LiveChat({ onDanmaku, isAdmin }) {
  const { t } = useExperience(); const [msgs, setMsgs] = useState([]); const [text, setText] = useState(''); const [muted, setMuted] = useState([]); const end = useRef(null);
  const add = m => { setMsgs(x => [...x.slice(-60), { ...m, id: Math.random() }]); onDanmaku?.(m.text); };
  useEffect(() => { const i = setInterval(() => { const [name, text] = bot[Math.floor(Math.random() * bot.length)]; if (!muted.includes(name)) add({ name, text }); }, 2600); return () => clearInterval(i); }, [muted]);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [msgs]);
  const send = e => { e.preventDefault(); const v = text.trim(); if (!v) return; setText('');
    if (banned.test(v)) return add({ name: 'AI', text: t('⚠️ 检测到违规内容，已屏蔽', '⚠️ Blocked by AI moderation'), sys: true });
    add({ name: t('我', 'Me'), text: v, me: true }); };
  return <div className="flex min-h-0 flex-1 flex-col">
    <div className="flex-1 space-y-1.5 overflow-y-auto p-3 text-sm">{msgs.map(m => <p key={m.id} className={`group ${m.sys ? 'text-amber-400' : ''}`}><b className={m.me ? 'text-rose-400' : 'text-sky-300'}>{m.name}：</b>{m.text}
      {isAdmin && !m.me && !m.sys && <button onClick={() => { setMuted(x => [...x, m.name]); add({ name: t('系统', 'System'), text: t(`${m.name} 已被禁言`, `${m.name} muted`), sys: true }); }} className="ml-2 hidden text-xs text-white/50 group-hover:inline"><Ban size={11} className="inline" />{t('禁言', 'Mute')}</button>}</p>)}<div ref={end} /></div>
    <form onSubmit={send} className="flex gap-2 border-t border-white/10 p-2"><input value={text} onChange={e => setText(e.target.value)} placeholder={t('说点什么…', 'Say something…')} className="min-w-0 flex-1 rounded-full bg-white/10 px-3 py-2 text-sm outline-none" /><button className="grid h-9 w-9 place-items-center rounded-full bg-rose-500"><Send size={15} /></button></form>
  </div>;
}