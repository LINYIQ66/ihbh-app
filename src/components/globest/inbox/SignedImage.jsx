import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function SignedImage({ uri, className }) {
  const q = useQuery({ queryKey: ['signed', uri], queryFn: async () => (await base44.integrations.Core.CreateFileSignedUrl({ file_uri: uri, expires_in: 3600 })).signed_url, staleTime: 3000e3 });
  return q.data ? <a href={q.data} target="_blank" rel="noreferrer"><img src={q.data} alt="" className={className} /></a> : <div className={`${className} animate-pulse bg-muted`} />;
}