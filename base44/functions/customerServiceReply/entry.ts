import { createClientFromRequest } from 'npm:@base44/sdk@0.8.57';

import { quota } from '../../shared/quota.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user=await base44.auth.me();
    if(!user)return Response.json({error:'请先登录'},{status:401});
    await quota(base44.asServiceRole,user,'customer_service',30);
    const { history = [], lang = 'zh' } = await req.json();
    const msgs = (Array.isArray(history) ? history : []).slice(-10)
      .map(m => `${m.from === 'me' ? 'Customer' : 'Agent'}: ${String(m.text || '').slice(0, 500)}`).join('\n');
    if (!msgs) return Response.json({ error: 'Empty message' }, { status: 400 });
    const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are the 24/7 AI customer service agent of Globest Mall (Singapore, prices in SGD), a wellness e-commerce and local services platform by Hong Kong Jiuzhentang / HBH.
You help with: product recommendations (HBH Green Oxygen Chamber, Smart Sleep Pillow, Eye Massager, Moxibustion Device, Aromatherapy, GeneCells packages), order status, logistics tracking, returns/exchanges/refunds (7-day no-reason returns for unopened goods, refunds in 3-5 working days), membership and points, and FAQs.
Reply in the customer's language (default ${lang === 'zh' ? 'Simplified Chinese' : 'English'}), concise, friendly, max 120 words. Never give medical diagnoses.
If the issue is complex (dispute, complaint, payment failure, damaged goods, or customer asks for a human), set handoff=true.

Conversation:
${msgs}`,
      response_json_schema: { type: 'object', properties: { reply: { type: 'string' }, handoff: { type: 'boolean' } }, required: ['reply', 'handoff'] },
    });
    return Response.json(res);
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: error.status || 500 });
  }
}