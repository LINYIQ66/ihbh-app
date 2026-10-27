import React from 'react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import { SERVICE_FEE_RATE, DELIVERY_FEE } from '@/components/globest/local/localLifeData';

export function calcTotal(price, qty, delivery) {
  const subtotal = price * qty, fee = +(subtotal * SERVICE_FEE_RATE).toFixed(2), ship = delivery ? DELIVERY_FEE : 0;
  return { subtotal, fee, ship, total: +(subtotal + fee + ship).toFixed(2) };
}

export default function PriceSummary({ price, qty, delivery }) {
  const { t } = useExperience(); const c = calcTotal(price, qty, delivery);
  const row = (l, v) => <div className="flex justify-between"><span>{l}</span><span>S${v.toFixed(2)}</span></div>;
  return <div className="space-y-1 rounded-xl bg-muted p-3 text-sm">
    {row(t(`服务金额 ×${qty}`, `Subtotal ×${qty}`), c.subtotal)}
    {row(t('平台服务费 (3%)', 'Service fee (3%)'), c.fee)}
    {row(t('配送费', 'Delivery fee'), c.ship)}
    <div className="flex justify-between border-t border-border pt-1 font-bold text-orange-600"><span>{t('应付总额', 'Total')}</span><span>S${c.total.toFixed(2)}</span></div>
  </div>;
}