import React from 'react';
import { motion } from 'framer-motion';

export default function Fade({ children, delay = 0, className = '' }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: .6, delay }}>{children}</motion.div>;
}