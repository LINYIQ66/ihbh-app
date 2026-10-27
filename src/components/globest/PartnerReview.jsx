import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import ApplicationReviewCard from '@/components/globest/review/ApplicationReviewCard';
import ProductReviewCard from '@/components/globest/review/ProductReviewCard';

export default function PartnerReview() {
  const [user, setUser] = useState(null); const [apps, setApps] = useState([]); const [products, setProducts] = useState([]); const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const me = await base44.auth.me(); setUser(me);
      if (me.role === 'admin') { const [a, p] = await Promise.all([base44.entities.AgentApplication.filter({ status: 'pending' }, '-created_date', 100), base44.entities.Product.filter({ approval_status: 'pending' }, '-created_date', 100)]); setApps(a); setProducts(p); }
    } catch { setUser(null); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  if (loading) return <p className="empty-state">正在加载审核资料…</p>;
  if (user?.role !== 'admin') return <p className="empty-state">请先登录管理员账号，再进行商家和商品审核。</p>;
  return <div className="grid lg:grid-cols-2 gap-6">
    <section className="crm-table-card p-5"><h2 className="font-heading text-xl mb-4">商家入驻审核（{apps.length}）</h2>{apps.length ? apps.map(a => <ApplicationReviewCard key={a.id} app={a} onReviewed={load} />) : <p className="muted text-sm">暂无待审核入驻申请。</p>}</section>
    <section className="crm-table-card p-5"><h2 className="font-heading text-xl mb-4">商品合规审核（{products.length}）</h2>{products.length ? products.map(p => <ProductReviewCard key={p.id} product={p} onReviewed={load} />) : <p className="muted text-sm">暂无待审核商品。</p>}</section>
  </div>;
}