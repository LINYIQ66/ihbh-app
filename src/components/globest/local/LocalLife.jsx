import React, { useState } from 'react';
import LocalMerchantCard from '@/components/globest/local/LocalMerchantCard';
import LocalMerchantDetail from '@/components/globest/local/LocalMerchantDetail';
import LocalDemoDirectory from '@/components/globest/local/LocalDemoDirectory';
import LocalServices from '@/components/globest/LocalServices';
import usePublicCollection from '@/components/globest/usePublicCollection';
import CollectionFeedback from '@/components/globest/CollectionFeedback';

export default function LocalLife() {
  const [selected, setSelected] = useState(null);
  const collection = usePublicCollection('LocalListing', { approval_status: 'published' }, '-created_date');
  return <div className="customer-module space-y-5 pb-8">
    <LocalServices/>
    {(collection.isPending || collection.isError || collection.countError || collection.items.length > 0) && <section aria-label="已发布商户服务" className="space-y-3">
      {collection.items.length > 0 && <h2 className="text-lg font-semibold">已发布商户服务</h2>}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">{collection.items.map(m => <LocalMerchantCard key={m.id} merchant={m} onSelect={setSelected}/>)}</div>
      <CollectionFeedback collection={collection} autoLoad unit="家" empty="暂无符合条件的已发布商户。"/>
    </section>}
    <LocalDemoDirectory onSelect={setSelected}/>
    <LocalMerchantDetail merchant={selected} onClose={() => setSelected(null)}/>
  </div>;
}