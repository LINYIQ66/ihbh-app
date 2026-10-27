import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ScanFace, MessageSquareHeart, ShieldCheck } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function HbhAiConsult() {
  const { t } = useExperience();
  const items = /** @type {Array<[import('lucide-react').LucideIcon, string, string, string, string]>} */ ([[Bot, '健康问答', 'Health Q&A', '描述症状与生活习惯，AI 给出食养与作息建议。', 'Describe symptoms and habits; AI suggests diet and lifestyle tips.'], [ScanFace, 'AI 面诊', 'AI face reading', '上传正脸照片，参考中医望诊给出体质倾向。', 'Upload a face photo for a TCM-inspired constitution read.'], [MessageSquareHeart, '产品匹配', 'Product matching', '根据体质推荐合适的 HBH 与滋补产品。', 'Get HBH and tonic products matched to your constitution.']]);
  return <div className="space-y-4">
    <div className="grid gap-3 md:grid-cols-3">{items.map(([Icon, zh, en, dz, de]) => <Link key={en} to="/assistant" className="rounded-2xl border bg-card p-5 transition hover:shadow-md"><Icon className="mb-2 text-[#8a5a2b]" size={28} /><b className="block text-lg">{t(zh, en)}</b><p className="mt-1 text-sm text-muted-foreground">{t(dz, de)}</p></Link>)}</div>
    <Link to="/assistant" className="block rounded-full bg-[#8a5a2b] py-3 text-center font-bold text-white">{t('立即开始 AI 诊疗', 'Start AI consult')}</Link>
    <p className="flex items-start gap-2 rounded-xl bg-muted p-3 text-xs text-muted-foreground"><ShieldCheck size={16} className="shrink-0" />{t('AI 建议仅供健康参考，不构成医疗诊断，如有不适请及时就医。', 'AI suggestions are for wellness reference only and are not a medical diagnosis. See a doctor if unwell.')}</p>
  </div>;
}