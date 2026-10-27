import React from 'react';
import RecordedVideo from '@/components/globest/videos/RecordedVideo';
import { materialVideos } from '@/components/globest/hbh/hbhMaterials';
import { DEMO_VIDEO } from '@/components/globest/shopper/shopperCourses';

export default function ExistingVideoArchive() {
  return <section className="mt-8 space-y-4" aria-labelledby="existing-video-title">
    <h2 id="existing-video-title" className="text-xl font-semibold">站内已有视频素材</h2>
    <p className="text-sm text-muted-foreground">以下直接复用原巧掌柜介绍和 HBH 产品资料库的预录来源，不依赖视频刊登数量；不冒充直播、探店或每门课程的独立录像，内容不构成医疗建议。</p>
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RecordedVideo title="巧掌柜介绍视频" src={DEMO_VIDEO} description="原站巧掌柜介绍板块的同一既有预录素材；非直播，未替换样片。"/>
      {materialVideos.map(([title, , src, vertical]) => <RecordedVideo key={src} title={title} src={src} vertical={vertical} description="原 HBH 产品资料库预录视频，保留既有标题和来源。"/>)}
    </div>
  </section>;
}