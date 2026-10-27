import React from 'react';
import { ShieldAlert, Cpu, Leaf } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import HerbTeaHero from '@/components/globest/herbtea/HerbTeaHero';
import Fade from '@/components/globest/herbtea/Fade';
import { IMG, nav, steps, specs, teas, notes } from '@/components/globest/herbtea/herbTeaData';

const H = ({ e, children }) => <div className="mb-4"><span className="text-[11px] font-bold tracking-widest text-[#B28A45]">{e}</span><h2 className="font-heading text-2xl font-bold">{children}</h2></div>;

export default function HerbTea() {
  const { t } = useExperience();
  return <div className="page-inner mx-auto max-w-4xl space-y-10 pb-12">
    <HerbTeaHero/>
    <nav className="sticky top-2 z-20 flex gap-2 overflow-x-auto rounded-full border bg-background/90 p-1.5 backdrop-blur">{nav.map(([id, zh, en]) => <a key={id} href={`#${id}`} className="shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">{t(zh, en)}</a>)}</nav>

    <section id="about" className="scroll-mt-20 grid items-center gap-5 sm:grid-cols-2">
      <Fade><img src={IMG.tea} alt="" className="h-64 w-full rounded-3xl object-cover shadow-xl"/></Fade>
      <Fade delay={.15}><H e="ABOUT">{t('关于 AI 中医凉茶铺', 'About the tea bar')}</H><p className="text-sm leading-relaxed text-muted-foreground">{t('我们把传统中医"望闻问切"与 AI 体质分析结合，打造品牌体验门店：扫码检测、AI 辨证、推荐对应凉茶，现场制作。让每一位顾客在几分钟内了解自己的体质倾向，并喝到一杯为自己调配的草本凉茶。', 'We blend classic TCM observation with AI constitution analysis: scan, read your pattern, get a matched herbal tea brewed live — all in a few minutes.')}</p></Fade>
    </section>

    <section id="flow" className="scroll-mt-20"><H e="JOURNEY">{t('门店体验流程', 'In-store journey')}</H>
      <div className="grid gap-3 sm:grid-cols-2">{steps.map(([n, zh, en, dz, de], i) => <Fade key={n} delay={i * .06}><div className="group flex gap-4 rounded-2xl border bg-card p-4 transition hover:-translate-y-1 hover:shadow-lg"><b className="font-heading text-3xl text-[#E4C88A] transition group-hover:text-[#6CBB3C]">{n}</b><div><b>{t(zh, en)}</b><p className="mt-1 text-xs text-muted-foreground">{t(dz, de)}</p></div></div></Fade>)}</div>
    </section>

    <section id="tech" className="scroll-mt-20 rounded-3xl bg-[#0F382C] p-6 text-white"><div className="mb-4 flex items-center gap-2 text-[#E4C88A]"><Cpu size={18}/><span className="text-[11px] font-bold tracking-widest">TECHNOLOGY</span></div><h2 className="mb-5 font-heading text-2xl font-bold">{t('智能四诊设备能力', 'Smart four-diagnosis capabilities')}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{specs.map(([zh, en, dz, de], i) => <Fade key={en} delay={i * .07}><div className="h-full rounded-2xl bg-white/10 p-4 transition hover:bg-white/20"><b className="text-[#E4C88A]">{t(zh, en)}</b><p className="mt-1 text-[11px] leading-relaxed text-white/75">{t(dz, de)}</p></div></Fade>)}</div>
      <p className="mt-4 text-[11px] text-white/60">{t('以上为选型方向参考，具体能力以最终合作设备为准。', 'Indicative selection criteria; final capabilities depend on the chosen device.')}</p>
    </section>

    <section id="teas" className="scroll-mt-20"><H e="SIGNATURE TEAS">{t('体质对应凉茶', 'Teas by constitution')}</H>
      <Fade><img src={IMG.herbs} alt="" className="mb-4 h-48 w-full rounded-3xl object-cover"/></Fade>
      <div className="grid gap-3 sm:grid-cols-2">{teas.map(([zh, en, kz, ke, herbs], i) => <Fade key={en} delay={i * .08}><div className="rounded-2xl border-l-4 border-[#6CBB3C] bg-[#F5EFE3] p-4"><b className="flex items-center gap-2"><Leaf size={15} className="text-[#6CBB3C]"/>{t(zh, en)}</b><p className="mt-1 text-xs text-muted-foreground">{t(kz, ke)}</p><p className="mt-2 text-xs font-semibold text-[#B28A45]">{herbs}</p></div></Fade>)}</div>
    </section>

    <section id="compliance" className="scroll-mt-20 rounded-3xl border-2 border-dashed border-[#B28A45]/50 p-5"><b className="flex items-center gap-2 text-[#9b2c22]"><ShieldAlert size={18}/>{t('重要提示', 'Important')}</b><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{notes.map(([zh, en]) => <li key={en}>• {t(zh, en)}</li>)}</ul></section>
  </div>;
}