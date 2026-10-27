import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, Heart, Moon, Activity, Bone, Sparkles } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import Catalog from '@/components/globest/Catalog';

const interests = /** @type {Array<[string, import('lucide-react').LucideIcon, string, string, string, string]>} */ ([
  ['eyes', Eye, '眼部营养', 'Eye nutrition', '叶黄素与日常营养', 'Lutein and everyday nutrition'],
  ['bones', Bone, '骨骼营养', 'Bone nutrition', '钙、维生素 D 与矿物质', 'Calcium, vitamin D and minerals'],
  ['gut', Activity, '肠道日常', 'Gut balance', '益生菌与消化营养', 'Probiotics and digestive nutrition'],
  ['skin', Sparkles, '肌肤营养', 'Skin nutrition', '胶原蛋白与美容营养', 'Collagen and beauty nutrition'],
  ['sleep', Moon, '睡眠休息', 'Sleep & rest', '了解配方与使用注意事项', 'Explore formulas and precautions'],
  ['heart', Heart, '心脏健康', 'Heart wellness', '鱼油与均衡膳食参考', 'Fish oil and balanced nutrition']
]);

export default function HbhSupplementCollection() {
  const { t } = useExperience();
  const [params] = useSearchParams();
  const concern = params.get('concern');
  return <div className="space-y-6">
    <section className="rounded-2xl border border-border bg-card p-5"><span className="text-xs tracking-widest text-muted-foreground">DAILY NUTRITION</span><h2 className="mt-2 font-heading text-2xl text-primary">{t('按自己的日常需要，认识营养补充', 'Explore nutrition for your daily routine')}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{t('从成分、每份含量、规格与适用人群入手，浏览已有营养商品。选择下方关注点，可直接查看对应商品。', 'Compare ingredients, serving amounts, sizes and intended users. Select an interest to browse matching products.')}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">{interests.map(([key, Icon, zh, en, dz, de]) => <Link key={key} to={`/discover?section=supplements&concern=${key}#catalog`} aria-current={concern === key ? 'true' : undefined} className={`rounded-xl border p-3 ${concern === key ? 'border-primary bg-primary/5' : 'border-border bg-muted/40 hover:bg-muted'}`}><Icon size={20} className="mb-2 text-primary" aria-hidden="true"/><b className="block text-sm text-primary">{t(zh, en)}</b><span className="mt-1 block text-xs leading-5 text-muted-foreground">{t(dz, de)}</span></Link>)}</div>
      {concern && <Link to="/discover?section=supplements#catalog" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary">{t('查看全部保健品 →', 'View all supplements →')}</Link>}
      <p className="mt-4 text-xs leading-6 text-muted-foreground">{t('营养补充品不能替代均衡饮食、药物或专业医疗建议；孕哺期、儿童及正在用药者，请先咨询专业人士。', 'Supplements do not replace a balanced diet, medication or professional advice. Consult a professional for children, pregnancy, breastfeeding or concurrent medication.')}</p>
    </section>
    <Catalog key={concern || 'all'} scope="supplements" title={['保健品 · 日常营养', 'Supplements & daily nutrition']}/>
  </div>;
}