import React from 'react';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { LOGO_URL } from '@/components/globest/BrandLogo';

const colors = [
  ['#6CBB3C', '叶绿 · 主标志色', 'Leaf Green · Logo color', 'bg-[#6CBB3C] text-white'],
  ['#0F382C', '帝王翡翠绿 · 品牌主色', 'Imperial Jade · Primary', 'bg-[#0F382C] text-white'],
  ['#C9A063', '香槟金 · 点缀色', 'Champagne Gold · Accent', 'bg-[#C9A063] text-white'],
  ['#FBF8F4', '米白 · 背景色', 'Ivory · Background', 'bg-[#FBF8F4] text-[#111D17] border'],
];
const rules = [
  ['保持标志四周留白，至少为字母"i"叶片的高度。', 'Keep clear space around the logo at least the height of the "i" leaf.'],
  ['标志只使用叶绿色、白色（深色底）或黑色（单色印刷）。', 'Use the logo only in Leaf Green, white on dark, or black for one-color print.'],
  ['不要拉伸、旋转、加阴影或更改字母比例。', 'Do not stretch, rotate, add shadows or alter letter proportions.'],
  ['线上最小宽度 80px，印刷最小宽度 20mm。', 'Minimum width: 80px on screen, 20mm in print.'],
];

export default function BrandGuide() {
  const { t } = useExperience();
  return <div className="mx-auto max-w-4xl space-y-8 py-6">
    <header><span className="text-xs font-bold tracking-widest text-[#6CBB3C]">BRAND GUIDELINES</span><h1 className="mt-2 font-heading text-3xl font-bold">{t('iHBH 品牌指引', 'iHBH Brand Guidelines')}</h1><p className="mt-2 text-sm text-muted-foreground">{t('标志与配色规范，适用于线上、门店及印刷物料。', 'Logo and color standards for digital, store and print materials.')}</p></header>
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="flex h-48 items-center justify-center rounded-2xl border bg-white p-6"><Image src={LOGO_URL} alt="iHBH" fittingType="fit" className="h-full w-full"/></div>
      <div className="flex h-48 items-center justify-center rounded-2xl bg-[#0F382C] p-6 text-6xl font-black tracking-wide text-white">iHBH</div>
      <div className="overflow-hidden rounded-2xl border bg-white sm:col-span-2"><Image src="https://media.base44.com/images/public/6aa3280ca2d875c1b77cdd8e/8be995ee0_526.jpeg" alt={t('iHBH 黑色字标', 'iHBH black wordmark')} focalPointX={0.5} focalPointY={0.42} className="h-48 w-full"/><p className="border-t px-4 py-2 text-xs text-muted-foreground">{t('黑色字标 · 单色印刷与浅色底使用', 'Black wordmark · for one-color print and light backgrounds')}</p></div>
    </section>
    <section><h2 className="mb-3 text-xl font-bold">{t('品牌配色', 'Brand colors')}</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{colors.map(([hex, zh, en, cls]) => <div key={hex} className={`rounded-2xl p-4 ${cls}`}><div className="h-16"/><b className="block">{hex}</b><span className="text-xs opacity-80">{t(zh, en)}</span></div>)}</div></section>
    <section><h2 className="mb-3 text-xl font-bold">{t('使用规范', 'Usage rules')}</h2><ul className="space-y-2 rounded-2xl border bg-card p-5 text-sm">{rules.map(([zh, en]) => <li key={en}>• {t(zh, en)}</li>)}</ul></section>
    <section><h2 className="mb-3 text-xl font-bold">{t('品牌字体', 'Typography')}</h2><div className="rounded-2xl border bg-card p-5"><p className="font-heading text-2xl">Playfair Display · 思源宋体</p><p className="mt-1 text-sm text-muted-foreground">{t('标题使用', 'For headings')}</p><p className="mt-4 text-lg">Plus Jakarta Sans · 思源黑体</p><p className="mt-1 text-sm text-muted-foreground">{t('正文使用', 'For body text')}</p></div></section>
  </div>;
}