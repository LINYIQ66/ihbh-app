import React, { useState } from 'react';
import MyProducts from '@/components/globest/MyProducts';
import HbhMaterialLibrary from '@/components/globest/hbh/HbhMaterialLibrary';
import MerchantListings from '@/components/globest/local/MerchantListings';
export default function DealerResources({ user }) {
  const [open, setOpen] = useState(false);
  return <details onToggle={e => setOpen(e.currentTarget.open)} className="rounded-2xl border border-border bg-card p-4 sm:p-5"><summary className="min-h-8 cursor-pointer font-semibold text-primary focus-visible:ring-2 focus-visible:ring-primary">经营商品与推广素材</summary>{open && <div className="mt-5 space-y-5"><MyProducts/><HbhMaterialLibrary showDownload/><MerchantListings user={user}/></div>}</details>;
}