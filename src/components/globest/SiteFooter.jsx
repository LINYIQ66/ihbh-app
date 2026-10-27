import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import ResponsivePanel from '@/components/globest/ResponsivePanel';
import { legalDocs } from '@/components/globest/legalDocs';


const cols = /** @type {Array<[Array<string>, Array<Array<string>>]>} */ ([
  [['品牌历史', 'Our Heritage'], [['香港九珍堂源自传统滋补世家，专注野山参与道地药材。', 'Hong Kong Jiuzhentang grew from a family tradition of tonics, specialising in wild ginseng and authentic herbs.'], ['HBH 延续东方养生智慧，结合现代细胞健康科学。', 'HBH carries Eastern wellness wisdom into modern cellular-health science.'], ['Globest Mall 立足新加坡，连接全球健康好物。', 'Globest Mall is based in Singapore, connecting wellness finds worldwide.']]],
  [['购物指南', 'Shopping'], [['全部商品', 'All products', '/'], ['HBH专区', 'HBH Zone', '/discover?section=hbh'], ['全球好物', 'Global Finds', '/discover?section=global'], ['网购达人课堂', 'Smart Shopper classes', '/discover?section=merchants']]],
  [['会员与合作', 'Members & Partners'], [['我的中心', 'My Center', '/crm?role=user&tab=account'], ['商家入驻', 'Merchant onboarding', '/partner'], ['品牌指引', 'Brand guidelines', '/brand'], ['社区', 'Community', '/feed'], ['直播', 'Live', '/live']]],
  [['法律条款', 'Legal'], [['用户服务协议', 'Terms of Service', '#terms'], ['隐私政策 (符合新加坡 PDPA)', 'Privacy Policy (Singapore PDPA)', '#privacy'], ['退换货政策', 'Returns & Refunds', '#returns'], ['自营价格以新币 SGD 计价；外部商品以标示币种为准', 'Own-store prices in SGD; external listings use their displayed currency']]],
]);

export default function SiteFooter() {
  const t = (zh, _en = '') => zh;
  const [doc, setDoc] = useState(null); const d = doc && legalDocs[doc];
  return <footer className="site-footer mt-10 rounded-2xl bg-[#1f1f1f] p-6 text-[#ddd] md:p-8">
    <Link to="/join" className="mb-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#0F382C] to-[#6CBB3C] p-4 text-white"><div><b className="block text-lg">{t('全球招募：让用户更省钱，创业更轻松', 'Join us: save more, start easier')}</b><span className="text-xs">{t('不止于商城，更是平方生活的连接', 'More than a mall: connecting everyday life')}</span></div><ArrowUpRight /></Link>
    <ResponsivePanel open={!!d} onOpenChange={o => !o && setDoc(null)} title={d && t(d.zh, d.en)} description={t('最后更新：2026年10月', 'Last updated: Oct 2026')}>{d && <div className="space-y-4 text-sm leading-relaxed text-foreground">{d.body.map(([hz, he, bz, be]) => <section key={he}><h4 className="mb-1 font-bold">{t(hz, he)}</h4><p className="text-muted-foreground">{t(bz, be)}</p></section>)}</div>}</ResponsivePanel>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{cols.map(([title, items]) => <div key={title[1]}>
      <h3 className="mb-3 text-lg font-extrabold text-[#ff7a00]">{t(...title)}</h3>
      <ul className="space-y-2 text-sm leading-relaxed">{items.map(([zh, en, to]) => <li key={en}>{to?.startsWith('#') ? <button onClick={() => setDoc(to.slice(1))} className="text-left underline-offset-2 hover:text-white hover:underline">{t(zh, en)}</button> : to ? <Link to={to} className="hover:text-white">{t(zh, en)}</Link> : t(zh, en)}</li>)}</ul>
    </div>)}</div>
    <div className="mt-6 border-t border-[#333] pt-4 text-xs leading-relaxed text-[#999]">
      <p className="text-base font-black text-white">GLOBEST MALL · {t('新加坡 · 香港九珍堂', 'SINGAPORE · HK JIUZHENTANG')}</p>
      <p className="mt-2">{t('免责声明：滋补品及保健食品不能替代药物，商品信息与 AI 建议仅供参考，不构成医疗建议。如有健康问题请咨询专业医生。', 'Disclaimer: supplements do not replace medication. Product information and AI suggestions are for reference only and are not medical advice. Consult a doctor for health concerns.')}</p>
      <p className="mt-1">© {new Date().getFullYear()} Globest Mall. {t('保留所有权利。', 'All rights reserved.')}</p>
    </div>
  </footer>;
}