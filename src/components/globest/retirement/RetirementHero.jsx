import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import { Image } from '@/components/ui/image';

const HERO = 'https://media.base44.com/images/public/6aa3280ca2d875c1b77cdd8e/a7b65ab65_generated_image.png';
export default function RetirementHero() {
  return <section className="overflow-hidden rounded-3xl border bg-card">
    <div className="grid lg:grid-cols-2">
      <div className="flex flex-col justify-center p-6 sm:p-10">
        <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-primary"><Leaf size={18} aria-hidden="true"/>iHBH · 乐龄生活</p>
        <h1 className="mt-5 font-heading text-3xl leading-tight text-primary sm:text-5xl">退休俱乐部</h1>
        <p className="mt-4 font-heading text-2xl leading-relaxed">把时间，留给喜欢的生活。</p>
        <p className="mt-4 text-base leading-8 text-muted-foreground">有聊得来的朋友，有想学的新本领，也有慢慢发现世界的好心情。从一次相聚、一堂兴趣课、一份生活好物开始，让退休后的每一天都有期待。</p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm text-primary">{['相聚有伴', '兴趣常新', '自在生活'].map(text => <span key={text} className="rounded-full bg-muted px-3 py-2">{text}</span>)}</div>
        <div className="mt-7 flex flex-wrap gap-3"><a href="#club-life" className="primary-btn min-h-12">发现兴趣生活<ArrowRight size={17} aria-hidden="true"/></a><Link to="/events" className="outline-btn min-h-12">查看平台活动</Link></div>
      </div>
      <figure className="relative min-w-0 bg-muted">
        <Image src={HERO} alt="退休朋友在花园茶叙的生活场景示意" className="h-72 w-full object-cover sm:h-96 lg:h-full lg:min-h-[30rem]" fittingType="fill"/>
        <figcaption className="absolute bottom-3 left-3 right-3 rounded-lg bg-card/95 px-3 py-2 text-xs leading-5 text-muted-foreground">AI 生成场景示意，非俱乐部已举办活动记录。</figcaption>
      </figure>
    </div>
  </section>;
}