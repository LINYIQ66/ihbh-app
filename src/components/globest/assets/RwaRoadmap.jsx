import React from 'react';
import { Lock } from 'lucide-react';

const layers = /** @type {Array<[string, string, boolean]>} */ ([['链下积分账本', 'HBH 积分 · 幂等记账 · 已上线', true], ['钱包身份层', 'Phantom 签名绑定 · 已上线', true], ['合规审查层', 'MAS / 法律意见 / KYC · 待开放', false], ['链上资产层', 'Solana RWA Token（SPL）· 待开放', false]]);
const gates = ['真实底层资产确权', '合法权益结构与发行文件', '新加坡 MAS 合规审查通过', '托管与审计机构就位'];

export default function RwaRoadmap() {
  return <section className="rounded-2xl bg-card p-4">
    <h3 className="font-bold">RWA 资产架构</h3>
    <p className="mb-3 text-[11px] text-muted-foreground">积分与链上资产分账管理，两套账本互不混用。</p>
    <div className="space-y-1.5">{layers.map(([n, d, on], i) => <div key={n} className={`flex items-center justify-between rounded-lg p-2.5 text-sm ${on ? 'bg-[#6CBB3C]/15' : 'bg-muted'}`}><span><b>L{i + 1} {n}</b><p className="text-[11px] text-muted-foreground">{d}</p></span>{on ? <span className="text-xs font-bold text-[#3d7a1f]">LIVE</span> : <Lock size={14} className="text-muted-foreground"/>}</div>)}</div>
    <h4 className="mt-3 text-xs font-bold">开放链上转换前须满足：</h4>
    <ul className="mt-1 space-y-1 text-[11px] text-muted-foreground">{gates.map(g => <li key={g}>○ {g}</li>)}</ul>
    <button disabled className="mt-3 w-full rounded-xl border py-2.5 text-sm text-muted-foreground"><Lock size={13} className="mr-1 inline"/>转换为 RWA Token（合规条件满足后开放）</button>
  </section>;
}