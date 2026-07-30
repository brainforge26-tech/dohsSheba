'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchApi } from '@/lib/api-client';
import { useSocket } from '@/hooks/useSocket';
import {
  Truck, CheckCircle2, Clock, MapPin, Phone, MessageSquare,
  ArrowLeft, Package, Building2, Calendar, Loader2
} from 'lucide-react';

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const { socket } = useSocket();

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      // Fallback: fetch most recent order
      const res = await fetchApi<any>('/orders?limit=1').catch(() => null);
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setOrder(res.data[0]);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetchApi<any>(`/orders/${orderId}`).catch(() => null);
      if (res?.success && res.data) {
        setOrder(res.data);
      }
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data: any) => {
      if (!orderId || data.orderId === orderId || data.order?.id === orderId) {
        loadOrder();
      }
    };
    socket.on('ORDER_STATUS_UPDATED', handleUpdate);
    return () => {
      socket.off('ORDER_STATUS_UPDATED', handleUpdate);
    };
  }, [socket, orderId, loadOrder]);

  const currentStatus = order?.status || 'PENDING';

  const allSteps = [
    { key: 'PENDING', label: 'Order Placed', desc: 'Customer order received in system' },
    { key: 'SELLER_ACCEPTED', label: 'Seller Accepted', desc: 'Merchant accepted & packing items' },
    { key: 'READY_FOR_RIDER', label: 'Ready for Rider', desc: 'Broadcasted to online DOHS fleet' },
    { key: 'RIDER_ASSIGNED', label: 'Rider Assigned', desc: order?.riderName ? `Assigned to Rider ${order.riderName}` : 'Rider locked & heading to store' },
    { key: 'PICKUP_STARTED', label: 'Arrived at Store', desc: 'Rider arrived at store for pickup' },
    { key: 'PICKED_UP', label: 'Picked Up', desc: 'Order picked up & in transit' },
    { key: 'ON_THE_WAY', label: 'On the Way', desc: 'Rider is navigating to your DOHS doorstep' },
    { key: 'ARRIVED', label: 'Arrived Doorstep', desc: 'Rider arrived at your building' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Delivered successfully to resident' },
  ];

  const getStepState = (stepKey: string) => {
    const orderIndex = allSteps.findIndex((s) => s.key === currentStatus);
    const stepIndex = allSteps.findIndex((s) => s.key === stepKey);

    if (currentStatus === 'CANCELLED' || currentStatus === 'REJECTED') {
      return stepKey === 'PENDING' ? 'completed' : 'future';
    }

    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'future';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/orders"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Truck className="w-6 h-6 text-indigo-400" /> Real-Time Order Tracking
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status for Order <span className="font-mono text-indigo-300 font-bold">#{order?.id?.slice(-8).toUpperCase() || 'SEARCHING'}</span>
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
          <Clock className="w-4 h-4 animate-spin" /> Live Socket Sync Active
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-[#1e1f32] rounded-2xl border border-white/10">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-2" />
          <p className="font-semibold text-sm">Fetching live order location & status...</p>
        </div>
      ) : !order ? (
        <div className="p-12 text-center text-slate-400 bg-[#1e1f32] rounded-2xl border border-white/10">
          <p className="font-bold text-white text-base">No active order found to track.</p>
          <p className="text-xs text-slate-500 mt-1">Please place a new order or check your order history.</p>
        </div>
      ) : (
        <>
          {/* Rider Info Header */}
          <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl font-bold">
                🛵
              </div>
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">DOHS RESIDENT EXPRESS FLEET</span>
                <h3 className="font-black text-white text-base">
                  Rider: {order.riderName || 'Assigning nearest online rider...'}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>Delivery Address: {order.address?.line1}, {order.address?.area}</span>
                </p>
              </div>
            </div>

            {order.riderId && (
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                  Rider En Route
                </span>
              </div>
            )}
          </div>

          {/* Timeline Card */}
          <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-6 space-y-6">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-400" /> Tracking Journey
            </h2>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[15px] sm:before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
              {allSteps.map((step) => {
                const state = getStepState(step.key);
                const isCompleted = state === 'completed';
                const isCurrent = state === 'current';

                return (
                  <div key={step.key} className="relative flex items-start justify-between gap-4">
                    <span
                      className={`absolute -left-[27px] sm:-left-[31px] top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-400 text-slate-900 shadow-md shadow-emerald-500/30'
                          : isCurrent
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/50 animate-pulse'
                          : 'bg-slate-800 border-slate-700 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : isCurrent ? <Clock className="w-4 h-4" /> : '•'}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-bold ${isCurrent ? 'text-indigo-300' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                            Active Step
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${isCompleted || isCurrent ? 'text-slate-300' : 'text-slate-600'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
