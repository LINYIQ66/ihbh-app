import React from 'react';
import { ArrowUpRight, Star, Store } from 'lucide-react';
import { Image } from '@/components/ui/image';
import LocalServicePrice from '@/components/globest/local/LocalServicePrice';

export default function LocalServiceTile({ name, image, imageLabel, category, area = '新加坡', description, features = [], rating, price, estimate, deal, isDemo = false, href, onClick = undefined, actionLabel, priority = false, icon: Icon = Store }) {
  const Card = href ? 'a' : 'button';
  const actionProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { type: /** @type {const} */ ('button'), onClick };
  const hasRating = Number.isFinite(rating) && rating >= 0 && rating <= 5;
  return <Card {...actionProps} aria-label={`${name}：${actionLabel}${href ? '（新窗口打开）' : ''}`} className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card text-left text-foreground outline-none hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary">
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
      {image ? <Image src={image} alt={imageLabel === '服务示意图' ? `${category}服务示意图，非商家实景` : `${name}商家配图`} fittingType="fill" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} className="h-full w-full object-cover"/> : <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-primary/60"><Icon size={40} aria-hidden="true"/><span className="text-xs">暂无商家图片</span></div>}
      {imageLabel && image && <span className="absolute right-2 top-2 rounded bg-background/90 px-1.5 py-1 text-[10px] text-muted-foreground">{imageLabel}</span>}
      <div className="absolute inset-x-0 bottom-0 flex min-w-0 items-center gap-2 bg-background/95 px-2 py-1.5 text-[10px] sm:text-xs"><span className="shrink-0 rounded bg-primary px-1.5 py-0.5 font-medium text-primary-foreground">{isDemo ? '演示' : category}</span><span className="truncate text-muted-foreground">{area}</span></div>
    </div>
    <div className="flex flex-1 flex-col gap-2 p-2.5 sm:p-3">
      <h3 className="line-clamp-2 text-sm font-semibold leading-5 sm:text-base sm:leading-6">{name}</h3>
      {hasRating && <div className="flex items-center gap-1 text-xs font-semibold text-rewards"><Star size={13} fill="currentColor" aria-hidden="true"/>{rating.toFixed(1)} 分</div>}
      {features.length > 0 && <div className="flex flex-wrap gap-1">{features.slice(0, 2).map(feature => <span key={feature} className="max-w-full truncate rounded bg-primary/5 px-1.5 py-1 text-[10px] font-medium text-primary sm:text-xs">{feature}</span>)}</div>}
      <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{description}</p>
      <div className="mt-auto space-y-3 border-t border-border/60 pt-2.5">
        <LocalServicePrice price={price} estimate={estimate} isDemo={isDemo} deal={deal}/>
        <div className="flex justify-end"><span className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary">{actionLabel}<ArrowUpRight size={13} aria-hidden="true"/></span></div>
      </div>
    </div>
  </Card>;
}