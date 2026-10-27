import React from 'react';
import { couponOff, MEMBER_RATE } from './useDiscounts';

export default function CartDiscounts({ subtotal, tier, coupons, picked, onPick, memberOff }) {
  if (!memberOff && !coupons.length) return null;
  return <div className="mt-4 space-y-2 rounded-xl bg-muted p-3 text-sm">
    {memberOff > 0 && <div className="flex justify-between"><span>会员折扣（{MEMBER_RATE[tier]}%）</span><b className="text-green-700">−S${memberOff.toFixed(2)}</b></div>}
    {coupons.length > 0 && <select value={picked || ''} onChange={e => onPick(e.target.value)} className="w-full rounded border bg-card px-2 py-2">
      <option value="">不使用优惠券</option>
      {coupons.map(({ ticket, rule }) => { const off = couponOff(rule, subtotal); return <option key={ticket.id} value={ticket.id} disabled={!off}>{rule.title} · {rule.rule}{off ? ` (−S$${off.toFixed(2)})` : '（未满足条件）'}</option>; })}
    </select>}
  </div>;
}