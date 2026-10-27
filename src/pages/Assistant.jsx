import React from 'react';
import AssistantChat from '@/components/globest/AssistantChat';
import FaceReading from '@/components/globest/FaceReading';
import { useExperience } from '@/components/globest/ExperienceProvider';

export default function Assistant() {
  const { t } = useExperience();
  return <div className="page-inner"><div className="page-title"><span className="eyebrow">iHBH WELLNESS ASSISTANT</span><h1>{t('iHBH 智能养生助手','iHBH Wellness Assistant')}</h1><p>{t('交流日常养生知识，并从已审核的商城商品中获得个性化推荐。','Explore everyday wellness knowledge and recommendations from approved mall products.')}</p></div><FaceReading/><AssistantChat/><p className="demo-note mt-4">{t('内容仅供一般健康教育参考，不构成诊断或医疗建议。','General wellness education only; not medical advice or diagnosis.')}</p></div>;
}