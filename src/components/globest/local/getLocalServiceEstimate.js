// Planning budgets in SGD, not merchant quotes or verified live offers.
// The proposed 10% iHBH discount is inactive and cannot be redeemed.
const categories = {
  '餐厅': [20, 50, '人', '单人用餐预算'],
  '家政清洁': [75, 120, '次（约3小时）', '日常清洁预算'],
  '美容美发': [60, 150, '次', '基础护理预算'],
  '休闲娱乐与票务': [40, 100, '人', '单项门票或体验预算'],
  '医疗健康': [30, 100, '次', '基础问诊预算，不含检查与药费', false],
  '运动健身': [120, 220, '月', '健身会籍预算'],
  '教育亲子': [50, 120, '课', '单次课程预算'],
  '宠物护理': [60, 120, '次', '宠物基础洗护预算'],
  '汽车养护': [120, 250, '次', '基础保养预算'],
  '搬家与仓储': [300, 800, '趟', '小型家庭搬迁预算'],
  '鲜花礼赠': [60, 150, '份', '花束或礼赠预算'],
  '洗衣护理': [20, 50, '单', '日常洗衣预算'],
  '空调与除虫': [90, 150, '次', '常规空调保养预算'],
  '同城配送': [15, 40, '单', '小件同城配送预算'],
  '家居亲子': [20, 60, '件', '日常用品预算']
};
const merchantBudgets = {
  'https://yakun.com/': [6, 10, '人', '早餐套餐预算'],
  'https://songfa.com.sg/': [15, 25, '人', '单人用餐预算'],
  'https://www.breadtalk.com.sg/': [3, 8, '人', '面包与点心预算'],
  'https://www.natureland.com.sg/': [75, 130, '次（约60分钟）', '按摩体验预算'],
  'https://chezvoushair.com/': [100, 180, '次', '剪发造型预算'],
  'https://jeanyipgroup.com/': [45, 100, '次', '基础剪发预算'],
  'https://www.kimage.com.sg/': [40, 90, '次', '基础剪发预算'],
  'https://strip.com.sg/': [30, 100, '项目', '单部位护理预算'],
  'https://www.activesgcircle.gov.sg/': [3, 10, '次', '单次设施使用预算', false],
  'https://www.britishcouncil.sg/english-courses': [50, 90, '课时', '英语课程预算'],
  'https://www.theanimaldoctors.com.sg/': [40, 100, '次', '宠物问诊预算，不含检查与药费', false],
  'https://www.pawshake.com.sg/': [25, 60, '次', '遛狗或上门照护预算'],
  'https://qandm.com.sg/': [30, 80, '次', '牙科问诊预算，不含治疗', false],
  'https://www.thomsonmedical.com/': [100, 250, '次', '专科问诊预算，不含检查与治疗', false],
  'https://sg.euyansangclinic.com/clinics': [30, 80, '次', '中医问诊预算，不含药费', false],
  'https://extraspaceasia.com/sg/': [100, 250, '月', '小型仓储空间预算'],
  'https://www.lockandstore.com/en-sg/': [100, 250, '月', '小型仓储空间预算'],
  'https://www.rentokil.com/sg/': [150, 300, '次', '单次住宅除虫预算'],
  'https://www.mindchamps.org/': [1800, 2500, '月', '学前教育预算，未计补贴'],
  'https://www.myfirstskool.com/': [700, 1800, '月', '学前教育预算，未计补贴']
};
const aliases = { food: '餐厅', beauty: '美容美发', home: '家政清洁', activities: '休闲娱乐与票务', health: '医疗健康', pets: '宠物护理', auto: '汽车养护', education: '教育亲子' };
export default function getLocalServiceEstimate(service) {
  const category = aliases[service.category] || service.category;
  if (['证券', '银行', '保险'].includes(category)) return { quoteOnly: true };
  const budget = merchantBudgets[service.url] || categories[category];
  if (!budget) return null;
  const [min, max, unit, label, allowDiscount = true] = budget;
  return { min, max, unit, label, rate: allowDiscount ? 0.9 : 1 };
}