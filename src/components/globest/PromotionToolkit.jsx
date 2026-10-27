import React, { useEffect, useRef, useState } from 'react';
import { Download, Share2, Copy } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import PromotionShare from '@/components/globest/PromotionShare';
import { inviteUrl } from '@/components/globest/promotionLinks';
import { drawPromotionPoster } from '@/components/globest/drawPromotionPoster';

export default function PromotionToolkit({ code }) {
  const { state, t, notify } = useExperience();
  const canvas = useRef(null);
  const [poster, setPoster] = useState('');
  const [error, setError] = useState('');
  const link = inviteUrl(code);
  const copyText = t(`和我一起探索健康生活！使用我的邀约码 ${code} 注册 Globest Mall：${link}`, `Explore everyday wellness with me! Join Globest Mall with my invite code ${code}: ${link}`);
  useEffect(()=>{ let active=true; setPoster(''); setError(''); drawPromotionPoster(canvas.current,code,link,state.lang).then(el=>{if(active)setPoster(el.toDataURL('image/png'));}).catch(()=>{if(active)setError(t('海报暂时无法生成，请使用文案和链接分享。','Poster unavailable; you can still share the message and link.'));});return()=>{active=false;}; },[code,link,state.lang]);
  const copy = async()=>{try{await navigator.clipboard.writeText(copyText);notify(t('推广文案已复制','Promotion message copied'));}catch{setError(t('复制失败，请手动复制文案。','Copy failed; please copy the message manually.'));}};
  const download = ()=>{const a=document.createElement('a');a.href=poster;a.download=`globest-invite-${code}.png`;a.click();};
  const share = async()=>{
    const blob=await new Promise(resolve=>canvas.current.toBlob(resolve,'image/png'));
    if(!blob){setError(t('海报生成失败','Could not prepare poster'));return;}
    const file=new File([blob],`globest-invite-${code}.png`,{type:'image/png'});
    if(navigator.canShare?.({files:[file]}) && navigator.share){try{await navigator.share({files:[file],title:'Globest Mall',text:copyText,url:link});}catch(err){if(err.name!=='AbortError')setError(t('分享失败，请下载海报后上传。','Sharing failed; download the poster to upload it.'));}}
    else {download();notify(t('海报已下载，可上传至社交平台。','Poster downloaded; upload it to your social channel.'));}
  };
  return <section className="rounded-2xl border bg-card p-5 sm:p-7"><h2 className="font-heading text-2xl text-primary">{t('我的推广工具包','My promotion toolkit')}</h2><p className="mt-2 text-sm text-muted-foreground">{t('专属海报和邀约文案，分享给好友或发布到社交平台。','Your personal poster and invite message, ready for social sharing.')}</p><div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,340px)_1fr]"><div>{poster?<img src={poster} alt={t('带专属邀约码和二维码的推广海报','Promotion poster with invite code and QR code')} className="w-full rounded-xl shadow-md"/>:<div className="flex aspect-[4/5] items-center justify-center rounded-xl bg-muted text-sm">{error||t('正在制作海报…','Creating your poster…')}</div>}<div className="mt-3 flex flex-wrap gap-2"><button disabled={!poster} onClick={download} className="primary-btn"><Download size={16}/>{t('下载海报','Download poster')}</button><button disabled={!poster} onClick={share} className="rounded-lg border px-4 py-2 inline-flex items-center gap-2"><Share2 size={16}/>{t('分享图片','Share image')}</button></div></div><div><label className="text-sm font-semibold">{t('带邀约码的推广文案','Promotion message with your code')}</label><textarea readOnly value={copyText} rows={5} className="mt-2 w-full rounded-lg border bg-background p-3 text-sm"/><button onClick={copy} className="mt-3 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"><Copy size={15}/>{t('复制文案','Copy message')}</button><p className="mb-3 mt-6 text-sm font-semibold">{t('分享邀约链接','Share invite link')}</p><PromotionShare url={link} title={copyText}/><p className="mt-3 text-xs text-muted-foreground">{t('移动设备可直接分享图片；其他设备请下载海报后上传到社交平台。','On supported devices, share the image directly; otherwise download it and upload it to your social platform.')}</p></div></div>{error&&poster&&<p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}<canvas ref={canvas} className="hidden"/></section>;
}