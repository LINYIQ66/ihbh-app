import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { categories } from '@/components/globest/CatalogFilters';
const empty={name_zh:'',name_en:'',category:'ginseng',price:0,unit:'',image:'',origin_zh:'',origin_en:'',description_zh:'',description_en:'',source_url:'',is_demo:true,approval_status:'pending',dealer_enabled:false,dealer_sale_category:'general',dealer_price_partner:'',dealer_price_official:'',dealer_price_agent:''};
export default function AdminProductForm({ product, onSaved, onCancel }) {
  const [form,setForm]=useState(product?{...empty,...product}:empty);
  const [saving,setSaving]=useState(false); const [error,setError]=useState('');
  const change=(key,value)=>setForm(f=>({...f,[key]:value}));
  const upload=async(file)=>{if(!file)return;setSaving(true);setError('');try{const {file_url}=await base44.integrations.Core.UploadFile({file});change('image',file_url)}catch(e){setError(e.message)}finally{setSaving(false)}};
  const submit=async(e)=>{e.preventDefault();setError('');setSaving(true);try{
    const {id,created_date,updated_date,created_by_id,...values}=form;
    if(!values.is_demo && Number(values.price)<=0)throw new Error('正式商品需填写有效售价。');
    const payload={...values,price:Number(values.price)};
    if(values.dealer_enabled){
      for(const tier of ['partner','official','agent']) { const value=Number(values[`dealer_price_${tier}`]); if(!Number.isFinite(value)||value<=0||Math.abs(value*100-Math.round(value*100))>0.00001)throw new Error('三个经销等级均需填写有效拿货价（最多两位小数）。'); payload[`dealer_price_${tier}`]=value; }
    } else for(const tier of ['partner','official','agent'])delete payload[`dealer_price_${tier}`];
    if(product)await base44.entities.Product.update(product.id,payload);else await base44.entities.Product.create(payload);
    onSaved();
  }catch(e){setError(e.message||'保存失败，请重试。')}finally{setSaving(false)}};
  return <form onSubmit={submit} className="space-y-3 rounded-xl border bg-card p-4">
    <h3 className="font-semibold">{product?'编辑商品 / Edit product':'新增商品 / Add product'}</h3>
    <div className="grid gap-3 sm:grid-cols-2">
      <label>中文名称<input className="w-full rounded border p-2" required value={form.name_zh} onChange={e=>change('name_zh',e.target.value)}/></label>
      <label>English name<input className="w-full rounded border p-2" required value={form.name_en} onChange={e=>change('name_en',e.target.value)}/></label>
      <label>分类 / Category<select className="w-full rounded border p-2" value={form.category} onChange={e=>change('category',e.target.value)}>{categories.slice(1).map(([key,zh,en])=><option key={key} value={key}>{zh} / {en}</option>)}</select></label>
      <label>状态 / Listing type<select className="w-full rounded border p-2" value={form.is_demo?'preview':'verified'} onChange={e=>change('is_demo',e.target.value==='preview')}><option value="preview">资料录入 / Catalog entry</option><option value="verified">已核实商品 / Verified listing</option></select></label>
      <label>商品价格 / Price (SGD)<input className="w-full rounded border p-2" type="number" min="0" step="0.01" value={form.price} onChange={e=>change('price',e.target.value)}/></label>
      <label>规格 / Unit<input className="w-full rounded border p-2" value={form.unit||''} onChange={e=>change('unit',e.target.value)}/></label>
      <label>产地 / Origin<input className="w-full rounded border p-2" value={form.origin_zh||''} onChange={e=>change('origin_zh',e.target.value)}/></label>
      <label>Origin (English)<input className="w-full rounded border p-2" value={form.origin_en||''} onChange={e=>change('origin_en',e.target.value)}/></label>
      <label className="sm:col-span-2">图片网址 / Image URL<input className="w-full rounded border p-2" type="url" required value={form.image} onChange={e=>change('image',e.target.value)}/></label>
      <label className="sm:col-span-2">或上传图片 / Upload image<input className="block w-full" type="file" accept="image/*" onChange={e=>upload(e.target.files?.[0])}/></label>
      <label className="sm:col-span-2">资料来源 / Source URL<input className="w-full rounded border p-2" type="url" value={form.source_url||''} onChange={e=>change('source_url',e.target.value)}/></label>
      <label className="sm:col-span-2">中文说明<textarea className="w-full rounded border p-2" value={form.description_zh||''} onChange={e=>change('description_zh',e.target.value)}/></label>
      <label className="sm:col-span-2">English description<textarea className="w-full rounded border p-2" value={form.description_en||''} onChange={e=>change('description_en',e.target.value)}/></label>
    </div>
    <fieldset className="space-y-3 rounded-lg border p-3"><legend>经销采购与分润配置</legend>
      <label className="flex gap-2"><input type="checkbox" checked={form.dealer_enabled} onChange={e=>change('dealer_enabled',e.target.checked)}/>允许经销商采购（必须核实各等级拿货价）</label>
      {form.dealer_enabled && <><div className="grid gap-3 sm:grid-cols-3">{[['partner','合伙人'],['official','官方'],['agent','总代']].map(([tier,label])=><label key={tier}>{label}拿货价 S$<input type="number" min="0.01" step="0.01" required className="w-full rounded border p-2" value={form[`dealer_price_${tier}`]} onChange={e=>change(`dealer_price_${tier}`,e.target.value)}/></label>)}</div>
      <label>分润类别<select className="ml-2 rounded border p-2" value={form.dealer_sale_category} onChange={e=>change('dealer_sale_category',e.target.value)}><option value="general">全业产品：按等级计算渠道返利</option><option value="genecells">GeneCells：不计全业渠道返利</option></select></label><p className="text-xs text-muted-foreground">价格和类别随采购单保存；修改只影响之后的新采购，不改历史成本。</p></>}
    </fieldset>
    <p className="text-xs text-muted-foreground">发布前请核实商品来源、价格和供应情况。</p>
    {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="flex gap-2"><button className="primary-btn" disabled={saving}>{saving?'保存中…':'保存商品 / Save'}</button><button type="button" className="secondary-btn" onClick={onCancel}>取消 / Cancel</button></div>
  </form>;
}