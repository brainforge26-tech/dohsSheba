import React from 'react';
import { ALL_PRODUCTS } from '@/constants/products';
import { ProductDetailClient } from '@/components/shopping/ProductDetailClient';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = ALL_PRODUCTS.find((p) => p.slug === slug) || ALL_PRODUCTS[0];

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-8">
      <ProductDetailClient product={product} />
    </div>
  );
}
