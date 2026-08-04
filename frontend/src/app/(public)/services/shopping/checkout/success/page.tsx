'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Copy,
  Check,
  Truck,
  Printer,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Package,
  Clock,
  MapPin,
  Loader2
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { PrintableReceipt } from '@/components/common/PrintableReceipt';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const trackingCodeParam = searchParams.get('trackingCode') || '';
  const isGuest = searchParams.get('guest') === 'true';

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchApi<any>(`/orders/track/${orderId}`)
        .then((res) => {
          if (res?.success && res.data) {
            setOrder(res.data);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const displayTrackingCode = trackingCodeParam || order?.trackingCode || orderId || 'TRK-89410283';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayTrackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f101d] text-white flex items-center justify-center p-4 font-sans">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#7eb343] mx-auto" />
          <p className="text-sm font-bold">Generating Order Confirmation & Invoice…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f101d] text-white py-12 px-4 sm:px-6 font-sans flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Success Icon & Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#171828] to-[#1c1e34] border border-white/10 shadow-2xl text-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/10 animate-bounce">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Order Placed Successfully! 🎉
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you for shopping with <strong className="text-white">DOHS Sheba Bazaar</strong>. Your order is being processed for express delivery.
            </p>
          </div>

          {/* Tracking Code Highlight Box */}
          <div className="p-4 rounded-2xl bg-[#121320] border border-indigo-500/40 space-y-2 max-w-lg mx-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Your Public Live Tracking Code
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-400 tracking-wider">
                {displayTrackingCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href={`/track-order?code=${encodeURIComponent(displayTrackingCode)}`}
              className="py-3.5 px-4 rounded-xl bg-[#7eb343] hover:bg-[#6c9c36] text-white font-extrabold text-xs transition-all shadow-lg shadow-[#7eb343]/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Truck className="w-4 h-4" /> Track Live Courier Status
            </Link>

            <button
              onClick={() => window.print()}
              className="py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-95"
            >
              <Printer className="w-4 h-4" /> Download / Print Invoice
            </button>
          </div>
        </div>

        {/* Order Details Brief Summary */}
        {order && (
          <div className="p-6 rounded-3xl bg-[#171828] border border-white/10 space-y-4 shadow-xl text-xs">
            <h3 className="font-extrabold text-white text-sm flex items-center justify-between border-b border-white/10 pb-3">
              <span>Order Breakdown</span>
              <span className="font-mono text-slate-400 text-xs">Order ID: #{order.id.slice(-8).toUpperCase()}</span>
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Customer</span>
                <span className="font-bold text-white">{order.guestName || order.customer?.name || 'Customer'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Phone Number</span>
                <span className="font-mono font-bold text-emerald-400">{order.guestPhone || order.customerPhone || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Items Count</span>
                <span className="font-bold text-white">{order.items?.length || 1} item(s)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Method</span>
                <span className="font-bold text-white uppercase">{order.payment?.method || 'CASH'}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-black text-sm text-white">
                <span>Total Amount Paid</span>
                <span className="text-[#7eb343]">৳{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Continue Shopping Button */}
        <div className="text-center pt-2">
          <Link
            href="/services/shopping"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping in DOHS Bazaar
          </Link>
        </div>

        {/* Dedicated Clean Printable Receipt (Only visible during print) */}
        {order && <PrintableReceipt order={order} trackingCode={displayTrackingCode} />}

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f101d] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#7eb343] animate-spin" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
