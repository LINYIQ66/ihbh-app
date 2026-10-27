import { createClientFromRequest } from 'npm:@base44/sdk@0.8.57';
import { secrets } from 'base44:runtime';

import { quota } from '../../shared/quota.ts';

const toBase64 = (buf) => {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    await quota(base44.asServiceRole,user,'face_reading',5);
    const form=await req.formData(),file=form.get('file'),lang=form.get('lang');
    if(!(file instanceof File)||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>6*1024*1024)return Response.json({error:'Unsupported image or image too large'},{status:400});
    const buf=await file.arrayBuffer(),mime=file.type;

    const products = await base44.entities.Product.filter({ approval_status: 'published' }, '-created_date', 150);
    const catalog = products.map(p => `${p.id} | ${p.name_zh} / ${p.name_en} | ${p.category} | SGD ${p.price}`).join('\n');
    const zh = lang !== 'en';

    const prompt = `你是一位资深中医望诊顾问。请依据真实的中医望诊理论（《黄帝内经》面部五色、五官对应五脏：额-心、鼻-脾、左颊-肝、右颊-肺、颏-肾；面色青赤黄白黑；神、色、形、态；唇色、眼周、光泽与浮肿等），仔细观察照片中的面部。
要求：
1. 先判断照片是否为清晰正面人脸；若不是，face_detected=false，并说明如何重拍。
2. 逐项描述观察到的面色、光泽、各分区特征、唇与眼周，并对应中医脏腑理论解读。
3. 给出最可能的中医体质（九种体质之一：平和、气虚、阳虚、阴虚、痰湿、湿热、血瘀、气郁、特禀）及理由。
4. 给出3-5条实用的日常饮食、作息与调养建议。
5. 只能从下列商城商品中选择1-3款最合适的补品，用其 id，说明理由；没有合适的就留空。
6. 明确这只是体质参考，不是医疗诊断；如有明显异常建议就医。
请用${zh ? '简体中文' : 'English'}回答，只输出 JSON：
{"face_detected":bool,"observations":[{"area":"","finding":"","tcm_meaning":""}],"constitution":"","constitution_reason":"","advice":[""],"products":[{"id":"","reason":""}],"note":""}

商品列表：
${catalog}`;

    const aiRes = await fetch('https://sandy.amt.land/v1/chat/completions', {
      method: 'POST', signal: AbortSignal.timeout(45000),
      headers: { 'Authorization': `Bearer ${secrets.get('KOPI_API_KEY')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'grok-4.5', max_tokens: 1600,
        messages: [{ role: 'user', content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:${mime};base64,${toBase64(buf)}` } }
        ] }]
      })
    });
    const rawBody = await aiRes.text();
    let data;
    try { data = JSON.parse(rawBody); } catch { console.error('AI non-JSON', aiRes.status, rawBody.slice(0, 300)); return Response.json({ error: zh ? '分析服务暂时繁忙，请稍后重试' : 'Analysis service busy, please retry' }, { status: 502 }); }
    if (!aiRes.ok) { console.error('AI error', JSON.stringify(data)); return Response.json({ error: data?.error?.message || 'AI service error' }, { status: 502 }); }
    const text = data.choices?.[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return Response.json({ error: 'Could not read analysis', raw: text }, { status: 502 });
    let result;
    try { result = JSON.parse(match[0]); } catch { console.error('Bad AI JSON', text.slice(0, 300)); return Response.json({ error: zh ? '分析结果解析失败，请重拍一次' : 'Could not read analysis, please retry' }, { status: 502 }); }
    const ids = new Set(products.map(p => p.id));
    result.products = (result.products || []).filter(p => ids.has(p.id)).slice(0, 3).map(p => {
      const prod = products.find(x => x.id === p.id);
      return { ...p, name_zh: prod.name_zh, name_en: prod.name_en, price: prod.price, image: prod.image };
    });
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: error.status || 500 });
  }
}