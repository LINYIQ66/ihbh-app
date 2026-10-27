import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import PromotionForm from '@/components/globest/PromotionForm';
import PromotionShare from '@/components/globest/PromotionShare';
import { promotionUrl } from '@/components/globest/promotionLinks';

export default function MemberPromotions() {
  const { t, notify } = useExperience();
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [sharingId, setSharingId] = useState(null);
  const userQuery = useQuery({queryKey:['promotion-user'],queryFn:async()=>{if(!await base44.auth.isAuthenticated())return null;const {data}=await base44.functions.invoke('ensureInviteCode',{});const user=await base44.auth.me();return {...user,display_name:user.display_name,invite_code:data.inviteCode||user.invite_code};}});
  const user = userQuery.data;
  const productsQuery = useQuery({queryKey:['promotion-products'],queryFn:()=>base44.entities.Product.list('-created_date',200),enabled:!!user});
  const postsQuery = useQuery({queryKey:['my-promotions',user?.id],queryFn:()=>base44.entities.MemberPromotion.filter({created_by_id:user.id},'-created_date',100),enabled:!!user?.id});
  const products = (productsQuery.data || []).filter(p=>p.approval_status==='published');
  const save = async values => {
    if (!products.some(p=>p.id===values.product_id)) throw new Error(t('请选择已展示的商品','Choose a listed product'));
    if (editing) await base44.entities.MemberPromotion.update(editing.id,values);
    else await base44.entities.MemberPromotion.create({...values,invite_code:user.invite_code});
    setEditing(null); await postsQuery.refetch();
  };
  const publishForum = async post => {
    setSharingId(post.id);setError('');
    try {
      const product=products.find(p=>p.id===post.product_id);
      const content={author_name:user.display_name||user.full_name||user.email.split('@')[0],content:post.body.slice(0,600),topic:'promotion',promotion_id:post.id,product_id:post.product_id,product_name_zh:product?.name_zh,product_name_en:product?.name_en};
      const existing=await base44.entities.CommunityPost.filter({promotion_id:post.id},'-created_date',1);
      if(existing.length) await base44.entities.CommunityPost.update(existing[0].id,content);
      else await base44.entities.CommunityPost.create(content);
      notify(t('已分享到论坛','Shared to the community'));
    } catch(err) {setError(err.message||t('分享失败','Could not share to community'));}
    finally {setSharingId(null);}
  };
  const remove = async post => {
    if (!window.confirm(t('确定删除这篇推广文章？','Delete this promotion?'))) return;
    setError('');
    try { await base44.entities.MemberPromotion.delete(post.id); await postsQuery.refetch(); if(editing?.id===post.id)setEditing(null); }
    catch(err) { setError(err.message || t('删除失败','Could not delete')); }
  };
  if (userQuery.isLoading) return <p className="p-8 text-center">{t('正在准备推广中心…','Preparing promotion center…')}</p>;
  if (userQuery.isError) return <p role="alert" className="p-8 text-destructive">{t('无法读取会员资料，请稍后重试。','Could not load your account. Please try again later.')}</p>;
  if (!user) return <div className="referral-login"><h3>{t('登录后创建推广文章','Sign in to create promotions')}</h3><button className="primary-btn" onClick={()=>base44.auth.redirectToLogin('/crm?role=user&tab=promotions')}>{t('登录账户','Sign in')}</button></div>;
  return <div className="space-y-6"><p className="text-sm text-muted-foreground">{t('撰写推广文章，关联已展示商品，然后将文章链接分享至多个社交平台。','Write an article, link a listed product, then share it on social platforms.')}</p>
    {productsQuery.isLoading?<p>{t('正在加载商品…','Loading products…')}</p>:productsQuery.isError?<p role="alert" className="text-destructive">{t('商品加载失败','Could not load products')}</p>:<PromotionForm key={editing?.id || 'new'} products={products} initial={editing} onSave={save} onCancel={()=>setEditing(null)}/>}
    {error&&<p role="alert" className="text-destructive">{error}</p>}
    <h3 className="font-heading text-xl">{t('我的推广文章','My promotions')}</h3>
    {postsQuery.isLoading?<p>{t('正在加载文章…','Loading articles…')}</p>:postsQuery.isError?<p role="alert" className="text-destructive">{t('文章加载失败','Could not load articles')}</p>:!postsQuery.data?.length?<p className="rounded-xl border bg-card p-6 text-muted-foreground">{t('还没有推广文章。','No promotions yet.')}</p>:<div className="grid gap-4">{postsQuery.data.map(post=><article key={post.id} className="space-y-3 rounded-xl border bg-card p-5"><Link to={`/promotion/${post.id}`} className="font-heading text-lg text-primary hover:underline">{post.title}</Link><p className="line-clamp-2 whitespace-pre-wrap text-sm text-muted-foreground">{post.body}</p><PromotionShare url={promotionUrl(post.id)} title={post.title}/><div className="flex gap-3 text-sm"><button onClick={()=>{setEditing(post);window.scrollTo({top:0,behavior:'smooth'});}} className="text-primary underline">{t('编辑','Edit')}</button><button disabled={sharingId===post.id} onClick={()=>publishForum(post)} className="text-primary underline">{sharingId===post.id?t('分享中…','Sharing…'):t('分享到论坛','Post to community')}</button><button onClick={()=>remove(post)} className="text-destructive underline">{t('删除','Delete')}</button></div></article>)}</div>}
  </div>;
}