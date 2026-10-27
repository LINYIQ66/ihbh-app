import { LayoutGrid, Link2, Video } from 'lucide-react';

const img = name => `https://kopiagent.amt.land/hbh-bp/img/${name}`;

export const channels = [
  { icon: '💚', zh: 'HBH专区', en: 'HBH Zone', to: '/discover?section=hbh' },
  { icon: '🌐', zh: '全球好物', en: 'Global', to: '/discover?section=global' },
  { icon: '📍', zh: '本地生活', en: 'Local', to: '/discover?section=local' },
  { icon: '🎓', zh: '巧掌柜课堂', en: 'Classes', to: '/discover?section=merchants' },
  { icon: '🤖', zh: 'AI 问答', en: 'AI Advisor', to: '/assistant' },
  { icon: '📺', zh: '直播', en: 'Live', to: '/live' },
  { Icon: Video, zh: '视频', en: 'Videos', to: '/live?tab=videos' },
  { icon: '🎁', zh: '积分资产', en: 'Points assets', to: '/assets' },
  { Icon: Link2, zh: '邀请分润', en: 'Invite & Earn', to: '/crm?role=user&tab=referrals' },
  { Icon: LayoutGrid, zh: '更多', en: 'More', to: '/more' }
];

export const stats = [
  { v: '256', zh: '年九珍堂品牌', en: 'yrs heritage' },
  { v: '30s', zh: 'AI 体质测评', en: 'AI body check' },
  { v: '1,200+', zh: '全岛中医机构', en: 'TCM clinics in SG' },
  { v: '24/7', zh: 'Kopi AI 客服', en: 'AI service' }
];

export const feed = [
  { image: img('birdnest.jpg'), tag: ['健康好物', 'Wellness'], zh: 'HBH 健康好物专区：虫草、燕窝、参类与即食滋养', en: 'HBH Wellness: cordyceps, bird’s nest, ginseng & ready-to-eat tonics', dzh: '每款产品科研背书 + 成分解析 + 用户实测，严格选品与物联溯源。', den: 'Research-backed, ingredient-explained and user-tested, with traceable sourcing.' },
  { image: img('gc-wall.jpg'), tag: ['科技抗衰', 'Longevity tech'], zh: '基因细胞与光子抗衰研发根基', en: 'Gene-cell and photon longevity research', dzh: '前沿科技产品科普与体验，构建差异化品牌信任。', den: 'Discover advanced wellness technology in an experiential setting.' },
  { image: img('mall-logo.jpg'), tag: ['全球好物', 'Global'], zh: '一站式线上百货', en: 'A one-stop online department store', dzh: '日用百货、数码家电、服饰美妆、母婴文创，消费返利全平台通用。', den: 'Home, tech, beauty, family and gifts — rewards usable across the mall.' },
  { image: img('tea-lounge.jpg'), tag: ['本地生活', 'Local'], zh: '探店返利，发现身边好去处', en: 'Explore local spots and earn rebates', dzh: '餐饮、健身、养生、教育服务，团购券与到店返利。', den: 'Dining, fitness, wellness and education with vouchers and in-store rebates.' },
  { image: img('herbs.jpg'), tag: ['巧掌柜课堂', 'Classes'], zh: '手作滋补、养生茶与节气科普', en: 'Handmade tonics, herbal teas and seasonal tips', dzh: '药膳、香囊、养生茶手作教程，结合 AI 体质测评个性化建议。', den: 'Hands-on recipes and seasonal know-how, personalised with AI body checks.' },
  { image: img('ai-kiosk.jpg'), tag: ['Ai 凉茶铺', 'AI tea bar'], zh: '30 秒 AI 体质测评，配一杯适合你的凉茶', en: 'A 30-second AI check, then your herbal tea', dzh: '6–10 款核心凉茶，$4.80–$7.80，支持外带与外卖。', den: '6–10 signature brews from $4.80–$7.80, takeaway and delivery.' },
  { image: img('prod-01.jpg'), tag: ['滋补产品', 'Tonics'], zh: '九珍堂滋补系列', en: 'Jiu Zhen Tang tonic collection', dzh: '256 年品牌资产，滋补品类专业之选。', den: 'A 256-year heritage in premium Chinese tonics.' },
  { image: img('prod-03.jpg'), tag: ['即食系列', 'Ready to eat'], zh: '忙碌生活的即食滋养', en: 'Ready-to-eat nourishment for busy days', dzh: '开盖即享，日常补养更轻松。', den: 'Open and enjoy — daily nourishment made easy.' },
  { image: img('apothecary.jpg'), tag: ['药食同源', 'Food as care'], zh: '传统药食同源智慧', en: 'Traditional food-as-care wisdom', dzh: '与 HSA 注册进口商合作，严格品控。', den: 'Sourced via HSA-registered importers with strict quality control.' },
  { image: img('chenpi.jpg'), tag: ['陈皮', 'Aged peel'], zh: '陈皮走廊：岁月沉香', en: 'The aged tangerine peel corridor', dzh: '一年陈皮，百年故事。', den: 'Every year of ageing tells a story.' },
  { image: img('gcpack-01.jpg'), tag: ['基因细胞', 'GeneCell'], zh: '基因细胞产品线', en: 'The GeneCell product line', dzh: '研发根基，可零售、可体验、可分润。', den: 'Our research foundation — shop, experience and share.' },
  { image: img('pods.jpg'), tag: ['理疗体验', 'Therapy'], zh: '理疗与科技体验空间', en: 'Therapy and tech experience space', dzh: '在门店亲身体验健康科技。', den: 'Try wellness technology in person at our stores.' }
];

export const stores = [
  { image: img('jztstore-01.jpg'), zh: '九珍堂全域专卖店', en: 'Jiu Zhen Tang stores', dzh: '社区商场店 60–100㎡，自提、体验、扫码下单。', den: 'Neighbourhood mall stores for pickup, tastings and scan-to-order.' },
  { image: img('ai-kiosk.jpg'), zh: 'Ai 中医凉茶铺', en: 'AI herbal tea bar', dzh: 'AI 面部/舌象 30 秒测评，注册会员即享积分。', den: '30-second AI face/tongue check, earn points as a member.' },
  { image: img('hero-store.jpg'), zh: 'HBH 体验店', en: 'HBH experience store', dzh: '新加坡一号店，健康、美丽、快乐。', den: 'Singapore flagship for health, beauty and joy.' }
];

export const gallery = [
  ['hall.jpg', '展厅', 'Showroom'], ['jzt-wall.jpg', '九珍堂', 'Jiu Zhen Tang'], ['gift-aisle.jpg', '礼品区', 'Gifts'], ['retail-aisle.jpg', '零售区', 'Retail'],
  ['bulk-jars.jpg', '散装滋养', 'Bulk tonics'], ['massage.jpg', '理疗空间', 'Therapy'], ['clinic.jpg', '体验诊疗', 'Consultation'], ['vip.jpg', 'VIP 会客', 'VIP lounge'],
  ['tea-meet.jpg', '茶叙', 'Tea meet'], ['jzt-life.jpg', '生活方式', 'Lifestyle'], ['collab.jpg', '联名', 'Collabs'], ['event.jpg', '活动与联盟', 'Events']
].map(([f, zh, en]) => ({ image: img(f), zh, en }));