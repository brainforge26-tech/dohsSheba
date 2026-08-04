import React from 'react';
import { getProductBySlugOrId } from '@/constants/products';
import { ProductDetailClient } from '@/components/shopping/ProductDetailClient';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const initialProduct = getProductBySlugOrId(slug);

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-8">
      <ProductDetailClient product={initialProduct} slug={slug} />
    </div>
  );
}
