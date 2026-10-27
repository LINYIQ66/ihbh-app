// Turns natural-language queries like "今晚7点乌节路4个人，人均80新币" into filters.
const catWords = { food: ['吃', '餐', '日料', '火锅', '饭', 'food', 'dinner', 'lunch', 'eat', 'sushi'], beauty: ['按摩', '美发', '美容', '剪发', 'massage', 'hair', 'spa'], home: ['家政', '清洁', '维修', '空调', 'clean', 'repair', 'aircon'], activities: ['门票', '乐园', '活动', 'ticket', 'fun'], health: ['诊所', '体检', '看病', 'clinic', 'doctor'], pets: ['宠物', '狗', '猫', 'pet', 'dog', 'cat'], auto: ['洗车', '汽车', 'car'], education: ['课', '编程', '教育', 'class', 'tuition'] };
const areas = { Orchard: ['乌节', 'orchard'], Chinatown: ['牛车水', 'chinatown'], 'Marina Bay': ['滨海', 'marina'], Novena: ['诺维娜', 'novena'], Sentosa: ['圣淘沙', 'sentosa'], 'Toa Payoh': ['大巴窑', 'toa payoh'], Bishan: ['碧山', 'bishan'] };

export default function parseLocalQuery(text) {
  const q = text.toLowerCase();
  const find = map => Object.keys(map).find(k => map[k].some(w => q.includes(w)));
  const budget = q.match(/(?:人均|budget|\$)\s*(\d+)/) || q.match(/(\d+)\s*(?:新币|sgd|元)/);
  const people = q.match(/(\d+)\s*(?:个人|人|位|pax|people)/);
  const time = q.match(/(\d{1,2})\s*(?:点|pm|:00)/);
  let hour = time ? Number(time[1]) : null;
  if (hour && hour < 12 && (q.includes('晚') || q.includes('pm') || q.includes('tonight'))) hour += 12;
  return {
    cat: find(catWords), area: find(areas), budget: budget ? Number(budget[1]) : null,
    people: people ? Number(people[1]) : null, hour,
    kids: /小孩|孩子|亲子|kid|child|family/.test(q), tonight: /今晚|tonight/.test(q),
    keyword: text.trim()
  };
}

export function matchMerchants(list, f) {
  const scored = list.filter(x => (!f.cat || x.cat === f.cat) && (!f.budget || x.avg <= f.budget * 1.15) && (!f.kids || x.tags.includes('kids') || x.cat === 'food'))
    .map(x => ({ ...x, score: x.rating * 2 - x.km * 0.3 + (f.area && x.area === f.area ? 3 : 0) + (f.kids && x.tags.includes('kids') ? 2 : 0) + (f.tonight && x.tags.includes('tonight') ? 2 : 0) }));
  const hasSignal = f.cat || f.area || f.budget || f.kids || f.tonight;
  const pool = hasSignal ? scored : scored.filter(x => (x.zh + x.en + x.area).toLowerCase().includes(f.keyword.toLowerCase()));
  return pool.sort((a, b) => b.score - a.score);
}