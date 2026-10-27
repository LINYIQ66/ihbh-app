import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Award, FileText } from 'lucide-react';
import JztGallery from '@/components/globest/site/JztGallery';
import JztBlock from '@/components/globest/jzt/JztBlock';
import { facts, intro, timeline, bases, facility, business, brands, partners, stars, honors, culture, future } from '@/components/globest/jzt/jztData';

export default function JiuZhenTang() {
  return <div className="page-inner mx-auto max-w-4xl space-y-4 pb-10">
    <section className="rounded-2xl bg-gradient-to-br from-[#0F382C] to-[#1d5a45] p-6 text-white">
      <span className="text-xs tracking-widest text-[#E4C88A]">JIU ZHEN TANG · SINCE 2003</span>
      <h1 className="mt-1 font-heading text-2xl font-bold">九珍堂健康药业（苏州）股份有限公司</h1>
      <p className="mt-3 text-sm leading-relaxed text-white/85">{intro}</p>
      <p className="mt-3 flex items-center gap-1 text-xs text-[#E4C88A]"><MapPin size={13}/>苏州吴中区东山镇太湖半岛 · 一小时经济圈辐射江浙沪</p>
      <a href="https://media.base44.com/files/public/6aa3280ca2d875c1b77cdd8e/747798b32_.pdf" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#E4C88A] px-4 py-2 text-xs font-bold text-[#0F382C]"><FileText size={14}/>查看企业宣传册（PDF）</a>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">{facts.map(([v, zh]) => <div key={zh} className="rounded-xl bg-white/10 p-2"><b className="text-lg text-[#E4C88A]">{v}</b><p className="text-[10px] text-white/80">{zh}</p></div>)}</div>
    </section>

    <JztGallery/>

    <JztBlock eyebrow="MILESTONES" title="发展历程">
      <ol className="space-y-3 border-l-2 border-[#B28A45]/40 pl-4">{timeline.map(([y, d]) => <li key={y} className="relative"><span className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-[#B28A45]"/><b className="text-primary">{y}</b><p className="text-sm text-muted-foreground">{d}</p></li>)}</ol>
    </JztBlock>

    <JztBlock eyebrow="ORIGIN BASES" title="原料种植基地 · 道地源头">
      <div className="grid gap-3 sm:grid-cols-2">{bases.map(([i, n, d]) => <div key={n} className="rounded-xl bg-[#F5EFE3] p-4"><b>{i} {n}</b><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{d}</p></div>)}</div>
    </JztBlock>

    <JztBlock eyebrow="GMP FACILITY" title="现代化GMP工厂">
      <div className="space-y-3">{facility.map(([n, d]) => <div key={n} className="flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-primary" size={18}/><div><b className="text-sm">{n}</b><p className="text-xs leading-relaxed text-muted-foreground">{d}</p></div></div>)}</div>
      <div className="mt-4 flex flex-wrap gap-2">{business.map(b => <span key={b} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{b}</span>)}</div>
    </JztBlock>

    <JztBlock eyebrow="STAR PRODUCTS" title="明星产品">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{stars.map(s => <div key={s} className="rounded-lg border p-3 text-center text-sm font-semibold">{s}</div>)}</div>
      <Link to="/discover?section=hbh" className="mt-3 inline-block text-sm font-semibold text-primary">去HBH专区选购 →</Link>
    </JztBlock>

    <JztBlock eyebrow="BRAND FAMILY" title="旗下品牌矩阵">
      <div className="grid gap-2 sm:grid-cols-2">{brands.map(([n, d]) => <div key={n} className="rounded-xl border p-3"><b className="text-[#9b2c22]">{n}</b><p className="mt-1 text-xs text-muted-foreground">{d}</p></div>)}</div>
    </JztBlock>

    <JztBlock eyebrow="PARTNERS" title="强势进驻合作品牌">
      <div className="flex flex-wrap gap-2">{partners.map(p => <span key={p} className="rounded-md bg-muted px-2.5 py-1 text-xs">{p}</span>)}</div>
    </JztBlock>

    <JztBlock eyebrow="HONORS" title="荣誉与成就">
      <ul className="grid gap-2 sm:grid-cols-2">{honors.map(h => <li key={h} className="flex items-center gap-2 text-sm"><Award size={16} className="text-[#B28A45]"/>{h}</li>)}</ul>
    </JztBlock>

    <JztBlock eyebrow="CULTURE" title="企业文化与理念"><p className="text-sm leading-relaxed text-muted-foreground">{culture}</p></JztBlock>

    <JztBlock eyebrow="FUTURE" title="未来发展">
      <div className="grid grid-cols-3 gap-2">{future.map(([n, d]) => <div key={n} className="rounded-xl bg-primary p-3 text-primary-foreground"><b>{n}</b><p className="mt-1 text-[11px] opacity-80">{d}</p></div>)}</div>
      <Link to="/join" className="mt-4 block rounded-full bg-[#B28A45] py-3 text-center text-sm font-bold text-white">加盟合作 · 共创美好未来</Link>
    </JztBlock>
  </div>;
}