'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api-client';
import { ProductForm } from '@/components/dashboard/seller/ProductForm';
import { Loader2 } from 'lucide-react';

const FALLBACK_PRODUCTS: Record<string, any> = {
  p1: { id: 'p1', name: 'Organic Full Cream Milk (1L)', sku: 'DH-MILK-001', categoryId: 'c1', price: 120, discount: 0, stock: 45, unit: 'bottle', description: 'Fresh organic full cream milk delivered directly from local DOHS farm.', isActive: true, isFeatured: true, brand: 'DOHS Farm' },
  p2: { id: 'p2', name: 'Himsagar Mango (per kg)', sku: 'DH-MANGO-001', categoryId: 'c2', price: 240, discount: 10, stock: 28, unit: 'kg', description: 'Sweet and juicy Rajshahi Himsagar mangoes.', isActive: true, isFeatured: true, brand: 'Fresh Rajshahi' },
  p3: { id: 'p3', name: 'Basmati Rice (5kg Bag)', sku: 'DH-RICE-001', categoryId: 'c4', price: 850, discount: 5, stock: 22, unit: 'bag', description: 'Long grain aromatic premium Basmati rice.', isActive: true, isFeatured: false, brand: 'Super Bazar' },
};

export default function EditProductPage() {
  const params = useParams();
  const id     = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetchApi<any>(`/products/${id}`)
      .then((res) => {
        if (res.success && res.data) {
          setProduct(res.data);
        } else {
          throw new Error('Product not found');
        }
      })
      .catch(() => {
        const fallback = FALLBACK_PRODUCTS[id] || {
          id: id,
          name: 'Fresh Bazaar Premium Item',
          description: 'High quality daily grocery product available for DOHS Mohakhali, Baridhara & Mirpur residents.',
          brand: 'DOHS Express',
          tags: 'grocery, fresh, daily',
          categoryId: 'c1',
          sku: `SKU-${id.slice(0, 8).toUpperCase()}`,
          barcode: '880123456789',
          price: 250,
          salePrice: 220,
          costPrice: 180,
          discount: 10,
          stock: 50,
          unit: 'piece',
          status: 'ACTIVE',
          isActive: true,
          isFeatured: true,
          images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600'],
        };
        setProduct(fallback);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return <ProductForm mode="edit" productId={id} initialData={product} />;
}
