'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import {
  ArrowLeft, Edit2, Trash2, Package, Star, ShoppingBag,
  Tag, DollarSign, CheckCircle2, XCircle, Award, Loader2, AlertTriangle,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params?.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any>(`/products/${id}`)
      .then((r) => { if (r.success) setProduct(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /></div>;
  if (!product) return <div className="flex flex-col items-center justify-center h-64 gap-2"><AlertTriangle className="w-10 h-10 text-red-400" /><p className="text-white font-bold">Product not found</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/seller/dashboard/products')} className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-white text-lg">{product.name}</h1>
            <p className="text-xs text-slate-400">{product.category?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/seller/dashboard/products/${id}/edit`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all">
            <Edit2 className="w-3.5 h-3.5" /> Edit Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-3xl bg-[#1f2136] border border-white/10">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover rounded-2xl" />
            ) : (
              <div className="w-full aspect-square rounded-2xl bg-[#181928] flex items-center justify-center">
                <Package className="w-16 h-16 text-slate-600" />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-400 text-xs mb-1">Price</p><p className="font-black text-white text-xl">{formatCurrency(product.price)}</p></div>
              <div><p className="text-slate-400 text-xs mb-1">Stock</p><p className={`font-black text-xl ${product.stock === 0 ? 'text-red-400' : product.stock <= 10 ? 'text-amber-400' : 'text-white'}`}>{product.stock} {product.unit}</p></div>
              <div><p className="text-slate-400 text-xs mb-1">Orders</p><p className="font-bold text-white">{product._count?.orderItems ?? 0}</p></div>
              <div><p className="text-slate-400 text-xs mb-1">Reviews</p><p className="font-bold text-white">{product._count?.reviews ?? 0}</p></div>
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-slate-400 text-xs mb-2">Description</p>
              <p className="text-slate-200 text-sm leading-relaxed">{product.description || 'No description provided.'}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${product.isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-500/20 text-slate-300 border-slate-500/30'}`}>
                {product.isActive ? 'Active' : 'Archived'}
              </span>
              {product.isFeatured && <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-amber-500/20 text-amber-300 border-amber-500/30">⭐ Featured</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
