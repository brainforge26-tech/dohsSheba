'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { CustomerEmptyState } from '@/components/dashboard/customer/CustomerEmptyState';
import { useCartStore } from '@/store/useCartStore';
import { RefreshCcw, ShoppingCart, Star, Loader2, Package } from 'lucide-react';

export default function BuyAgainPage() {
  const { addItem } = useCartStore();
  const [reorderItems, setReorderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchApi<any[]>('/orders')
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const itemsMap = new Map();
          res.data.forEach((o: any) => {
            (o.items || []).forEach((item: any) => {
              if (item.product && !itemsMap.has(item.product.id)) {
                itemsMap.set(item.product.id, {
                  id: item.product.id,
                  name: item.product.name,
                  seller: o.items?.[0]?.product?.sellerProfile?.shopName || 'DOHS Market',
                  price: item.price,
                  lastPurchased: new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                  image: item.product.images?.[0] || '📦',
                  rating: item.product.rating || 4.9,
                  slug: item.product.slug,
                });
              }
            });
          });
          setReorderItems(Array.from(itemsMap.values()));
        } else {
          setReorderItems([]);
        }
      })
      .catch(() => setReorderItems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleReorder = (item: any) => {
    addItem({
      id: item.id,
      title: item.name,
      slug: item.slug || item.id,
      categorySlug: 'groceries',
      categoryName: 'Groceries',
      shopName: item.seller,
      price: item.price,
      unit: 'pcs',
      rating: item.rating,
      reviewCount: 1,
      image: item.image,
      stock: 100,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <RefreshCcw className="w-6 h-6 text-emerald-400" /> Buy Again Essentials
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Quickly reorder items you previously purchased with 1-click</p>
        </div>

        <Link
          href="/cart"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 w-fit"
        >
          <ShoppingCart className="w-4 h-4" /> View Cart
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 bg-[#1e1f32] rounded-2xl border border-white/10">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-2" />
          <p className="font-semibold text-sm">Loading past purchased items...</p>
        </div>
      ) : reorderItems.length === 0 ? (
        <CustomerEmptyState
          icon={RefreshCcw}
          title="No Previously Purchased Items"
          description="Once you complete an order on DOHS Marketplace, your favorite products will appear here for fast 1-click reordering."
          actionText="Browse Marketplace"
          actionHref="/services/shopping"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reorderItems.map((item) => (
            <div key={item.id} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                  {item.image.startsWith('http') || item.image.startsWith('/') ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.image
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}
                  </div>
                  <Link href={`/services/shopping/product/${item.slug || item.id}`}>
                    <h3 className="font-bold text-sm text-white truncate mt-0.5 hover:text-emerald-400 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-400">{item.seller}</p>
                  <p className="text-xs text-slate-400 mt-1">Last ordered: <span className="text-slate-300 font-semibold">{item.lastPurchased}</span></p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">PRICE</span>
                  <span className="text-base font-black text-emerald-400">৳{formatCurrency(item.price)}</span>
                </div>

                <button
                  onClick={() => handleReorder(item)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" /> 1-Click Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
