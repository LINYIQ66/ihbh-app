import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useDiscounts, { couponOff, MEMBER_RATE } from '@/components/globest/cart/useDiscounts';
import CartDiscounts from '@/components/globest/cart/CartDiscounts';
import { Minus, Plus, ShoppingBag, Trash2, Coins } from 'lucide-react';
import { Image } from '@/components/ui/image';
import ResponsivePanel from '@/components/globest/ResponsivePanel';
import { useExperience, toHbh } from '@/components/globest/ExperienceProvider';
export default function CartPanel({ open, onOpenChange }) {
  const { state, update, t, checkout } = useExperience();
  const quantity = (id, diff) => update(s => ({ ...s, cart: s.cart.map(p => p.id === id ? { ...p, quantity: p.quantity + diff } : p).filter(p => p.quantity > 0) }));
  const visibleCart = state.cart;
  const subtotal = visibleCart.reduce((n, p) => n + p.price * p.quantity, 0);
  const { tier, coupons } = useDiscounts(); const [picked, setPicked] = useState('');
  const memberOff = Math.round(subtotal * MEMBER_RATE[tier]) / 100;
  const chosen = coupons.find(c => c.ticket.id === picked);
  const couponCut = couponOff(chosen?.rule, subtotal - memberOff);
  const total = Math.max(0, subtotal - memberOff - couponCut);
  const [busy,setBusy]=useState(false);
  const pay=async()=>{if(busy)return;setBusy(true);try{const result=await checkout(visibleCart,picked,total);if(!result)return;update(s=>({...s,cart:[]}));setPicked('');qc.invalidateQueries({queryKey:['cart-discounts']});}finally{setBusy(false);}};
  const qc = useQueryClient();
  return <ResponsivePanel open={open} onOpenChange={onOpenChange} title={t('我的购物车', 'Your cart')} description={t('您选中的商品', 'Your selected products')}>
    {!visibleCart.length ? <div className="empty-state"><ShoppingBag size={36}/><h3>{t('把好物带回家', 'Your next wellness ritual')}</h3><p>{t('购物车还是空的，去发现心仪好物吧。', 'Discover something wonderful in the mall.')}</p></div> : <><div className="space-y-4">{visibleCart.map(p => <div key={p.id} className="flex gap-3 items-center"><Image src={p.image} className="h-20 w-20 rounded-xl shrink-0"/><div className="flex-1 min-w-0"><h3 className="font-semibold text-sm">{state.lang === 'zh' ? p.name_zh : p.name_en}</h3><p className="my-2">S${p.price.toFixed(2)}</p><div className="flex items-center gap-3"><button className="icon-btn" onClick={() => quantity(p.id, -1)} aria-label="Decrease"><Minus size={14}/></button><span>{p.quantity}</span><button className="icon-btn" onClick={() => quantity(p.id, 1)} aria-label="Increase"><Plus size={14}/></button></div></div><button className="icon-btn" aria-label="Remove" onClick={() => quantity(p.id, -p.quantity)}><Trash2 size={16}/></button></div>)}</div><CartDiscounts subtotal={subtotal} tier={tier} coupons={coupons} picked={picked} onPick={setPicked} memberOff={memberOff}/>{total < subtotal && <div className="mt-3 flex justify-between text-sm text-muted-foreground"><span>{t('原价', 'Subtotal')}</span><s>S${subtotal.toFixed(2)}</s></div>}<div className="mt-6 border-t pt-5 flex justify-between font-semibold text-xl"><span>{t('合计', 'Total')}</span><span>S${total.toFixed(2)}</span></div><div className="mt-2 flex justify-between text-sm text-amber-600"><span>{t(`HBH 余额 ${state.hbh.toLocaleString()}`, `HBH balance ${state.hbh.toLocaleString()}`)}</span><b>{toHbh(total).toLocaleString()} HBH</b></div><button className="primary-btn mt-4 w-full" disabled={busy || state.hbh < toHbh(total)} onClick={pay}><Coins size={17}/>{state.hbh < toHbh(total) ? t('HBH 余额不足', 'Not enough HBH') : t(`用 ${toHbh(total).toLocaleString()} HBH 支付`, `Pay ${toHbh(total).toLocaleString()} HBH`)}</button><p className="muted mt-2 text-center text-xs">{t('1 HBH = S$0.10 · 每消费 S$1 返 0.5 HBH', '1 HBH = S$0.10 · Earn 0.5 HBH per S$1')}</p></>}
  </ResponsivePanel>;
}