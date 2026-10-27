export const globalGroups = [
  { id: 'mobile', zh: '手机与配件', en: 'Mobile', categories: ['Smartphones', 'Tablets', 'Phone Cases', 'Chargers & Cables', 'Power Banks'] },
  { id: 'computing', zh: '电脑与办公', en: 'Computing', categories: ['Laptops', 'Monitors', 'Mechanical Keyboards', 'External SSDs', 'MicroSD & USB Drives', 'Wi-Fi Routers', 'Webcams', 'Desk Gadgets', 'E-Readers'] },
  { id: 'audio', zh: '影音娱乐', en: 'Audio & TV', categories: ['Wireless Earbuds', 'Over-Ear Headphones', 'Bluetooth Speakers', 'Smart Speakers', 'Smart TVs', 'Streaming Devices', 'Projectors'] },
  { id: 'photo', zh: '摄影与直播', en: 'Photo & Video', categories: ['Action Cameras', 'Mirrorless Cameras', 'Instant Cameras', 'Drones', 'Phone Gimbals & Tripods', 'Ring Lights & Vlog Gear'] },
  { id: 'home', zh: '智能家居', en: 'Smart Home', categories: ['Robot Vacuums', 'Air Purifiers', 'Smart Home Security Cameras', 'Video Doorbells', 'Smart Plugs & Lighting'] },
  { id: 'kitchen', zh: '厨房家电', en: 'Kitchen', categories: ['Air Fryers', 'Coffee Machines', 'Blenders', 'Kitchen Gadgets'] },
  { id: 'care', zh: '个护与出行', en: 'Care & Travel', categories: ['Smartwatches', 'Fitness Trackers', 'Smart Rings', 'Electric Toothbrushes', 'Electric Shavers', 'Hair Dryers', 'Massage Guns', 'Portable Fans', 'Travel Gadgets'] },
  { id: 'gaming', zh: '游戏与玩具', en: 'Games & Toys', categories: ['Gaming Consoles', 'Gaming Headsets', 'Gaming Mice', 'VR Headsets', 'Kids Tech & STEM Toys'] }
];
export const priceRanges = { all: null, under50: { $lt: 50 }, mid: { $gte: 50, $lte: 200 }, premium: { $gt: 200 } };