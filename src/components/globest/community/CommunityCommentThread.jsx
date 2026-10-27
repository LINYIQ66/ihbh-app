import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

export default function CommunityCommentThread({ comments, onComment, onDelete, user, t }) {
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault();
    setBusy(true);setError('');
    try {await onComment({ author_name:author, content });setContent('');setOpen(true);}
    catch(err){setError(err.message||t('评论失败','Could not comment'));}
    finally{setBusy(false);}
  };
  return <div className="community-comments">
    <button className="community-comment-toggle" onClick={()=>setOpen(value=>!value)}><MessageCircle size={16}/>{comments.length} {t('条交流','comments')}</button>
    {open && <div className="community-comment-body">
      {comments.map(comment=><div className="community-comment" key={comment.id}><b>{comment.author_name}</b><span className="flex-1 break-words">{comment.content}</span>{user && (comment.created_by_id===user.id || user.role==='admin') && <button type="button" onClick={async()=>{try{setError('');await onDelete(comment);}catch(err){setError(err.message||t('删除失败','Could not delete'));}}} className="text-destructive underline">{t('删除','Delete')}</button>}</div>)}
      {!comments.length && <p className="community-no-comment">{t('还没有留言，来开启交流吧。','No comments yet. Start the conversation.')}</p>}
      {error&&<p role="alert" className="text-destructive text-xs">{error}</p>}<form onSubmit={submit}><input required value={author} onChange={e=>setAuthor(e.target.value)} placeholder={t('昵称','Name')}/><input required maxLength={240} value={content} onChange={e=>setContent(e.target.value)} placeholder={t('写下你的交流…','Write a comment…')}/><button disabled={busy} aria-label={t('发送评论','Send comment')}><Send size={15}/></button></form>
    </div>}
  </div>;
}