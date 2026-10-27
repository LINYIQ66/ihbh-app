const u = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&q=70`;
export const DEMO_VIDEO = 'https://media.base44.com/videos/public/6aa3280ca2d875c1b77cdd8e/edd93fcdf_655.mov';

export const courseTracks = [
  ['all', '全部课程', 'All courses'],
  ['start', '新手入门', 'Getting started'],
  ['deal', '省钱攻略', 'Saving tips'],
  ['quality', '选品鉴别', 'Product know-how'],
  ['live', '直播带货', 'Live selling'],
  ['content', '内容种草', 'Content creation'],
  ['shop', '开店运营', 'Store operations'],
];

// [track, zh, en, minutes, level, image, lessons, learners]
/** @type {Array<[string,string,string,number,number,string,number,number]>} */
const courseRows = [
  ['start', '网购第一课：账户、地址与安全支付', 'Online shopping 101: account, address & safe pay', 12, 1, u('photo-1556742049-0cfed4f6a45d'), 6, 12840],
  ['start', '看懂商品详情页的8个关键信息', '8 things to read on any product page', 9, 1, u('photo-1607082348824-0a96f2a4b9da'), 5, 9630],
  ['start', '退换货与售后：一次讲清楚', 'Returns & after-sales made simple', 11, 1, u('photo-1586880244406-556ebe35f282'), 4, 7210],
  ['start', '新加坡跨境网购：关税与运费', 'Cross-border shopping in SG: GST & shipping', 14, 2, u('photo-1566576721346-d4a3b4eaeb55'), 6, 5480],
  ['deal', '大促凑单技巧：满减怎么最划算', 'Mega-sale stacking: maximise every discount', 10, 2, u('photo-1607083206869-4c7672e72a8a'), 5, 15320],
  ['deal', '优惠券、积分与返现全攻略', 'Coupons, points & cashback guide', 13, 2, u('photo-1580048915913-4f8f5cb481c4'), 7, 11050],
  ['deal', '比价工具与历史价格查询', 'Price comparison & price history tools', 8, 2, u('photo-1554224155-6726b3ff858f'), 4, 6890],
  ['deal', '会员日与限时秒杀抢购术', 'Member days & flash-sale tactics', 7, 1, u('photo-1472851294608-062f824d29cc'), 3, 8420],
  ['quality', '滋补品鉴别：人参、燕窝、花胶', 'Spotting real ginseng, bird nest & fish maw', 18, 3, u('photo-1515023115689-589c33041d3c'), 8, 10230],
  ['quality', '读懂保健品成分表与认证标志', 'Reading supplement labels & certifications', 15, 2, u('photo-1584308666744-24d5c474f2ae'), 6, 7760],
  ['quality', '护肤品选购：肤质与成分搭配', 'Skincare by skin type & ingredients', 16, 2, u('photo-1556228578-8c89e6adf883'), 7, 9940],
  ['quality', '生鲜网购：如何挑到新鲜好货', 'Buying fresh produce online', 9, 1, u('photo-1542838132-92c53300491e'), 4, 5120],
  ['live', '直播间下单前必看的5件事', '5 checks before buying in a livestream', 8, 1, u('photo-1611162617213-7d7a39e9b1d7'), 4, 8830],
  ['live', '从零开始做第一场直播', 'Hosting your first livestream', 22, 3, u('photo-1598550476439-6847785fcea6'), 9, 4370],
  ['live', '直播话术与节奏设计', 'Live-selling scripts & pacing', 19, 3, u('photo-1492619375914-88005aa9e8fb'), 8, 3950],
  ['live', '手机直播灯光与收音布置', 'Phone lighting & audio for live', 12, 2, u('photo-1516035069371-29a1b244cc32'), 5, 4610],
  ['content', '拍出高转化商品图：手机就够', 'High-converting product photos with a phone', 14, 2, u('photo-1452587925148-ce544e77e70d'), 6, 7020],
  ['content', '种草短视频脚本模板', 'Short-video review script templates', 11, 2, u('photo-1574717024653-61fd2cf4d44d'), 5, 6340],
  ['content', '写好一篇真实测评', 'Writing an honest product review', 9, 1, u('photo-1455390582262-044cdead277a'), 4, 5590],
  ['content', '社群分享与邀请好友技巧', 'Community sharing & referral tips', 10, 2, u('photo-1529156069898-49953e39b3ac'), 5, 6180],
  ['shop', '开网店第一步：定位与选品', 'Starting a store: positioning & sourcing', 20, 3, u('photo-1441986300917-64674bd600d8'), 8, 3820],
  ['shop', '商品标题与关键词优化', 'Product titles & keyword optimisation', 13, 2, u('photo-1460925895917-afdab827c52f'), 6, 4290],
  ['shop', '客服沟通与好评管理', 'Customer service & review management', 12, 2, u('photo-1556745757-8d76bdb6984b'), 5, 3670],
  ['shop', '订单、库存与物流管理', 'Orders, inventory & logistics', 17, 3, u('photo-1553413077-190dd305871c'), 7, 2980],
];
export const courses = courseRows.map(([track, zh, en, min, level, image, lessons, learners], i) => ({ id: `c${i}`, track, zh, en, min, level, image, lessons, learners }));

export const experts = [
  ['巧掌柜', 'Qiao Zhanggui', '滋补选品 · 直播', 'Tonic picks · Live', u('photo-1544005313-94ddf0286df2')],
  ['省钱阿May', 'Saver May', '大促攻略', 'Sale strategies', u('photo-1438761681033-6461ffad8d80')],
  ['测评Ken', 'Reviewer Ken', '真实测评', 'Honest reviews', u('photo-1500648767791-00dcc994a43e')],
  ['店长Lina', 'Store Lead Lina', '开店运营', 'Store operations', u('photo-1494790108377-be9c29b29330')],
];