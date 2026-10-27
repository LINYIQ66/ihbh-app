import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useExperience, toHbh } from '@/components/globest/ExperienceProvider';
import PriceSummary, { calcTotal } from '@/components/globest/local/PriceSummary';

export default function BookingFlow({ merchant: x, onDone }) {
  const { t, update, notify, state, spendHbh } = useExperience(); const [useHbh, setUseHbh] = useState(false);
  const [svc, setSvc] = useState(0); const [slot, setSlot] = useState(null); const [mode, setMode] = useState('dinein'); const [qty, setQty] = useState(1); const [busy, setBusy] = useState(false);
  const s = x.services[svc]; const delivery = mode === 'delivery';
  const pill = (on) => `rounded-full border px-3 py-1.5 text-sm ${on ? 'border-orange-500 bg-orange-50 font-bold text-orange-600' : 'border-border'}`;
  const confirm = async () => {
    setBusy(true);
    if (!(await base44.auth.isAuthenticated())) { base44.auth.redirectToLogin(window.location.href); return; }
    const sum = calcTotal(s[2], qty, delivery).total;
    if (useHbh && !spendHbh(toHbh(sum), sum)) { setBusy(false); return; }
    const order = { paidHbh: useHbh ? toHbh(sum) : 0, id: `L${Date.now()}`, merchantId: x.id, zh: x.zh, en: x.en, service: [s[0], s[1]], slot: delivery || mode === 'pickup' ? null : slot, mode, qty, total: calcTotal(s[2], qty, delivery).total, createdAt: Date.now() };
    update(st => ({ ...st, localOrders: [order, ...(st.localOrders || [])] }));
    notify(t('预约成功，商家确认中', 'Booked! Waiting for merchant confirmation')); setBusy(false); onDone();
  };
  const needSlot = !(delivery || mode === 'pickup');
  return <div className="space-y-4">
    <Step n="1" title={t('选择服务', 'Choose service')}><div className="space-y-2">{x.services.map((v, i) => <button key={v[1]} onClick={() => setSvc(i)} className={`flex w-full justify-between rounded-xl border p-3 text-left text-sm ${i === svc ? 'border-orange-500 bg-orange-50' : 'border-border'}`}><span>{t(v[0], v[1])} · {v[3]}{t('分钟', 'min')}</span><b className="text-orange-600">S${v[2]}</b></button>)}</div>
      <div className="mt-2 flex items-center gap-2 text-sm">{t('数量/人数', 'Qty / pax')}<button className={pill(false)} onClick={() => setQty(Math.max(1, qty - 1))}>−</button><b>{qty}</b><button className={pill(false)} onClick={() => setQty(qty + 1)}>+</button></div></Step>
    <Step n="2" title={t('选择时间', 'Choose time')}>
      {x.cat === 'food' && <div className="mb-2 flex flex-wrap gap-2">{[['dinein', '堂食订座', 'Dine-in'], ['delivery', '外卖', 'Delivery'], ['pickup', '自取', 'Pickup']].map(([k, zh, en]) => <button key={k} className={pill(mode === k)} onClick={() => setMode(k)}>{t(zh, en)}</button>)}</div>}
      {needSlot ? <div className="flex flex-wrap gap-2">{x.slots.map(v => <button key={v} className={pill(slot === v)} onClick={() => setSlot(v)}>{t('今天', 'Today')} {v}</button>)}</div> : <p className="text-sm text-muted-foreground">{t('预计 30–45 分钟', 'Est. 30–45 min')}</p>}</Step>
    <Step n="3" title={t('确认并支付', 'Confirm & pay')}><PriceSummary price={s[2]} qty={qty} delivery={delivery} />
      <label className="mt-2 flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm"><span>{t(`用 HBH 支付 ${toHbh(calcTotal(s[2], qty, delivery).total).toLocaleString()}（余额 ${state.hbh.toLocaleString()}）`, `Pay ${toHbh(calcTotal(s[2], qty, delivery).total).toLocaleString()} HBH (balance ${state.hbh.toLocaleString()})`)}</span><input type="checkbox" checked={useHbh} onChange={e => setUseHbh(e.target.checked)} /></label>
      <button disabled={busy || (needSlot && !slot)} onClick={confirm} className="mt-3 w-full rounded-full bg-orange-500 py-3 font-bold text-white disabled:opacity-50">{busy ? t('处理中…', 'Processing…') : needSlot && !slot ? t('请先选择时间', 'Pick a time first') : t('确认预约', 'Confirm booking')}</button>
      <p className="mt-1 text-center text-[11px] text-muted-foreground">{t('演示版：暂不扣款，在线支付即将开放', 'Demo: no charge yet, online payment coming soon')}</p></Step>
  </div>;
}

function Step({ n, title, children }) {
  return <section className="border-l-2 border-orange-200 pl-4"><h4 className="-ml-[27px] mb-2 flex items-center gap-2 font-bold"><span className="grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[11px] text-white">{n}</span>{title}</h4>{children}</section>;
}