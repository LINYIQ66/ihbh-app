import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Globe2, Leaf, Sparkles } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';

const topics = [
  { icon: Leaf, title: ['东方食养', 'Eastern wellness'], text: ['从人参、枸杞等传统食材出发，探索适合日常的滋养方式。', 'Discover everyday rituals inspired by ingredients such as ginseng and goji.'] },
  { icon: Globe2, title: ['全球好物', 'Global finds'], text: ['浏览不同产地的健康产品，在商品详情中了解成分、规格与来源。', 'Explore wellness products from different origins, with details on ingredients, formats and sources.'] },
  { icon: Sparkles, title: ['健康生活', 'Everyday wellbeing'], text: ['结合商品、健康资讯与社区分享，找到适合自己的生活灵感。', 'Find inspiration across products, wellness reading and community stories.'] }
];

export default function AboutHBS({ onNavigate }) {
  const { t } = useExperience();
  return <div className="space-y-6 pb-2">
    <div className="rounded-xl bg-primary px-6 py-7 text-primary-foreground"><span className="text-xs tracking-widest">HBS · GLOBEST MALL</span><h3 className="mt-3 font-heading text-2xl">{t('健康产品，全球好物', 'Wellness products. Global finds.')}</h3><p className="mt-3 max-w-2xl text-sm leading-7 opacity-90">{t('HBS 关注健康、美丽与快乐。从东方食养到全球营养，我们希望让探索好物与认识健康生活变得更简单。', 'HBS is about health, beauty and happiness. From Eastern food traditions to global nutrition, we make it easier to explore products and everyday wellbeing.')}</p></div>
    <div className="grid gap-3 sm:grid-cols-3">{topics.map(({ icon: Icon, title, text }) => <div key={title[1]} className="rounded-xl border bg-card p-4"><Icon size={20} className="text-primary"/><h4 className="mt-3 font-semibold">{t(...title)}</h4><p className="mt-2 text-sm leading-6 text-muted-foreground">{t(...text)}</p></div>)}</div>
    <div><h4 className="font-heading text-lg">{t('从这里开始探索', 'Start exploring')}</h4><p className="mt-1 text-sm text-muted-foreground">{t('按关注点了解产品，或发现不同产地的食养灵感。', 'Browse by wellness interest or discover traditions from around the world.')}</p><div className="mt-4 flex flex-wrap gap-3"><Link to="/" onClick={onNavigate} className="primary-btn inline-flex items-center gap-2">{t('浏览健康产品', 'Browse products')}<ArrowUpRight size={16}/></Link><Link to="/discover?section=global" onClick={onNavigate} className="secondary-btn inline-flex items-center gap-2">{t('探索全球好物', 'Explore global finds')}<ArrowUpRight size={16}/></Link></div></div>
    <details className="border-t pt-4 text-sm text-muted-foreground"><summary className="cursor-pointer font-medium text-foreground">{t('商品资料与健康提示', 'Product sources & health notes')}</summary><div className="mt-3 space-y-2 leading-6"><p>{t('部分商品图片为设计示意；商品信息请以实际标签和商品详情为准。滋补品不能替代药物，本平台不提供医疗建议。', 'Some product imagery is illustrative; refer to the product details and actual labels. Supplements do not replace medication, and this site does not provide medical advice.')}</p><p>{t('GeneCell 的产品资料可在其官方网站查阅；本页不代表品牌经销授权。', 'GeneCell product information can be reviewed on its official site; this page does not imply distribution authorization.')}</p><a className="underline text-primary" href="https://genecell.com/product/stem-cell-force/" target="_blank" rel="noreferrer">GeneCell · STEM CELL FORCE ↗</a></div></details>
  </div>;
}