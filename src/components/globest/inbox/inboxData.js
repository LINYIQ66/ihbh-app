// Demo threads. type: chat | ai | order | aftersale | platform | marketing
const now = Date.now(); const h = n => new Date(now - n * 3600e3).toISOString();
const img = 'https://images.unsplash.com/';

export const inboxCategories = [
  ['order', '交易物流', 'Orders', 'Truck'],
  ['aftersale', '售后服务', 'After-sales', 'RotateCcw'],
  ['platform', '平台通知', 'Notices', 'Bell'],
  ['marketing', '优惠促销', 'Promotions', 'Gift'],
];

export const demoProduct = { id: 'hbh-oxygen', name_zh: 'HBH 绿氧舱 家用款', name_en: 'HBH Green Oxygen Chamber (Home)', price: 3980, stock: 12, spec_zh: '单人 · 1.3ATA', spec_en: 'Single · 1.3ATA', promo_zh: '会员立减 S$200', promo_en: 'Members save S$200', image: img + 'photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=400&q=70', is_demo: true };

export const initialThreads = [
  { id: 'ai', type: 'ai', zh: 'AI 智能客服', en: 'AI Customer Service', avatar: '', time: h(0.1), unread: 1, messages: [{ from: 'them', text: '您好！我是 Globest 7×24 小时 AI 客服，可帮您查询订单、物流、退换货，或推荐商品。', time: h(0.1) }] },
  { id: 'm-hbh', type: 'chat', zh: 'HBH 官方旗舰店', en: 'HBH Official Store', avatar: img + 'photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=120&q=70', time: h(0.5), unread: 2, messages: [{ from: 'them', text: '亲，绿氧舱今天会员价立减 S$200，有需要可以直接下单哦～', time: h(0.6) }, { from: 'them', product: demoProduct, time: h(0.5) }] },
  { id: 'm-jzt', type: 'chat', zh: '九珍堂滋补馆', en: 'Jiuzhentang Tonics', avatar: img + 'photo-1471943311424-646960669fbc?auto=format&fit=crop&w=120&q=70', time: h(5), unread: 0, messages: [{ from: 'me', text: '野山参可以送礼盒包装吗？', time: h(5.2) }, { from: 'them', text: '可以的，免费提供礼盒和贺卡。', time: h(5) }] },
  { id: 'order', type: 'order', zh: '交易物流', en: 'Orders & Delivery', time: h(1), unread: 1, notices: [
    { title: ['商品派送中', 'Out for delivery'], body: ['您的 HBH 智能睡眠枕正在派送，预计今天 18:00 前送达。', 'Your Smart Sleep Pillow arrives by 6pm today.'], order: 'GM20261009001', time: h(1), track: [['派送中 · 快递员 Ah Seng 9123 4567', 'Out for delivery · courier Ah Seng'], ['到达 Tampines 派送站', 'Arrived at Tampines hub'], ['商家已发货 · Ninja Van', 'Shipped via Ninja Van'], ['商家已接单', 'Merchant accepted'], ['付款成功 S$268', 'Paid S$268'], ['订单已创建', 'Order created']] },
    { title: ['签收完成', 'Delivered'], body: ['眼部按摩仪已签收，欢迎评价得 20 积分。', 'Eye Massager delivered. Review it for 20 points.'], order: 'GM20261005017', time: h(70), track: [['已签收', 'Delivered'], ['派送中', 'Out for delivery'], ['商家已发货', 'Shipped'], ['付款成功 S$189', 'Paid S$189'], ['订单已创建', 'Order created']] },
  ] },
  { id: 'aftersale', type: 'aftersale', zh: '售后服务', en: 'After-sales', time: h(26), unread: 0, notices: [
    { title: ['退款处理中', 'Refund in progress'], body: ['香薰礼盒退货已签收，商家审核中，退款 S$88 预计 3-5 个工作日到账。', 'Return received; S$88 refund in 3-5 working days.'], order: 'GM20260928004', time: h(26), steps: [['提交申请', 'Submitted'], ['商家同意', 'Approved'], ['买家寄回', 'Returned'], ['退款到账', 'Refunded']], step: 2 },
  ] },
  { id: 'platform', type: 'platform', zh: '平台通知', en: 'Platform Notices', time: h(30), unread: 1, notices: [
    { title: ['会员升级', 'Membership upgraded'], body: ['恭喜！您已升级为 VIP 会员，享全场 95 折。', 'You are now VIP. Enjoy 5% off sitewide.'], time: h(30) },
    { title: ['积分变动', 'Points updated'], body: ['签到获得 10 HBH 积分。', 'Earned 10 HBH points for check-in.'], time: h(50) },
    { title: ['系统维护', 'Maintenance'], body: ['10 月 12 日 02:00-04:00 系统维护，支付功能暂停。', 'Payments paused Oct 12, 2-4am for maintenance.'], time: h(80) },
  ] },
  { id: 'marketing', type: 'marketing', zh: '优惠促销', en: 'Promotions', time: h(3), unread: 3, notices: [
    { title: ['S$30 优惠券到账', 'S$30 coupon added'], body: ['满 S$300 可用，10 月 31 日前有效。', 'Min. spend S$300, valid till Oct 31.'], time: h(3) },
    { title: ['降价提醒', 'Price drop'], body: ['您收藏的艾灸仪降价 S$40。', 'The Moxibustion Device you saved dropped S$40.'], time: h(20) },
    { title: ['双十一预热', '11.11 preview'], body: ['会员专属：11.11 全场满减，提前加购。', 'Members-only 11.11 deals. Add to cart now.'], time: h(40) },
  ] },
];