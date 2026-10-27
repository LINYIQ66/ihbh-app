const a = f => `https://globest.ai/assets/${f}`;

export const slides = [
  { eyebrow: 'HBH / GENECELLS COLLECTION', title: '把日子慢慢', em: '养好。', text: '探索 GENECELLS 单品与组合套装，为认真生活的每一天，多一份关心。', image: 'https://base44.app/api/apps/6aa3280ca2d875c1b77cdd8e/files/mp/public/6aa3280ca2d875c1b77cdd8e/c2b22d47f_genecells.jpg', cta: '探索 GENECELLS', to: '/discover?section=hbh' },
  { eyebrow: 'HBH / 九珍堂 COLLECTION', title: '珍贵心意，', em: '好礼相伴。', text: '野山参、参粉与滋补礼盒，让一份礼物，承载认真挑选的心意。', image: 'https://base44.app/api/apps/6aa3280ca2d875c1b77cdd8e/files/mp/public/6aa3280ca2d875c1b77cdd8e/b6f1a06a4_five-gift.jpg', cta: '探索九珍堂', to: '/jiuzhentang' },
  { eyebrow: 'HBH / GLOBAL HEALTH', title: '健康好物，', em: '用心发现。', text: '从产品系列到品牌体验，走近 HBH 全球健康好物的世界。', image: 'https://base44.app/api/apps/6aa3280ca2d875c1b77cdd8e/files/mp/public/6aa3280ca2d875c1b77cdd8e/dcf7c3adc_store.jpg', cta: '了解 HBH', to: '/brand' }
];

export const marquee = ['HBH', '全球健康好物', 'GENECELLS', '九珍堂', '健康佳礼 · 心意之选'];

export const jztCategories = [
  ['WILD GINSENG', '野山参礼盒', '木质礼盒，珍藏一份山野心意。', a('ginseng-gift.jpg')],
  ['GINSENG POWDER', '野山参粉', '礼盒与独立瓶装，日常便捷取用。', a('ginseng-powder.jpg')],
  ['GINSENG & CORDYCEPS', '参草礼盒', '野山参与冬虫夏草，珍贵组合。', a('cordyceps-gift.jpg')],
  ['FIVE TREASURES', '五福颐和', '五款食材，一份圆满心意。', a('five-gift.jpg')]
];

const s = (n, cat, cap) => ({ image: a(`jzt-scenes/scene-${n}-thumb.webp`), cat, cap });
export const scenes = [
  s('14', '基地实景', '野山参基地'), s('13', '基地实景', '霍山石斛生态谷'), s('21', '基地实景', '林间基地走访'), s('02', '高原寻源', '高原寻源现场'),
  s('11', '国内门店', '九珍堂国内分店'), s('28', '国内门店', '门店接待现场'), s('45', '工厂园区', '九珍堂园区外景'), s('54', '工厂园区', '工厂车间外景'),
  s('37', '园区空间', '园区接待空间'), s('38', '园区空间', '园区荣誉展示'), s('64', '园区景观', '庭院与盆景'), s('68', '品牌展示', '产品陈列空间')
];

export const founder = {
  photo: a('li-cheng-cheng.jpg'), name: '巧巧', en: 'Lydia', handle: '巧掌柜',
  roles: ['中参控股有限公司 全球合伙人', '九珍堂（香港）集团有限公司 董事', 'HBH淘最环球控股有限公司 董事长/CEO', 'HBH GLOBEST HEALTHTECH PTE. LTD.'],
  letter: ['我们创立 HBH，源于一个朴素而坚定的信念：真正有价值的事业，不仅创造商业成果，更应让人们的生活发生美好的改变。“让人类更健康，生活更美好”，是我们的初心，也是每一次选择、每一步发展的出发点。', '在 HBH，我们希望让传统养生智慧与现代科技相互赋能，让健康不再是遥远的概念，而成为触手可及的日常。从细胞抗衰产品到九珍堂的滋养产品，融入 AI 体验的草本凉茶场景，再到连接健康好物与本地生活的 iHBH 平台，我们努力把产品、服务与体验串联起来。'],
  tel: '+65 9828 3133', email: 'hbh@globest.ai', address: '12 Tai Seng Link, #02-01, GRC Centre, Singapore 534233'
};