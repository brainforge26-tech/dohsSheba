'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  MapPin,
  User,
  CreditCard,
  Phone,
  MessageSquare,
  Package,
  Loader2,
  FileText,
} from 'lucide-react';

export default function OrderDetailsPage() {
  const params = useParams();
  const rawId = (params?.id as string) || '';

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rawId) return;

    fetchApi<any>(`/orders/${rawId}`)
      .then((res) => {
        if (res?.success && res.data) {
          setOrder(res.data);
        }
      })
      .catch((err) => console.error('Order fetch error:', err))
      .finally(() => setLoading(false));
  }, [rawId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-slate-400 text-xs font-bold">Loading Order Details…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-white font-bold text-lg">Order Not Found</p>
        <Link href="/dashboard/orders" className="text-xs text-indigo-400 hover:underline">
          ← Back to My Orders
        </Link>
      </div>
    );
  }

  const customerName = order.customer?.name || 'Customer';
  const customerPhone = order.customerPhone || order.customer?.phone || order.address?.phone || '01306031982';
  const line1 = order.address?.line1 || 'DOHS Residence';
  const area = order.address?.area || 'Mohakhali DOHS';
  const city = order.address?.city || 'Dhaka';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/orders"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              Order Details <span className="text-indigo-400 font-mono">#{order.id.slice(-8).toUpperCase()}</span>
            </h1>
            <p className="text-xs text-slate-400">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/orders/${order.id}/track`}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Truck className="w-4 h-4" /> Live Tracking
          </Link>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ordered Products Card */}
          <div className="rounded-3xl bg-[#1f2136] border border-white/10 p-6 space-y-4 shadow-xl">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-400" /> Ordered Items ({order.items?.length || 1})
            </h2>

            <div className="divide-y divide-white/5">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-white shrink-0 overflow-hidden">
                      {item.product?.images?.[0] ? (
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{item.product?.name || 'Product'}</h4>
                      <p className="text-xs text-slate-400">Qty: {item.quantity} × ৳{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-emerald-400">৳{formatCurrency(item.quantity * item.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="rounded-3xl bg-[#1f2136] border border-white/10 p-6 space-y-3 shadow-xl">
            <h2 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-cyan-400" /> Invoice Summary
            </h2>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Subtotal</span>
              <span className="text-white font-semibold">৳{formatCurrency(order.subtotal || order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Delivery Charge</span>
              <span className="text-white font-semibold">৳{formatCurrency(order.deliveryFee || 0)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                <span>Discount</span>
                <span>-৳{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-white/10 flex justify-between text-sm font-black text-white">
              <span>Total Amount</span>
              <span className="text-emerald-400">৳{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & Delivery Address */}
        <div className="space-y-6">
          {/* Delivery Address Card */}
          <div className="rounded-3xl bg-[#1f2136] border border-white/10 p-6 space-y-3 shadow-xl">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" /> Delivery Address
            </h2>
            <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
              <p className="font-bold text-white text-sm">{customerName}</p>
              <p>{line1}</p>
              <p>{area}, {city}</p>
              <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-emerald-400 font-bold">
                <Phone className="w-3.5 h-3.5" />
                <a href={`tel:${customerPhone}`} className="hover:underline">{customerPhone}</a>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="rounded-3xl bg-[#1f2136] border border-white/10 p-6 space-y-3 shadow-xl">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" /> Payment Details
            </h2>
            <div className="text-xs text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="font-bold text-white uppercase">{order.payment?.method || 'Cash on Delivery'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span className="font-bold text-emerald-400 uppercase">{order.payment?.status || 'PENDING'}</span>
              </div>
            </div>
          </div>

          {/* Seller Support */}
          <div className="rounded-3xl bg-[#1f2136] border border-white/10 p-6 space-y-3 shadow-xl">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> Live Support
            </h2>
            <p className="text-xs text-slate-400">Have questions about your delivery address or items?</p>
            <div className="pt-1">
              <Link
                href="/dashboard/messages"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-4 h-4" /> Live Support Chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
