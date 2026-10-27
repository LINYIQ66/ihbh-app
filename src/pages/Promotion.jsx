import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { useExperience } from '@/components/globest/ExperienceProvider';
import PromotionShare from '@/components/globest/PromotionShare';
import { inviteUrl, productPath, promotionUrl } from '@/components/globest/promotionLinks';

export default function Promotion() {
  const { id } = useParams();
  const { t } = useExperience();
  const postQuery = useQuery({queryKey:['promotion',id],queryFn:()=>base44.entities.MemberPromotion.get(id),enabled:!!id});
  const post = postQuery.data;
  const productQuery = useQuery({queryKey:['promotion-product',post?.product_id],queryFn:()=>base44.entities.Product.get(post.product_id),enabled:!!post?.product_id});
  const product = productQuery.data?.approval_status==='published' ? productQuery.data : null;
  if (postQuery.isLoading) return <div className="page-inner p-10 text-center">{t('正在加载文章…','Loading article…')}</div>;
  if (postQuery.isError || !post) return <div className="page-inner p-10 text-center">{t('文章不存在或暂时无法读取。','Article not found or unavailable.')}</div>;
  return <div className="page-inner"><article className="mx-auto max-w-3xl space-y-7 py-8"><div><span className="eyebrow">GLOBEST MEMBER STORIES</span><h1 className="mt-3 font-heading text-3xl text-primary">{post.title}</h1><p className="mt-3 text-sm text-muted-foreground">{new Date(post.created_date).toLocaleDateString()}</p></div><p className="whitespace-pre-wrap break-words leading-8">{post.body}</p>
    {productQuery.isLoading?<p>{t('正在加载关联商品…','Loading linked product…')}</p>:product?<Link to={productPath(product)} className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center"><Image src={product.image} alt={t(product.name_zh,product.name_en)} className="h-28 w-28 shrink-0 rounded-lg object-cover"/><div><h2 className="font-heading text-xl text-primary">{t(product.name_zh,product.name_en)}</h2><p className="my-2 text-sm">SGD {Number(product.price).toFixed(2)}</p><span className="text-sm text-primary underline">{t('查看商品详情','View product details')}</span></div></Link>:<p className="text-sm text-muted-foreground">{t('关联商品暂时无法查看。','The linked product is currently unavailable.')}</p>}
    <div className="rounded-xl border bg-card p-5"><p className="mb-3 text-sm">{t('喜欢这篇分享？通过专属邀请链接加入会员。','Enjoyed this story? Join through the member’s invite link.')}</p><a className="text-primary underline" href={inviteUrl(post.invite_code)}>{t('接受邀请并注册','Accept invite and register')}</a></div><div><p className="mb-3 text-sm font-semibold">{t('分享文章','Share article')}</p><PromotionShare url={promotionUrl(post.id)} title={post.title}/></div></article></div>;
}