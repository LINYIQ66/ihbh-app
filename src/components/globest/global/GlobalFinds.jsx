import React, { useState } from 'react';


import GlobalProductCard from '@/components/globest/global/GlobalProductCard';
import ProductMasonry from '@/components/globest/ProductMasonry';
import GlobalProductDetail from '@/components/globest/global/GlobalProductDetail';

import usePublicCollection from '@/components/globest/usePublicCollection';
import CollectionFeedback from '@/components/globest/CollectionFeedback';

export default function GlobalFinds() {
  const [selected, setSelected] = useState(null);
  const collection = usePublicCollection('GlobalProduct', {}, 'category');
  return <div className="customer-module space-y-5">

    <ProductMasonry className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">{collection.items.map(p => <GlobalProductCard key={p.id} product={p} onSelect={setSelected}/>)}</ProductMasonry>
    <CollectionFeedback collection={collection} autoLoad unit="件商品" empty="暂无商品。"/>
    <GlobalProductDetail product={selected} onClose={() => setSelected(null)}/>
  </div>;
}