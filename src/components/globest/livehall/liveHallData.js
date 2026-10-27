const u = 'https://images.unsplash.com/';
const c = id => `${u}${id}?auto=format&fit=crop&w=600&q=70`;

export const hallTabs = [['hot', '热门直播', 'Trending'], ['follow', '关注主播', 'Following'], ['shop', '商品直播', 'Shopping'], ['multi', '多人互动', 'Multi-guest'], ['soon', '即将开播', 'Upcoming']];

export const liveProducts = [
  { id: 'lp-oxy', name_zh: 'HBH 绿氧舱 家用款', name_en: 'HBH Oxygen Chamber', price: 3780, was: 3980, stock: 8, image: c('photo-1584467735871-8e85353a8413'), specs: ['单人款', '双人款'], is_demo: true },
  { id: 'lp-pillow', name_zh: 'HBH 智能睡眠枕', name_en: 'Smart Sleep Pillow', price: 199, was: 268, stock: 46, image: c('photo-1631049307264-da0ec9d70304'), specs: ['标准', '加高'], is_demo: true },
  { id: 'lp-eye', name_zh: '眼部按摩仪', name_en: 'Eye Massager', price: 149, was: 189, stock: 23, image: c('photo-1556228578-8c89e6adf883'), specs: ['白色', '金色'], is_demo: true },
];

export const hallRooms = [
  { id: 'r1', cat: ['hot', 'shop'], host: '九珍堂·陈老师', title: ['野山参鉴别 + 秒杀专场', 'Wild ginseng tips + flash sale'], cover: c('photo-1471943311424-646960669fbc'), avatar: c('photo-1500648767791-00dcc994a43e'), viewers: 12840, guests: 3, product: 0 },
  { id: 'r2', cat: ['hot', 'multi'], host: 'HBH 健康圆桌', title: ['4 位专家连麦：睡眠与氧', '4 experts: sleep & oxygen'], cover: c('photo-1544367567-0f2fcb009e0b'), avatar: c('photo-1494790108377-be9c29b29330'), viewers: 6320, guests: 4, product: 1 },
  { id: 'r3', cat: ['shop', 'follow'], host: 'Amy 好物推荐', title: ['眼部护理好物开箱', 'Eye-care unboxing'], cover: c('photo-1512290923902-8a9f81dc236c'), avatar: c('photo-1438761681033-6461ffad8d80'), viewers: 2190, guests: 1, product: 2 },
  { id: 'r4', cat: ['multi', 'follow'], host: '新加坡生活家', title: ['本地美食 9 宫格连麦', 'Local food 9-way chat'], cover: c('photo-1555939594-58d7cb561ad1'), avatar: c('photo-1506794778202-cad84cf45f1a'), viewers: 4810, guests: 8, product: null },
  { id: 'r5', cat: ['soon'], host: 'GeneCells 研究院', title: ['细胞健康公开课', 'Cellular health class'], cover: c('photo-1532187863486-abf9dbad1b69'), avatar: c('photo-1560250097-0b93528c311a'), viewers: 0, guests: 0, product: null, at: '20:00' },
];

export const gifts = /** @type {Array<[string, string, string, number]>} */ ([['🌹', '玫瑰', 'Rose', 1], ['🍵', '养生茶', 'Tea', 5], ['🌿', '人参', 'Ginseng', 20], ['🚀', '火箭', 'Rocket', 100]]);