import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PhotoTile({ photo, onDelete = null }) {
  const { data } = useQuery({ queryKey: ['photo-url', photo.file_uri], queryFn: () => base44.integrations.Core.CreateFileSignedUrl({ file_uri: photo.file_uri, expires_in: 3600 }), staleTime: 3000000 });
  return <div className="relative overflow-hidden rounded-lg bg-muted">
    {data?.signed_url ? <img src={data.signed_url} alt="" className="aspect-square w-full object-cover"/> : <div className="aspect-square"/>}
    {onDelete && <button onClick={onDelete} aria-label="Delete" className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"><X size={12}/></button>}
    <span className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-1 text-[10px] text-white">{photo.taken_at}{photo.session_no ? ` · #${photo.session_no}` : ''}{photo.note ? ` · ${photo.note}` : ''}</span>
  </div>;
}