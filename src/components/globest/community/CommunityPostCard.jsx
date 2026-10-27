import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Leaf, Sprout } from 'lucide-react';
import { useExperience } from '@/components/globest/ExperienceProvider';
import CommunityProductLink from './CommunityProductLink';
import CommunityCommentThread from './CommunityCommentThread';

export default function CommunityPostCard({ post, product, promotion, comments, user, likes, liked, liking, onLike, onComment, onUpdate, onDelete, onDeleteComment }) {
  const { t } = useExperience();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const ginseng = post.topic === 'ginseng';
  const owner = user && (post.created_by_id===user.id || user.role==='admin');
  const date = new Date(post.created_date).toLocaleDateString(undefined,{month:'short',day:'numeric'});
  const save = async()=>{setBusy(true);setError('');try{await onUpdate(post,content.trim());setEditing(false);}catch(err){setError(err.message||t('保存失败','Could not save'));}finally{setBusy(false);}};
  const remove = async()=>{if(!window.confirm(t('确定删除这条帖子？','Delete this post?')))return;setBusy(true);setError('');try{await onDelete(post);}catch(err){setError(err.message||t('删除失败','Could not delete'));setBusy(false);}};
  return <article className="community-post">
    <header><div className={ginseng?'community-avatar ginseng':'community-avatar'}>{ginseng?<Sprout size={20}/>:<Leaf size={20}/>}</div><div><b>{post.author_name}</b><span>{date} · {post.topic==='promotion'?t('会员分享','Member story'):ginseng?t('人参养成','Ginseng journey'):t('养生心得','Wellness insight')}</span></div>{ginseng && post.ginseng_level && <em>{t(`参苗 ${post.ginseng_level} 阶`,`Level ${post.ginseng_level}`)}</em>}</header>
    {editing?<div className="mt-4 space-y-2"><textarea maxLength={600} value={content} onChange={e=>setContent(e.target.value)} className="w-full rounded-lg border bg-background p-3" rows={4}/><div className="flex gap-3 text-sm"><button disabled={busy||!content.trim()} onClick={save} className="text-primary underline">{t('保存','Save')}</button><button onClick={()=>{setEditing(false);setContent(post.content);}}>{t('取消','Cancel')}</button></div></div>:<p className="community-post-copy">{post.content}</p>}
    {ginseng && post.ginseng_level && <div className="ginseng-progress"><span style={{width:`${Math.min(post.ginseng_level,6)/6*100}%`}}/></div>}
    {promotion&&<Link to={`/promotion/${promotion.id}`} className="mb-3 block rounded-lg border bg-muted p-3 text-sm text-primary underline">{t('阅读推广文章：','Read member story: ')}{promotion.title}</Link>}
    <CommunityProductLink product={product}/>
    {error&&<p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
    <footer><button disabled={liking} className="community-like" aria-pressed={!!liked} onClick={async()=>{try{setError('');await onLike(post);}catch(err){setError(err.message||t('操作失败','Action failed'));}}}><Heart size={17} fill={liked?'currentColor':'none'}/>{likes} {t('喜欢','likes')}</button><CommunityCommentThread comments={comments} user={user} onComment={onComment} onDelete={onDeleteComment} t={t}/>{owner&&<div className="flex gap-3 text-xs"><button onClick={()=>setEditing(true)} className="text-primary underline">{t('编辑','Edit')}</button><button disabled={busy} onClick={remove} className="text-destructive underline">{t('删除','Delete')}</button></div>}</footer>
  </article>;
}