import React from 'react';

export default function JztBlock({ eyebrow, title, children }) {
  return <section className="rounded-2xl bg-card p-5 shadow-sm">
    <span className="text-[11px] font-semibold tracking-widest text-[#B28A45]">{eyebrow}</span>
    <h2 className="mb-3 font-heading text-xl font-bold text-primary">{title}</h2>
    {children}
  </section>;
}