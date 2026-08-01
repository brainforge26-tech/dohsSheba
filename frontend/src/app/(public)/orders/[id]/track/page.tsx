'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { CustomerLiveTracker } from '@/components/tracking/CustomerLiveTracker';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';

export default function OrderTrackPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchApi<any>(`/orders/${id}`)
      .then((res) => {
        if (res?.success && res.data) {
          setOrder(res.data);
        }
      })
      .catch((err) => console.error('Order fetch error:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-slate-400 text-xs font-bold">Loading Live Order Tracker…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <AlertTriangle className="w-10 h-10 text-rose-400" />
        <p className="text-white font-bold">Order Not Found</p>
        <Link href="/dashboard/orders" className="text-emerald-400 text-sm hover:underline">
          ← Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-black text-white text-xl">Live OpenStreetMap Order Tracking</h1>
          <p className="text-xs text-slate-400">Order #{order.id.slice(-8).toUpperCase()} · Real-Time Delivery Stream</p>
        </div>
      </div>

      <CustomerLiveTracker order={order} />
    </div>
  );
}
