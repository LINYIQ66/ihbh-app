import React from 'react';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function InviteQRCode({ link }) {
  const { t } = useExperience();
  return <div className="flex shrink-0 flex-col items-center gap-2 rounded-xl bg-card p-3 text-center text-foreground">
    <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(link)}`} alt={t('扫码打开专属邀请链接','Scan to open your invite link')} className="h-40 w-40" fittingType="fit" />
    <small className="text-xs text-muted-foreground">{t('扫码注册 · 自动关联邀约码','Scan to register with your invite code')}</small>
  </div>;
}