import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Compass } from 'lucide-react';

export default function SiteMapHero() {
  return <>
    <nav className="site-map-breadcrumb" aria-label="当前位置">
      <Link to="/"><ArrowLeft size={15} aria-hidden="true" />返回首页</Link>
      <ChevronRight size={13} aria-hidden="true" /><span aria-current="page">更多</span>
    </nav>
    <header className="site-map-hero" aria-labelledby="site-map-title">
      <div className="site-map-hero-copy">
        <span className="site-map-kicker"><span aria-hidden="true" />全站导航 · 一站直达</span>
        <h1 id="site-map-title">更多精彩，<br />从这里发现。</h1>
        <p>好物、生活、课堂与会员服务，<br className="sm:hidden" />每一个入口，都为你整理妥当。</p>
        <span className="site-map-hero-caption">好物相链　商业相通</span>
      </div>
      <div className="site-map-compass" aria-hidden="true">
        <span className="site-map-compass-ring" /><Compass strokeWidth={0.8} />
        <span className="site-map-compass-label">探索 · 连接 · 发现</span>
      </div>
    </header>
  </>;
}