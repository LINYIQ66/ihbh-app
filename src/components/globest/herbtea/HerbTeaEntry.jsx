import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ScanFace } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function HerbTeaEntry() {
  const { t } = useExperience();
  return <Link to="/herb-tea" className="relative my-6 flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F382C] to-[#1d5a45] p-5 text-white">
    <motion.span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent" animate={{ x: ['-100%', '400%'] }} transition={{ repeat: Infinity, duration: 3 }}/>
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E4C88A]"><ScanFace className="text-[#0F382C]"/></div>
    <div className="flex-1"><b className="font-heading text-xl">{t('AI 凉茶铺', 'AI Herbal Tea Bar')}</b><p className="text-xs text-white/75">{t('面诊 · 舌诊 · 脉诊 → 现场为你煎一杯对的凉茶', 'Face · tongue · pulse → your tea, brewed live')}</p></div>
    <ArrowRight className="text-[#E4C88A]"/>
  </Link>;
}