import React, { useState, useEffect } from 'react';
import { Share2, Gift } from 'lucide-react';
import { Image } from '@/components/ui/image';
import ResponsivePanel from '@/components/globest/ResponsivePanel';
import { useExperience } from '@/components/globest/ExperienceProvider';
export default function ArticlePanel({ article:a, onClose }) {
  const {t,claim,claimed,notify,readStart} = useExperience(); const [seconds,setSeconds] = useState(15);
  useEffect(() => {setSeconds(15); if (!a) return; readStart(a.id); const timer=setInterval(() => {if(document.visibilityState === 'visible') setSeconds(s=>Math.max(0,s-1));},1000);return ()=>clearInterval(timer);},[a?.id]);
  const share = async () => {try {await navigator.clipboard.writeText(window.location.href);notify(t('文章链接已复制。分享奖励待真实邀约验证后开放。', 'Article link copied. Sharing rewards require verified referrals.'));}catch {notify(t('请复制浏览器地址栏分享', 'Copy the address bar URL to share'));}};
  return <ResponsivePanel open={!!a} onOpenChange={onClose} title={a ? t(...a.title) : ''} description={t('Globest 滋养手记 · 一般健康知识', 'Globest journal · General wellness information')}>{a && <><Image src={a.image} className="w-full h-52 rounded-xl mb-6" fittingType="fit"/>{a.body.map((paragraph,i)=><p key={i} className="leading-8 mb-5">{t(...paragraph)}</p>)}{a.id === 'nutrition' && <a href="https://genecell.com/product/stem-cell-force/" rel="noreferrer" target="_blank" className="underline">GeneCell · STEM CELL FORCE ↗</a>}<div className="flex flex-wrap gap-3 mt-6"><button className="primary-btn flex-1" disabled={seconds > 0 || claimed(`read-${a.id}`)} onClick={()=>claim(`read-${a.id}`,10)}><Gift size={16}/>{claimed(`read-${a.id}`) ? t('今日阅读奖励已领取', 'Today’s reading reward claimed') : seconds > 0 ? t(`阅读 ${seconds} 秒后领取`, `Read for ${seconds}s to claim`) : t('领取 +10 HBH', 'Claim +10 HBH')}</button><button className="outline-btn" onClick={share}><Share2 size={16}/>{t('分享', 'Share')}</button></div></>}</ResponsivePanel>;
}