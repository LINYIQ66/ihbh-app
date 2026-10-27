import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useExperience } from '@/components/globest/ExperienceProvider';
import CommunityComposer from '@/components/globest/community/CommunityComposer';
import CommunityPostCard from '@/components/globest/community/CommunityPostCard';
import CommunityFilters from '@/components/globest/community/CommunityFilters';
import '@/components/globest/community/community.css';

export default function Feed() {
  const { t, notify } = useExperience();
  const [topic,setTopic] = useState('all');
  const [search,setSearch] = useState('');
  const [liking,setLiking] = useState(null);
  const userQuery = useQuery({queryKey:['community-user'],queryFn:async()=>await base44.auth.isAuthenticated()?base44.auth.me():null});
  const user = userQuery.data;
  const term = search.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const postsQuery = useQuery({queryKey:['community-posts',topic,term],queryFn:async()=>{const q={...(topic!=='all'&&{topic}),...(term&&{$or:['content','author_name','product_name_zh','product_name_en'].map(f=>({[f]:{$regex:term,$options:'i'}}))})};return (await base44.entities.CommunityPost.filter(q,{sort:'-created_date',limit:100})).items;},placeholderData:prev=>prev});
  const commentsQuery = useQuery({queryKey:['community-comments'],queryFn:()=>base44.entities.CommunityComment.list('-created_date',500)});
  const likesQuery = useQuery({queryKey:['community-likes'],queryFn:()=>base44.entities.CommunityLike.list('-created_date',500)});
  const productsQuery = useQuery({queryKey:['community-products'],queryFn:()=>base44.entities.Product.list('-created_date',200)});
  const promotionsQuery = useQuery({queryKey:['community-promotions'],queryFn:()=>base44.entities.MemberPromotion.list('-created_date',200)});
  const products = (productsQuery.data || []).filter(product=>product.approval_status === 'published');
  const visible = postsQuery.data || [];
  const publish = async data => { await base44.entities.CommunityPost.create(data); await postsQuery.refetch(); notify(t('动态发布成功','Your post is live')); };
  const comment = async (postId,data) => { await base44.entities.CommunityComment.create({...data,post_id:postId}); await commentsQuery.refetch(); };
  const deleteComment = async item => { await base44.entities.CommunityComment.delete(item.id); await commentsQuery.refetch(); };
  const updatePost = async (post,content) => { await base44.entities.CommunityPost.update(post.id,{content}); await postsQuery.refetch(); };
  const deletePost = async post => { await base44.entities.CommunityPost.delete(post.id); await postsQuery.refetch(); };
  const like = async post => {
    if(!user){base44.auth.redirectToLogin('/feed');return;}
    if(liking)return;
    setLiking(post.id);
    try {const mine=(likesQuery.data||[]).find(item=>item.post_id===post.id&&item.created_by_id===user.id);if(mine)await base44.entities.CommunityLike.delete(mine.id);else await base44.entities.CommunityLike.create({post_id:post.id});await likesQuery.refetch();}
    finally {setLiking(null);}
  };
  return <div className="page-inner community-page"><section className="community-hero"><div><span className="eyebrow">GLOBEST WELLNESS COMMUNITY</span><h1>{t('社区互动广场','Wellness Community')}</h1><p>{t('分享养生心得，记录人参成长，与同好交流每一天的滋养灵感。','Share wellness insights, follow ginseng journeys, and connect over everyday rituals.')}</p></div><div className="community-hero-stat"><div><b>{postsQuery.data?.length||0}</b><span>{t('社区动态','POSTS')}</span></div><div><b>{commentsQuery.data?.length||0}</b><span>{t('真诚交流','COMMENTS')}</span></div></div></section>
    <CommunityComposer products={products} publishing={postsQuery.isFetching} onPublish={publish}/><CommunityFilters topic={topic} setTopic={setTopic} search={search} setSearch={setSearch}/>
    <div className="community-layout"><main className="community-feed">{postsQuery.isLoading?<div className="community-empty">{t('正在加载社区动态…','Loading community posts…')}</div>:postsQuery.isError?<div role="alert" className="community-empty">{t('动态加载失败','Could not load posts')}</div>:visible.map(post=><CommunityPostCard key={post.id} post={post} user={user} product={products.find(item=>item.id===post.product_id)} promotion={(promotionsQuery.data||[]).find(item=>item.id===post.promotion_id)} comments={(commentsQuery.data||[]).filter(item=>item.post_id===post.id)} likes={(post.likes||0)+(likesQuery.data||[]).filter(item=>item.post_id===post.id).length} liked={(likesQuery.data||[]).some(item=>item.post_id===post.id&&item.created_by_id===user?.id)} liking={liking===post.id} onLike={like} onComment={data=>comment(post.id,data)} onUpdate={updatePost} onDelete={deletePost} onDeleteComment={deleteComment}/>)}{!postsQuery.isLoading&&!postsQuery.isError&&!visible.length&&<div className="community-empty"><Users className="mx-auto mb-3"/>{search||topic!=='all'?t('没有匹配的帖子，请调整搜索或话题。','No matching posts. Try another search or topic.'):t('成为第一位分享者。','Be the first to share.')}</div>}</main><aside className="community-aside"><h3>{t('广场话题','Community topics')}</h3><p>{t('尊重彼此经验，健康建议不替代专业医疗意见。','Respect lived experience. Community advice does not replace professional care.')}</p><ul><li># {t('每日养生','Daily wellness')}</li><li># {t('人参养成日记','Ginseng journal')}</li><li># {t('会员分享','Member stories')}</li></ul></aside></div>
  </div>;
}