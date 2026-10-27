import React from 'react';
import { Copy } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function PromotionShare({ url, title }) {
  const { t, notify } = useExperience();
  const text = encodeURIComponent(title);
  const link = encodeURIComponent(url);
  const channels = [
    ['WhatsApp', `https://wa.me/?text=${text}%20${link}`],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${link}`],
    ['X', `https://twitter.com/intent/tweet?text=${text}&url=${link}`],
    ['Telegram', `https://t.me/share/url?url=${link}&text=${text}`]
  ];
  const copy = async () => { try { await navigator.clipboard.writeText(url); notify(t('推广链接已复制','Promotion link copied')); } catch { notify(t('无法复制，请手动复制链接','Could not copy; please copy the link manually')); } };
  return <div className="flex flex-wrap items-center gap-2">{channels.map(([name, href])=><a key={name} href={href} target="_blank" rel="noopener noreferrer" className="rounded-full border bg-card px-3 py-2 text-xs hover:bg-muted">{name}</a>)}<button type="button" onClick={copy} className="inline-flex items-center gap-1 rounded-full border bg-card px-3 py-2 text-xs hover:bg-muted"><Copy size={13}/>{t('复制链接','Copy link')}</button></div>;
}