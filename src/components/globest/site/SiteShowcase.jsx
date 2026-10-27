import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { slides, marquee } from './globestSite';

export default function SiteShowcase() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI(n => (n + 1) % slides.length), 5000); return () => clearInterval(id); }, []);
  const s = slides[i];
  return <section className="my-4 overflow-hidden rounded-2xl bg-[#0F382C] text-white">
    <div className="relative">
      <div className="flex h-[300px] items-center justify-center overflow-hidden bg-[#0F382C]">
        <AnimatePresence mode="wait"><motion.img key={s.image} src={s.image} alt={s.title} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="block h-full w-full object-contain"/></AnimatePresence>
      </div>
      <motion.div key={i} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .3, duration: .7 }} className="p-5">
        <span className="text-[10px] tracking-[.25em] text-[#E4C88A]">{s.eyebrow}</span>
        <h2 className="mt-2 font-heading text-3xl font-bold">{s.title}<em className="text-[#E4C88A]">{s.em}</em></h2>
        <p className="mt-2 max-w-sm text-sm text-white/80">{s.text}</p>
        <Link to={s.to} className="mt-4 inline-block rounded-full bg-[#E4C88A] px-5 py-2 text-xs font-bold text-[#0F382C]">{s.cta} →</Link>
      </motion.div>
      <div className="absolute right-4 top-4 flex gap-1.5">{slides.map((_, n) => <button key={n} aria-label={`slide ${n + 1}`} onClick={() => setI(n)} className={`h-1.5 rounded-full transition-all ${n === i ? 'w-6 bg-[#E4C88A]' : 'w-1.5 bg-white/50'}`}/>)}</div>
    </div>
    <div className="overflow-hidden border-t border-white/10 py-2 text-xs"><motion.div animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 18, ease: 'linear' }} className="flex w-max gap-6 whitespace-nowrap">{[...marquee, ...marquee, ...marquee, ...marquee].map((m, n) => <span key={n}>{m} <span className="text-[#E4C88A]">✦</span></span>)}</motion.div></div>
  </section>;
}