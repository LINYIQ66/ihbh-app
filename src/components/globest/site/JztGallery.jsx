import React from 'react';
import { motion } from 'framer-motion';
import JztBlock from '@/components/globest/jzt/JztBlock';
import { jztCategories, scenes } from './globestSite';

export default function JztGallery() {
  return <>
    <JztBlock eyebrow="香港九珍堂专区" title="一眼看见，九珍好物">
      <div className="grid grid-cols-2 gap-3">{jztCategories.map(([en, zh, d, img], n) => <motion.div key={zh} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: n * .1 }} className="overflow-hidden rounded-xl border"><img src={img} alt={zh} className="aspect-square w-full object-cover"/><div className="p-3"><span className="text-[9px] tracking-widest text-[#B28A45]">0{n + 1} {en}</span><b className="block">{zh}</b><p className="text-xs text-muted-foreground">{d}</p></div></motion.div>)}</div>
    </JztBlock>
    <JztBlock eyebrow="A CLOSER LOOK AT THE SOURCE" title="走近自然，看见好物的来处">
      <div className="-mx-1 flex snap-x gap-2 overflow-x-auto pb-2">{scenes.map(s => <figure key={s.image} className="w-40 shrink-0 snap-start"><img src={s.image} alt={s.cap} className="h-28 w-40 rounded-lg object-cover"/><figcaption className="mt-1 text-[11px]"><b className="text-[#B28A45]">{s.cat}</b> · {s.cap}</figcaption></figure>)}</div>
    </JztBlock>
  </>;
}