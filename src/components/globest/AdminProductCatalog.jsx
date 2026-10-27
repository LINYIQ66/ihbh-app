import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminProductForm from '@/components/globest/AdminProductForm';
import { categories } from '@/components/globest/CatalogFilters';
export default function AdminProductCatalog(){
 const client=useQueryClient();const [editing,setEditing]=useState(undefined);const [busy,setBusy]=useState('');const [error,setError]=useState('');
 const {data:products=[],isLoading,isError,refetch}=useQuery({queryKey:['admin-products'],queryFn:()=>base44.entities.Product.list('-created_date',500)});
 const refresh=()=>{client.invalidateQueries({queryKey:['admin-products']});client.invalidateQueries({queryKey:['products']})};
 const changeStatus=async(p)=>{setBusy(p.id);setError('');try{await base44.entities.Product.update(p.id,{approval_status:p.approval_status==='published'?'pending':'published'});refresh()}catch(e){setError(e.message)}finally{setBusy('')}};
 const remove=async(p)=>{if(!window.confirm(`确认删除 ${p.name_zh}？ / Delete this product?`))return;setBusy(p.id);setError('');try{await base44.entities.Product.delete(p.id);refresh()}catch(e){setError(e.message)}finally{setBusy('')}};
 return <section className="rounded-xl border bg-card p-4 sm:p-6 space-y-5"><div className="flex items-center justify-between gap-2"><div><h2 className="text-xl font-semibold">商品管理 / Products</h2><p className="text-sm text-muted-foreground">新增和管理商城商品与上架状态。</p></div><button className="primary-btn shrink-0" onClick={()=>setEditing(null)}>+ 新增商品</button></div>
 {editing!==undefined&&<AdminProductForm key={editing?.id||'new'} product={editing} onCancel={()=>setEditing(undefined)} onSaved={()=>{setEditing(undefined);refresh()}}/>}
 {error&&<p role="alert" className="text-destructive text-sm">{error}</p>}
 {isLoading?<p>正在加载商品… / Loading products…</p>:isError?<button className="secondary-btn" onClick={()=>refetch()}>加载失败，重试 / Retry</button>:!products.length?<p className="text-muted-foreground">暂无商品 / No products yet</p>:<div className="divide-y">{products.map(p=><div key={p.id} className="py-3 flex flex-wrap items-center gap-3"><div className="min-w-0 flex-1"><div className="font-medium truncate">{p.name_zh} · {p.name_en}</div><div className="text-xs text-muted-foreground">{categories.find(c=>c[0]===p.category)?.[1]||p.category} · {p.is_demo?'资料录入 / Catalog entry':'已核实 / Verified'} · {p.approval_status==='published'?'已展示 / Live':'未展示 / Hidden'}</div></div><button className="secondary-btn" onClick={()=>setEditing(p)}>编辑</button><button className="secondary-btn" disabled={busy===p.id} onClick={()=>changeStatus(p)}>{p.approval_status==='published'?'下架':'上线'}</button><button className="secondary-btn" disabled={busy===p.id} onClick={()=>remove(p)}>删除</button></div>)}</div>}
 </section>;
}