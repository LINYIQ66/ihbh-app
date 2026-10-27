import { createClientFromRequest } from 'npm:@base44/sdk@0.8.57';
import { postSettlement } from '../../shared/dealerSettlement.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(e => e.status === 401 ? null : Promise.reject(e));
    if (!user) return Response.json({ error: '请先登录' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: '仅管理员可执行订单入账' }, { status: 403 });
    const { order_id } = await req.json().catch(() => ({}));
    if (typeof order_id !== 'string' || !/^[a-f0-9]{24}$/.test(order_id)) return Response.json({ error: '缺少有效订单编号' }, { status: 400 });
    const order = await base44.asServiceRole.entities.ShipOrder.get(order_id).catch(e => e.status === 404 ? null : Promise.reject(e));
    if (!order) return Response.json({ error: '订单不存在' }, { status: 404 });
    return Response.json(await postSettlement(base44.asServiceRole, order_id));
  } catch (error) {
    console.error('经销商订单入账失败', error.message);
    return Response.json({ error: error.message }, { status: error.status || 500 });
  }
}