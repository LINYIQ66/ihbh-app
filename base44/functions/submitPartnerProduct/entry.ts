import { createClientFromRequest } from 'npm:@base44/sdk@0.8.57';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: '请先登录' }, { status: 401 });
    if (user.role !== 'admin' && !(await base44.asServiceRole.entities.AgentApplication.count({applicant_user_id:user.id,status:'approved'}))) return Response.json({ error: '代理商资格尚未通过审核' }, { status: 403 });
    const body = await req.json();
    const required = ['name_zh', 'name_en', 'category', 'price', 'image'];
    if (required.some((key) => !body[key])) return Response.json({ error: '请填写全部必填信息' }, { status: 400 });
    const price = Number(body.price);
    if (!Number.isFinite(price) || price <= 0) return Response.json({ error: '商品价格无效' }, { status: 400 });
    const product = await base44.asServiceRole.entities.Product.create({
      name_zh: String(body.name_zh).slice(0, 120), name_en: String(body.name_en).slice(0, 120),
      category: String(body.category).slice(0, 60), price, unit: String(body.unit || '件').slice(0, 20),
      image: String(body.image).slice(0, 1000), description_zh: String(body.description_zh || '').slice(0, 2000),
      description_en: String(body.description_en || '').slice(0, 2000), approval_status: 'pending',
      partner_id: user.id, partner_name: user.business_name || user.full_name || user.email, is_demo: false
    });
    return Response.json({ id: product.id, approval_status: product.approval_status });
  } catch (error) {
    console.error('submitPartnerProduct failed', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}