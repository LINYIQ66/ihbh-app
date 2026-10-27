import React from 'react';
import { motion } from 'framer-motion';

export default function Reveal({ children, glow = false }) {
  return <motion.div initial={{ opacity: 0, y: 40, scale: .97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }} className={glow ? 'relative' : undefined}>
    {glow && <motion.div aria-hidden className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-[#E4C88A]/0 via-[#E4C88A]/50 to-[#6CBB3C]/0 blur-xl" animate={{ opacity: [.3, .8, .3] }} transition={{ repeat: Infinity, duration: 3.5 }}/>}
    {children}
  </motion.div>;
}