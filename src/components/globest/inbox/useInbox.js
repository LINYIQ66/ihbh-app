import { useState } from 'react';
import { initialThreads } from '@/components/globest/inbox/inboxData';

const KEY = 'globest-inbox-v1';
const load = () => JSON.parse(localStorage.getItem(KEY) || 'null') || { threads: initialThreads, pinned: [], muted: [], marketing: true };

export default function useInbox() {
  const [s, setS] = useState(load);
  const save = fn => setS(prev => { const next = fn(prev); localStorage.setItem(KEY, JSON.stringify(next)); return next; });
  const toggle = (k, id) => save(p => ({ ...p, [k]: p[k].includes(id) ? p[k].filter(x => x !== id) : [...p[k], id] }));
  const mapT = (ids, fn) => save(p => ({ ...p, threads: p.threads.map(t => ids.includes(t.id) ? fn(t) : t) }));
  return {
    ...s,
    togglePin: id => toggle('pinned', id),
    toggleMute: id => toggle('muted', id),
    markRead: ids => mapT(ids, t => ({ ...t, unread: 0 })),
    remove: ids => save(p => ({ ...p, threads: p.threads.filter(t => !ids.includes(t.id)) })),
    setMarketing: v => save(p => ({ ...p, marketing: v })),
    addMessage: (id, msg) => mapT([id], t => ({ ...t, time: msg.time, messages: [...(t.messages || []), msg] })),
  };
}