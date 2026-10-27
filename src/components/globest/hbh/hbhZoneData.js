import { wellnessCategories } from '@/components/globest/wellnessCategoryData';

export const hbhTabs = {
  hbh: { title: ['GeneCells', 'GeneCells'], intro: ['探索 GeneCells 营养系列、单品详情、组合礼包与产品资料。', 'Explore GeneCells nutrition, individual products, packages and product information.'] },
  herbal: { title: ['九珍堂', 'Jiu Zhen Tang'], intro: ['走近九珍堂，探索野山参、陈皮、燕窝与传统滋补食养。', 'Discover Jiu Zhen Tang, ginseng, chenpi, bird’s nest and traditional food rituals.'] },
  care: { title: ['康养', 'Wellness'], intro: ['微压氧舱、疗程体验与居家康养设备，连接日常健康生活。', 'Explore oxygen sessions, wellness packages and home wellness devices.'] },
  supplements: { title: ['保健品', 'Supplements'], intro: ['按营养关注点浏览保健品，了解成分、规格与日常补充选择。', 'Browse supplements by nutrition interest, ingredients and serving information.'] },
  other: { title: ['其他', 'More'], intro: ['草本茶饮、AI 健康咨询、产品资料与生活课堂，发现更多健康生活内容。', 'Discover herbal tea, AI wellness guidance, product resources and everyday learning.'] }
};

export const catalogScopes = {
  genecells: ['genecell'],
  herbal: ['ginseng', 'cordyceps', 'dendrobium', 'goji', 'black_goji', 'lingzhi', 'ejiao', 'birdnest', 'fish_maw', 'sea_cucumber', 'yam', 'lily', 'lotus', 'poria', 'chenpi', 'herbal', 'deer_antler', 'hasma'],
  supplements: ['hair_nutrition', 'skin_nutrition', 'probiotics', 'digestive_enzymes', ...wellnessCategories.map(([key]) => key)]
};