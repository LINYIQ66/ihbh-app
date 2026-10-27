import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PartnerApplicationForm from '@/components/globest/PartnerApplicationForm';
import PartnerProductForm from '@/components/globest/PartnerProductForm';
import PartnerProductList from '@/components/globest/PartnerProductList';
import AccessNotice from '@/components/globest/AccessNotice';
import PageStatus from '@/components/globest/PageStatus';

export default function Partner() {
  const [user,setUser]=useState(null); const [application,setApplication]=useState(null); const [products,setProducts]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(null);
  const load=async()=>{
    setLoading(true);setError(null);
    try {
      if (!(await base44.auth.isAuthenticated())) { setUser(null); return; }
      const me=await base44.auth.me();setUser(me);
      const [apps,items]=await Promise.all([base44.entities.AgentApplication.filter({applicant_user_id:me.id},'-created_date',1),base44.entities.Product.filter({partner_id:me.id},'-created_date',100)]);
      setApplication(apps[0]||null);setProducts(items);
    } catch (failure) { const status=failure.status || failure.response?.status; if(status===401)setUser(null);setError(status || 'network'); }
    finally { setLoading(false); }
  };
  useEffect(()=>{load()},[]);
  if(loading)return <div className="page-inner flex justify-center gap-3 py-24" role="status"><Loader2 className="animate-spin" aria-hidden="true"/>正在加载代理商工作台…</div>;
  if(error===401 || (!error && !user))return <AccessNotice title="登录后进入代理商工作台" returnTo="/partner"/>;
  if(error)return <PageStatus title={error===403?'暂无权限访问工作台':'工作台暂时无法加载'} message={error===403?'当前账户无权读取所需资料，请确认账户权限；不会放宽访问限制。':'资料读取失败，请重试或返回首页。'} onRetry={load}/>;
  const status=application?.status||user?.partner_status;
  return <div className="page-inner"><div className="page-title"><span className="eyebrow">GLOBEST PARTNER PORTAL</span><h1>代理商工作台</h1><p>申请代理资格，提交商品，并随时查看审核状态。</p></div>{status==='rejected'&&application?.review_note&&<p className="mb-4 rounded-xl border border-destructive p-4 text-sm text-destructive">上次申请未通过：{application.review_note}</p>}{!application||status==='rejected'?<PartnerApplicationForm user={user} onSubmitted={load}/>:status==='approved'?<div className="grid lg:grid-cols-[1.35fr_.65fr] gap-6"><PartnerProductForm onSubmitted={load}/><PartnerProductList products={products}/></div>:<div className="bg-card border rounded-2xl p-8 text-center"><h2 className="font-heading text-2xl">申请审核中</h2><p className="text-muted-foreground mt-2">管理员正在审核 {application.business_name} 的代理申请，通过后即可提交商品。</p></div>}</div>;
}