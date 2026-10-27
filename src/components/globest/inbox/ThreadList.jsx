import React, { useState } from 'react';
import { Search, Pin, BellOff, Bot, Trash2, CheckCheck } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import CategoryIcons from '@/components/globest/inbox/CategoryIcons';

const summary = (t, tr) => { const m = t.messages?.at(-1); if (m) return m.text || (m.product ? tr('[商品卡片]', '[Product]') : m.image ? tr('[图片]', '[Image]') : ''); const n = t.notices?.[0]; return n ? tr(...n.title) : ''; };
const fmt = d => { const x = new Date(d); return Date.now() - x.getTime() < 864e5 ? x.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : x.toLocaleDateString(); };

export default function ThreadList({ inbox, active, onOpen }) {
  const { t } = useExperience(); const [q, setQ] = useState(''); const [batch, setBatch] = useState(false); const [sel, setSel] = useState([]);
  const match = th => !q || [th.zh, th.en, ...(th.messages || []).map(m => m.text || m.product?.name_zh || ''), ...(th.notices || []).flatMap(n => [...n.title, ...n.body])].join(' ').toLowerCase().includes(q.toLowerCase());
  const list = inbox.threads.filter(th => th.type !== 'marketing' || inbox.marketing).filter(match)
    .sort((a, b) => (Number(inbox.pinned.includes(b.id)) - Number(inbox.pinned.includes(a.id))) || new Date(b.time).getTime() - new Date(a.time).getTime());
  const chats = list.filter(th => th.type === 'chat' || th.type === 'ai');
  const pick = id => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  return <div className="flex flex-col rounded-2xl border border-border bg-card">
    <div className="p-3"><div className="flex items-center gap-2 rounded-full bg-muted px-3 py-2"><Search size={16} /><input value={q} onChange={e => setQ(e.target.value)} placeholder={t('搜索商家、联系人、商品、聊天记录', 'Search merchants, contacts, products, chats')} className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></div></div>
    <CategoryIcons inbox={inbox} active={active} onOpen={onOpen} />
    <div className="flex items-center justify-between border-y border-border px-3 py-2 text-xs">
      <b>{t('聊天', 'Chats')}</b>
      <div className="flex gap-3">{batch && <><button onClick={() => { inbox.markRead(sel); setSel([]); }} className="flex items-center gap-1"><CheckCheck size={13} />{t('已读', 'Read')}</button><button onClick={() => { inbox.remove(sel); setSel([]); }} className="flex items-center gap-1 text-red-500"><Trash2 size={13} />{t('删除', 'Delete')}</button></>}
        <button onClick={() => { inbox.markRead(list.map(x => x.id)); }}>{t('全部已读', 'Read all')}</button>
        <button onClick={() => { setBatch(!batch); setSel([]); }} className="font-bold text-orange-500">{batch ? t('完成', 'Done') : t('管理', 'Manage')}</button></div>
    </div>
    <div className="max-h-[560px] overflow-y-auto">{chats.map(th => <div key={th.id} className={`group flex items-center gap-3 px-3 py-3 hover:bg-muted ${active === th.id ? 'bg-orange-50' : ''}`}>
      {batch && <input type="checkbox" checked={sel.includes(th.id)} onChange={() => pick(th.id)} />}
      <button onClick={() => onOpen(th.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="relative shrink-0">{th.type === 'ai' ? <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white"><Bot size={20} /></span> : <img src={th.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />}
          {th.unread > 0 && <b className={`absolute -right-1 -top-1 grid min-w-[18px] place-items-center rounded-full px-1 text-[10px] text-white ${inbox.muted.includes(th.id) ? 'h-2.5 min-w-[10px] bg-red-400' : 'h-[18px] bg-red-500'}`}>{inbox.muted.includes(th.id) ? '' : th.unread}</b>}</span>
        <span className="min-w-0 flex-1"><span className="flex items-center gap-1 text-sm font-bold">{t(th.zh, th.en)}{inbox.pinned.includes(th.id) && <Pin size={11} className="text-orange-500" />}{inbox.muted.includes(th.id) && <BellOff size={11} className="text-muted-foreground" />}</span>
          <span className="block truncate text-xs text-muted-foreground">{summary(th, t)}</span></span>
        <small className="text-[11px] text-muted-foreground">{fmt(th.time)}</small></button>
      {!batch && <div className="hidden gap-1 group-hover:flex"><button title={t('置顶', 'Pin')} onClick={() => inbox.togglePin(th.id)}><Pin size={14} /></button><button title={t('静音', 'Mute')} onClick={() => inbox.toggleMute(th.id)}><BellOff size={14} /></button><button title={t('删除', 'Delete')} onClick={() => inbox.remove([th.id])}><Trash2 size={14} /></button></div>}
    </div>)}{!chats.length && <p className="p-6 text-center text-sm text-muted-foreground">{t('没有找到相关消息', 'No messages found')}</p>}</div>
  </div>;
}