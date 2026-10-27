const img = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const localCategories = [
  ['food', '美食', 'Food', 'UtensilsCrossed'],
  ['beauty', '美容美发', 'Beauty', 'Sparkles'],
  ['home', '家政维修', 'Home Services', 'Wrench'],
  ['activities', '娱乐票务', 'Activities', 'Ticket'],
  ['health', '医疗健康', 'Health', 'HeartPulse'],
  ['pets', '宠物', 'Pets', 'PawPrint'],
  ['auto', '汽车', 'Auto', 'Car'],
  ['education', '教育', 'Education', 'GraduationCap']
];

const slots = ['11:30', '12:30', '18:00', '19:00', '20:00', '21:00'];
const m = (id, cat, zh, en, area, lat, lng, rating, reviews, km, avg, deal, tags, image, services, extra = {}) =>
  ({ id, cat, zh, en, area, lat, lng, rating, reviews, km, avg, deal, tags, image, services, slots, open: true, isNew: false, ...extra });

export const localMerchants = [
  m('m1', 'food', '乌节和风料理', 'Orchard Washoku', 'Orchard', 1.3048, 103.8318, 4.8, 1260, 1.2, 75, ['4人套餐 9折', '4-pax set 10% off'], ['kids', 'dinein', 'japanese'], img('photo-1579871494447-9811cf80d66c'), /** @type {Array<[string, string, number, number]>} */ ([['寿司定食', 'Sushi set', 38, 60], ['四人和牛套餐', 'Wagyu set for 4', 288, 90]])),
  m('m2', 'food', '牛车水海南鸡饭', 'Chinatown Chicken Rice', 'Chinatown', 1.2836, 103.8443, 4.6, 3420, 2.4, 12, ['外卖免配送费', 'Free delivery'], ['delivery', 'pickup', 'local'], img('photo-1569058242253-92a9c755a0ec'), /** @type {Array<[string, string, number, number]>} */ ([['招牌鸡饭', 'Signature chicken rice', 6.5, 15], ['家庭套餐', 'Family set', 32, 20]])),
  m('m3', 'food', '滨海湾火锅', 'Marina Bay Hotpot', 'Marina Bay', 1.2816, 103.8636, 4.7, 890, 3.1, 60, ['新店 8折', 'New store 20% off'], ['dinein', 'group'], img('photo-1547592180-85f173990554'), /** @type {Array<[string, string, number, number]>} */ ([['双人锅底套餐', 'Hotpot for 2', 98, 90]]), { isNew: true }),
  m('m4', 'beauty', '丝凯发型工作室', 'Silk Hair Studio', 'Tanjong Pagar', 1.2765, 103.8458, 4.9, 640, 2.0, 68, ['首单立减 $15', '$15 off first visit'], ['hair'], img('photo-1560066984-138dadb4c035'), /** @type {Array<[string, string, number, number]>} */ ([['洗剪吹', 'Cut & blow', 48, 45], ['染发护理', 'Colour & treatment', 168, 120]])),
  m('m5', 'beauty', '静心按摩馆', 'Serenity Massage', 'Novena', 1.3203, 103.8438, 4.7, 1105, 1.8, 88, ['今晚可约', 'Available tonight'], ['massage', 'tonight'], img('photo-1544161515-4ab6ce6db874'), /** @type {Array<[string, string, number, number]>} */ ([['60分钟全身按摩', '60-min full body', 78, 60], ['90分钟精油按摩', '90-min aroma', 118, 90]])),
  m('m6', 'home', '亮洁家政', 'BrightClean Home', 'Toa Payoh', 1.3343, 103.8563, 4.6, 2210, 3.5, 25, ['3小时套餐 $69', '3-hr pack $69'], ['cleaning'], img('photo-1581578731548-c64695cc6952'), /** @type {Array<[string, string, number, number]>} */ ([['钟点清洁 (每小时)', 'Hourly cleaning', 25, 60], ['深度清洁', 'Deep cleaning', 199, 240]])),
  m('m7', 'home', '快修空调', 'QuickFix Aircon', 'Bishan', 1.3508, 103.8485, 4.5, 980, 4.6, 40, ['保养第2台半价', '2nd unit 50% off'], ['repair', 'aircon'], img('photo-1621905251189-08b45d6a269e'), /** @type {Array<[string, string, number, number]>} */ ([['空调常规保养', 'Aircon servicing', 30, 45], ['化学清洗', 'Chemical wash', 80, 90]])),
  m('m8', 'activities', '圣淘沙亲子乐园', 'Sentosa Family Fun', 'Sentosa', 1.2494, 103.8303, 4.8, 4300, 6.8, 45, ['亲子票 立省 $20', 'Family pass save $20'], ['kids', 'tickets'], img('photo-1526481280693-3bfa7568e0f3'), /** @type {Array<[string, string, number, number]>} */ ([['单人门票', 'Single ticket', 39, 240], ['家庭套票 (2大2小)', 'Family pass (2+2)', 136, 240]])),
  m('m9', 'health', '康宁家庭诊所', 'CareWell Clinic', 'Bukit Timah', 1.3294, 103.8021, 4.6, 520, 4.0, 50, ['体检套餐 85折', 'Health screening 15% off'], ['clinic'], img('photo-1519494026892-80bbd2d6fd0d'), /** @type {Array<[string, string, number, number]>} */ ([['全科门诊', 'GP consultation', 35, 20], ['基础体检', 'Basic screening', 128, 60]])),
  m('m10', 'pets', '毛孩子美容', 'Furry Groom', 'Tiong Bahru', 1.2862, 103.8270, 4.9, 760, 2.7, 60, ['洗护送剪甲', 'Free nail trim'], ['pets'], img('photo-1516734212186-a967f81ad0d7'), /** @type {Array<[string, string, number, number]>} */ ([['小型犬洗护', 'Small dog grooming', 55, 90], ['猫咪洗护', 'Cat grooming', 70, 90]]), { isNew: true }),
  m('m11', 'auto', '狮城洗车', 'Lion City Car Spa', 'Kallang', 1.3100, 103.8714, 4.5, 1340, 3.9, 30, ['打蜡套餐 $49', 'Wax pack $49'], ['car'], img('photo-1607860108855-64acf2078ed9'), /** @type {Array<[string, string, number, number]>} */ ([['标准洗车', 'Standard wash', 25, 30], ['内外精洗', 'Full detailing', 120, 120]])),
  m('m12', 'education', '星光少儿编程', 'StarCode Kids', 'Jurong East', 1.3329, 103.7436, 4.8, 410, 9.5, 45, ['试听课 $10', '$10 trial class'], ['kids', 'class'], img('photo-1503676260728-1c00da094a0b'), /** @type {Array<[string, string, number, number]>} */ ([['试听课', 'Trial class', 10, 60], ['10节课程包', '10-class pack', 380, 60]]))
];

export const SERVICE_FEE_RATE = 0.03;
export const DELIVERY_FEE = 3.5;