import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { founder as f } from './globestSite';

export default function FounderLetter() {
  return <section className="my-6 rounded-2xl bg-[#F5EFE3] p-5">
    <div className="flex items-center gap-4"><img src={f.photo} alt={f.name} className="h-20 w-20 rounded-full object-cover"/><div><span className="text-[10px] tracking-widest text-[#B28A45]">首席CEO</span><h2 className="font-heading text-2xl font-bold">{f.name} <small className="text-sm font-normal">{f.en}</small></h2><p className="text-xs text-muted-foreground">自媒体账号：{f.handle}</p></div></div>
    <ul className="mt-3 space-y-1 text-xs">{f.roles.map(r => <li key={r}>· {r}</li>)}</ul>
    <div className="mt-4 space-y-3 text-sm leading-relaxed">{f.letter.map(p => <p key={p.slice(0, 10)}>{p}</p>)}<p className="font-heading text-lg text-primary">让人类更健康，生活更美好。</p><p className="text-right text-xs text-muted-foreground">—— HBH 集团创始人</p></div>
    <div className="mt-4 space-y-1.5 border-t pt-3 text-xs"><a href={`tel:${f.tel.replace(/\s/g, '')}`} className="flex items-center gap-2"><Phone size={13}/>{f.tel}</a><a href={`mailto:${f.email}`} className="flex items-center gap-2"><Mail size={13}/>{f.email}</a><p className="flex items-center gap-2"><MapPin size={13}/>{f.address}</p></div>
  </section>;
}