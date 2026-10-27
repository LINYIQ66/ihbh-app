import { genecells, roles } from '@/components/globest/agency/agencyData';

export const dealerLevelKeys = ['partner', 'official', 'agent'];
const descriptions = {
  partner: { label: '核心合作', intro: '参与 HBH 渠道建设与经营协作，了解合伙人拿货价格、产品返利及体验支持。', channel: '作为重点招募与培养的核心合作角色，可协作培养官方与总代，具体渠道授权以协议为准。' },
  official: { label: '门店与渠道', intro: '面向门店及渠道经营，了解官方拿货价格、销售协作和专属体验权益。', channel: '由合伙人招募与培养，面向总代及终端用户开展销售，按本级价格与授权范围协作。' },
  agent: { label: '终端销售', intro: '面向终端市场开展产品服务，了解总代拿货价格、用户销售及专属体验权益。', channel: '面向终端用户销售，按总代拿货价格与用户价格形成商品毛差额，具体经营范围以授权为准。' }
};
export const dealerDiscount = (cost, reference) => (cost / reference * 10).toFixed(2);
export function getDealerTier(key) {
  if (!dealerLevelKeys.includes(key)) return null;
  return { ...roles[key], ...descriptions[key], key, cost: genecells[0][key], reference: genecells[0].user, discount: dealerDiscount(genecells[0][key], genecells[0].user) };
}