import React from 'react';
import { motion } from 'framer-motion';
import { ScanFace, Sparkles } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';

const leaves = Array.from({ length: 14 }, (_, i) => i);

export default function HerbTeaHero() {
  const { t } = useExperience();
  return <section className="relative overflow-hidden rounded-3xl bg-[#0F382C] px-6 pb-12 pt-14 text-white">
    <motion.div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#6CBB3C]/30 blur-3xl" animate={{ scale: [1, 1.3, 1], opacity: [.5, .9, .5] }} transition={{ repeat: Infinity, duration: 6 }}/>
    <motion.div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#E4C88A]/25 blur-3xl" animate={{ scale: [1.2, 1, 1.2] }} transition={{ repeat: Infinity, duration: 7 }}/>
    {leaves.map(i => <motion.span key={i} className="absolute h-2 w-4 rounded-full bg-[#E4C88A]/60" style={{ left: `${(i * 37) % 100}%`, top: '-5%' }} animate={{ y: ['0vh', '70vh'], rotate: [0, 360], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 6 + (i % 5), delay: i * .5, ease: 'linear' }}/>)}
    <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
      {[0, 1, 2].map(i => <motion.span key={i} className="absolute inset-0 rounded-full border border-[#E4C88A]/50" animate={{ scale: [.6, 1.4], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 3, delay: i }}/>)}
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#E4C88A] to-[#B28A45] shadow-2xl"><ScanFace size={44} className="text-[#0F382C]"/></div>
      <motion.div className="absolute left-4 right-4 h-0.5 bg-[#6CBB3C] shadow-[0_0_12px_#6CBB3C]" animate={{ top: ['20%', '80%', '20%'] }} transition={{ repeat: Infinity, duration: 2.5 }}/>
    </div>
    <motion.div className="relative mt-8 text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9 }}>
      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] tracking-widest text-[#E4C88A]"><Sparkles size={12}/>AI TCM HERBAL TEA</span>
      <h1 className="mt-4 font-heading text-4xl font-bold leading-tight">{t('AI 中医凉茶铺', 'AI TCM Herbal Tea Bar')}</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80">{t('面诊 · 舌诊 · 脉诊，AI 辨识体质倾向，茶师现场抓药，为你煎一杯对的凉茶。', 'Face, tongue and pulse scans read your constitution — then a tea master brews the right cup on the spot.')}</p>
      <a href="#flow" className="mt-6 inline-block rounded-full bg-[#E4C88A] px-6 py-3 text-sm font-bold text-[#0F382C]">{t('了解体验流程', 'See the journey')}</a>
    </motion.div>
  </section>;
}