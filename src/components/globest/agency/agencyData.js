export const HERO_IMG = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80';
export const genecells = [
  { zh: '光子抗衰', en: 'Photon Rejuvenation', spec: ['60粒/瓶', '60 caps/bottle'], partner: 160, official: 300, agent: 430, user: 530, market: 668 },
  { zh: '女性生命', en: "Women's Vitality", spec: ['90粒/瓶', '90 caps/bottle'], partner: 160, official: 300, agent: 430, user: 530, market: 668 },
  { zh: '男性力量', en: "Men's Vitality", spec: ['60粒/瓶', '60 caps/bottle'], partner: 160, official: 300, agent: 430, user: 530, market: 668 },
  { zh: '全养组合1', en: 'Total Wellness Set 1', spec: ['6瓶/盒', '6 bottles/box'], partner: 931, official: 1746, agent: 2500, user: 3080, market: 3887 },
  { zh: '全养组合2', en: 'Total Wellness Set 2', spec: ['12瓶/盒', '12 bottles/box'], partner: 1824, official: 3420, agent: 4900, user: 6042, market: 7615 },
];
export const roles = {
  partner: { zh: '合伙人', en: 'Partner', rebate: 30, payerZh: '超级管理员指定总部或上级承担', payerEn: 'HQ or designated payer, selected by super admin', oxygen: 20, cols: ['partner', 'official', 'agent', 'user', 'market'],
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80',
    pitchZh: 'HBH 重点招募与培养的核心角色。享最低拿货价（光子抗衰 S$160/瓶），可向下招募培养官方与总代，赚取级差利润、销售回款及全业 30% 返利。',
    pitchEn: 'The core role HBH recruits and trains. Lowest cost (Photon S$160/bottle), recruits Officials & General Agents below, earns margin, sales rebates and 30% all-industry rebate.' },
  official: { zh: '官方', en: 'Official', rebate: 20, oxygen: 5, cols: ['official', 'agent', 'user', 'market'], payerZh: '被介绍官方的直属合伙人支付', payerEn: 'paid by superior Partner',
    img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80',
    pitchZh: '由合伙人招募培养的门店/渠道主力。以 S$300/瓶拿货，售予总代（S$430）或用户（S$530）赚取级差；平级介绍官方获总部 8% 一次性居间奖励，并享被介绍官方的直属合伙人支付的 5%/3%/2% 销售回款（三代循环），全业产品自用或直推享 20% 分润。',
    pitchEn: 'Store/channel leaders recruited by Partners. Buy at S$300/bottle, earn the spread selling to Agents (S$430) or users (S$530). Introducing a peer Official earns an 8% one-time HQ bonus plus 5%/3%/2% sales rewards paid by the superior Partner (3-gen cycle), and 20% on all-industry self-use or direct sales.' },
  agent: { zh: '总代', en: 'General Agent', rebate: 10, payerZh: '被介绍总代的直属官方支付', payerEn: 'paid by superior Official', oxygen: 2, cols: ['agent', 'user', 'market'],
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=80',
    pitchZh: '面向终端市场的销售主力。以 S$430/瓶拿货，按用户价 S$530 销售每瓶即赚 S$100，按市场价 S$668 每瓶最高赚 S$238，并享全业 10% 返利。',
    pitchEn: 'Front-line sellers. Buy at S$430/bottle, sell at user price S$530 (+S$100) or market S$668 (up to +S$238), plus 10% all-industry rebate.' },
};
export const colLabel = { partner: ['合伙人', 'Partner'], official: ['官方', 'Official'], agent: ['总代', 'Gen. Agent'], user: ['用户', 'User'], market: ['市场价', 'Market'] };
export const oxygen = /** @type {Array<[string, string, number, number]>} */ ([
  ['放松解压，森林氧吧', 'Relax & de-stress', 180, 268], ['扶阳固本，焕发年轻态', 'Nourish Yang, rejuvenate', 258, 350],
  ['肌肉损伤，运动康复', 'Muscle recovery', 210, 300], ['睡眠调理，肌肤抗衰', 'Sleep & skin anti-aging', 220, 330],
]);
export const packages = /** @type {Array<[string, string, number]>} */ ([['10次卡', '10-session card', 1580], ['30次卡', '30-session card', 4180], ['90次卡', '90-session card', 9980]]);
export const devices = /** @type {Array<[string, string, number, string]>} */ ([
  ['护目镜', 'Goggles', 168, 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=400&q=80'],
  ['睡眠枕', 'Sleeping pillow', 168, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80'],
  ['燕窝炖盅', "Bird's nest stewer", 128, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80'],
  ['艾灸椅（送元气宝）', 'Moxibustion chair (+Energy Pack)', 1980, 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&q=80'],
]);
export const recharge = /** @type {Array<[string, number, number, string, string]>} */ ([['A', 20000, 6000, '送九珍堂野山参2盒 + 氧舱体验2次', '2 boxes wild ginseng + 2 oxygen sessions'], ['B', 10000, 2500, '送野山参1盒 + 氧舱体验1次', '1 box wild ginseng + 1 oxygen session'], ['C', 5000, 1000, '送野山参1盒', '1 box wild ginseng'], ['D', 1500, 200, '送氧舱体验1次', '1 oxygen session']]);
export const traffic = [
  ['裂变免单', 'Referral = free', '买1盒野山参3#（S$588）或新会陈皮15#（S$268），推荐2人买同款，门店全额返现', 'Buy wild ginseng 3# (S$588) or Chenpi 15# (S$268), refer 2 same purchases, get a full refund'],
  ['氧舱体验 S$66', 'Oxygen trial S$66', '凭本地居民身份证首次到店体验', 'First visit with local resident ID'],
  ['艾灸椅 S$10', 'Moxibustion S$10', '居民首次体验锁客', 'First-time resident trial'],
  ['首次到店礼', 'First-visit gift', '开业或宣传时可用', 'During openings & promotions'],
  ['直播引流', 'Live streaming', '线上实时互动，批量触达', 'Real-time reach at scale'],
  ['下载APP送礼', 'App download gift', '下载 Globest App 送精美礼品', 'Download Globest App for a gift'],
];