import React, { useState } from 'react';
import { Coins, Heart, ShoppingBag } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useExperience, toHbh, HBH_RATE } from '@/components/globest/ExperienceProvider';

export default function ProductPay({ product: p }) {
  const { t, state, addCart, checkout, toggleFavorite } = useExperience();
  const fav = (state.favorites || []).some(f => f.id === p.id);
  const full = toHbh(p.price); const max = Math.min(state.hbh, full);
  const [pts, setPts] = useState(0);
  const cash = Math.max(0, Number(p.price) - pts * HBH_RATE);
  const [busy,setBusy]=useState(false);
  const pay=async()=>{if(busy)return;setBusy(true);try{if(await checkout([p]))setPts(0);}finally{setBusy(false);}};
  return <div className="mt-5 space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
    <div className="flex justify-between text-sm"><span>{t('HBH 抵扣', 'Use HBH')}</span><b>{pts.toLocaleString()} / {t('余额', 'balance')} {state.hbh.toLocaleString()}</b></div>
    <Slider value={[pts]} max={max} step={10} disabled={!max} onValueChange={([v]) => setPts(v)} />
    <div className="flex justify-between text-sm"><span>{t('应付现金', 'Cash due')}</span><b>SGD {cash.toFixed(2)}</b></div>
    {cash === 0
      ? <button className="primary-btn w-full" disabled={busy} onClick={pay}><Coins size={17}/>{t(`全额 ${full.toLocaleString()} HBH 支付`, `Pay ${full.toLocaleString()} HBH`)}</button>
      : <button className="primary-btn w-full" onClick={() => addCart(p)}><ShoppingBag size={17}/>{t('加入购物车（现金 + HBH 结算）', 'Add to cart (cash + HBH)')}</button>}
    <button className="secondary-btn w-full" onClick={() => toggleFavorite(p)}><Heart size={17} fill={fav ? 'currentColor' : 'none'} className={fav ? 'text-red-500' : ''}/>{fav ? t('已收藏', 'Saved') : t('收藏商品', 'Save to favorites')}</button>
    {!max && <p className="text-xs text-muted-foreground">{t('暂无 HBH，签到、游戏、购物均可赚取', 'No HBH yet. Earn via check-in, game or shopping')}</p>}
  </div>;
}