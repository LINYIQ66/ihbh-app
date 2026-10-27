import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Phone, Tag } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useExperience } from '@/components/globest/ExperienceProvider';
import BookingFlow from '@/components/globest/local/BookingFlow';

const reviews = /** @type {Array<[string, string, number]>} */ ([['服务很专业，价格透明，会再来！', 'Professional and transparent pricing, will return!', 5], ['环境舒适，准时开始。', 'Comfortable and on time.', 4]]);

export default function MerchantDetail({ merchant: x, startBooking, onClose }) {
  const { t } = useExperience(); const [booking, setBooking] = useState(false);
  useEffect(() => setBooking(!!startBooking), [x, startBooking]);
  return <Sheet open={!!x} onOpenChange={o => !o && onClose()}>
    <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-lg">{x && <>
      <img src={x.image} alt="" className="aspect-video w-full object-cover" />
      <div className="space-y-4 p-5 pb-28">
        <div><SheetTitle className="text-2xl font-bold">{t(x.zh, x.en)}</SheetTitle>
          <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground"><span className="flex items-center gap-1 font-bold text-orange-500"><Star size={14} fill="currentColor" />{x.rating} ({x.reviews})</span><span className="flex items-center gap-1 text-green-600"><Clock size={14} />{t('营业中', 'Open now')}</span><span>{t('人均', 'Avg')} S${x.avg}</span></div>
          <p className="mt-2 flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"><Tag size={14} />{t(...x.deal)}</p></div>
        {booking ? <BookingFlow merchant={x} onDone={onClose} /> : <>
          <section><h4 className="mb-2 font-bold">{x.cat === 'food' ? t('菜单 / 套餐', 'Menu & sets') : t('服务项目', 'Services')}</h4>{x.services.map(s => <div key={s[1]} className="flex justify-between border-b border-border py-2 text-sm"><span>{t(s[0], s[1])}</span><b>S${s[2]}</b></div>)}</section>
          <section><h4 className="mb-2 font-bold">{t('用户评价', 'Reviews')}</h4>{reviews.map(r => <p key={r[1]} className="mb-2 rounded-lg bg-muted p-3 text-sm">{'★'.repeat(r[2])} {t(r[0], r[1])}</p>)}</section>
          <section><h4 className="mb-2 font-bold">{t('位置', 'Location')}</h4><a className="flex items-center gap-1 text-sm text-orange-600" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps?q=${x.lat},${x.lng}`}><MapPin size={14} />{x.area}, Singapore · {x.km}km</a></section>
        </>}
      </div>
      {!booking && <div className="fixed bottom-0 right-0 flex w-full gap-2 border-t border-border bg-card p-3 sm:max-w-lg">
        <a href={x.phone ? `https://wa.me/${x.phone.replace(/\D/g, '')}` : 'https://wa.me/'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-full border border-border px-4 py-2.5 text-sm font-semibold"><Phone size={15} />{t('联系商家', 'Contact')}</a>
        <button onClick={() => setBooking(true)} className="flex-1 rounded-full border-2 border-orange-500 py-2.5 text-sm font-bold text-orange-600">{t('购买', 'Buy')}</button>
        <button onClick={() => setBooking(true)} className="flex-1 rounded-full bg-orange-500 py-2.5 text-sm font-bold text-white">{t('预约', 'Book')}</button>
      </div>}
    </>}</SheetContent>
  </Sheet>;
}