import React from 'react';
import { Link } from 'react-router-dom';
import { UsersRound, BookOpen, Compass, Leaf, Gift, MapPin, ArrowUpRight } from 'lucide-react';

const DIRECTIONS = [
  { Icon: UsersRound, title: '相聚有伴', tag: '聚会与交流', detail: '从平台公开沙龙与活动开始，找到适合自己的交流机会。时间、地点和参与规则以活动页面为准。', to: '/events', action: '浏览平台活动' },
  { Icon: BookOpen, title: '兴趣常新', tag: '课堂与手作', detail: '连接现有巧掌柜课堂，看看食养、手作与生活知识。按自己的节奏，学一点喜欢的新本领。', to: '/discover?section=merchants', action: '进入巧掌柜课堂' },
  { Icon: Compass, title: '出游慢一点', tag: '出游需求咨询', detail: '小团慢游、城市漫步与文化体验，都是值得期待的方向。俱乐部专属线路与团费支付暂未开放。', to: '/help#contact', action: '咨询出游需求' },
  { Icon: Leaf, title: '生活有滋养', tag: '日常健康知识', detail: '了解现有 HBH 食养与健康生活内容，重视规律生活与科学认知。科普内容不替代专业诊疗。', to: '/discover?section=hbh', action: '浏览健康生活内容' },
  { Icon: MapPin, title: '身边有好去处', tag: '本地生活发现', detail: '发现身边的生活信息与社区灵感。商户资料、服务开放状态和实际规则以现有页面披露为准。', to: '/discover?section=local', action: '发现本地生活' },
  { Icon: Gift, title: '好物一起发现', tag: '生活好物参考', detail: '按自己的需要了解全球生活好物。外部商品仅作发现参考，购买、支付与履约由对应商家负责。', to: '/discover?section=global', action: '看看全球好物' },
];
export default function RetirementLife() {
  return <section id="club-life" aria-labelledby="club-life-title">
    <p className="text-sm font-semibold text-primary">不赶时间，也不辜负时间</p><h2 id="club-life-title" className="mt-2 font-heading text-2xl sm:text-3xl">六种方式，打开退休新日常</h2>
    <p className="mb-6 mt-3 text-base leading-8 text-muted-foreground">聚会、兴趣、出游、健康与好物，通过现有平台内容慢慢探索。</p>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{DIRECTIONS.map(({ Icon, title, tag, detail, to, action }) => <article key={title} className="flex flex-col rounded-2xl border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-primary"><Icon size={25} aria-hidden="true"/></span><span className="text-xs text-muted-foreground">{tag}</span></div>
      <h3 className="mt-5 text-xl font-semibold text-primary">{title}</h3><p className="mb-4 mt-3 flex-1 text-base leading-8 text-muted-foreground">{detail}</p>
      <Link to={to} className="inline-flex min-h-12 items-center justify-between gap-2 border-t pt-3 text-base font-semibold text-primary">{action}<ArrowUpRight size={18} aria-hidden="true"/></Link>
    </article>)}</div>
  </section>;
}