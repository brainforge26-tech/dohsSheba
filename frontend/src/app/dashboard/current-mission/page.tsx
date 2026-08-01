'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { useSocket } from '@/hooks/useSocket';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  MapPin, Phone, Store, Navigation, CheckCircle2, Clock, Package,
  ExternalLink, Loader2
} from 'lucide-react';

export default function RiderCurrentMissionPage() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const { socket } = useSocket();
  const isBn = language === 'BN';

  const [activeMissions, setActiveMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState('');

  const loadActiveMissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchApi<any>('/rider/orders/active').catch(() => null);
      if (res?.success && Array.isArray(res.data)) {
        setActiveMissions(res.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActiveMissions();
  }, [loadActiveMissions]);

  // Real-time socket sync
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = () => {
      loadActiveMissions();
    };

    socket.on('ORDER_STATUS_UPDATED', handleStatusUpdate);
    socket.on('MISSION_STARTED', handleStatusUpdate);
    socket.on('MISSION_COMPLETED', handleStatusUpdate);

    return () => {
      socket.off('ORDER_STATUS_UPDATED', handleStatusUpdate);
      socket.off('MISSION_STARTED', handleStatusUpdate);
      socket.off('MISSION_COMPLETED', handleStatusUpdate);
    };
  }, [socket, loadActiveMissions]);

  const handleStepUpdate = async (orderId: string, nextStatus: string) => {
    setActionLoading(orderId);
    setActionMsg('');
    try {
      const res = await fetchApi<any>(`/rider/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res?.success) {
        setActionMsg(isBn ? 'ডেলিভারি আপডেট সফল হয়েছে!' : 'Mission milestone updated successfully!');
        if (nextStatus === 'DELIVERED') {
          router.push('/rider/dashboard');
        } else {
          loadActiveMissions();
        }
      } else {
        setActionMsg(res?.message || 'Failed to update mission status');
      }
    } catch (e: any) {
      setActionMsg(e.message || 'Network error');
    } finally {
      setActionLoading(null);
    }
  };

  const getSingleStepButton = (currentStatus: string) => {
    switch (currentStatus) {
      case 'RIDER_ASSIGNED':
        return { label: isBn ? 'স্টোরে পৌঁছেছি (ARRIVED AT STORE)' : 'ARRIVED AT STORE', nextStatus: 'ARRIVED_AT_STORE', color: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-950/40' };
      case 'ARRIVED_AT_STORE':
      case 'PICKUP_STARTED':
        return { label: isBn ? 'পণ্য গ্রহণ করেছি (PACKAGE COLLECTED)' : 'PACKAGE COLLECTED', nextStatus: 'PICKED_UP', color: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-950/40' };
      case 'PICKED_UP':
        return { label: isBn ? 'ডেলিভারি শুরু (START DELIVERY)' : 'START DELIVERY', nextStatus: 'ON_THE_WAY', color: 'bg-blue-600 hover:bg-blue-500 shadow-blue-950/40' };
      case 'ON_THE_WAY':
        return { label: isBn ? 'গন্তব্যে পৌঁছেছি (ARRIVED DESTINATION)' : 'ARRIVED DESTINATION', nextStatus: 'ARRIVED_DESTINATION', color: 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/40' };
      case 'ARRIVED':
      case 'ARRIVED_DESTINATION':
        return { label: isBn ? 'ডেলিভারি সম্পন্ন (COMPLETE DELIVERY)' : 'COMPLETE DELIVERY', nextStatus: 'DELIVERED', color: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40' };
      default:
        return { label: 'COMPLETE DELIVERY', nextStatus: 'DELIVERED', color: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-emerald-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="font-semibold text-lg">{isBn ? 'সক্রিয় মিশন লোড হচ্ছে...' : 'Loading active mission mode...'}</span>
        </div>
      </div>
    );
  }

  if (activeMissions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
        <div className="max-w-3xl mx-auto bg-slate-900 rounded-3xl border border-slate-800 p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{isBn ? 'কোন সক্রিয় ডেলিভারি মিশন নেই' : 'No Active Mission'}</h1>
            <p className="text-slate-400 mt-2 text-xs max-w-md mx-auto">
              {isBn ? 'নতুন ডিসপ্যাচ রিকুয়েস্টের জন্য অন ডিউটি থাকুন।' : 'You have no assigned active delivery mission right now. Stay ON DUTY to receive live order popups.'}
            </p>
          </div>
          <button
            onClick={() => router.push('/rider/dashboard')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg inline-flex items-center gap-2 text-sm"
          >
            <Navigation className="w-4 h-4" />
            {isBn ? 'রাইডার কমান্ড সেন্টারে ফিরে যান' : 'Back to Rider Command Center'}
          </button>
        </div>
      </div>
    );
  }

  const mission = activeMissions[0];
  const stepInfo = getSingleStepButton(mission.status);
  const storeObj = mission.items[0]?.product?.seller;
  const storeName = storeObj?.sellerProfile?.shopName || storeObj?.name || 'DOHS Merchant Store';
  const storePhone = storeObj?.phone || '+8801700000000';
  const storeAddress = 'DOHS Central Supermarket, Gate 2';
  const customerName = mission.customer?.name || 'Resident';
  const customerPhone = mission.customer?.phone || '+8801800000000';
  const deliveryAddress = `${mission.address?.line1 || 'Block C'}, ${mission.address?.area || 'Mohakhali DOHS'}`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deliveryAddress)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex items-center justify-between bg-slate-900 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Navigation className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs text-emerald-400 font-extrabold uppercase tracking-widest block">
                LIVE MISSION MODE
              </span>
              <h1 className="text-xl font-black text-white">
                Order #{mission.id.slice(-8).toUpperCase()}
              </h1>
            </div>
          </div>
          <span className="px-3.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-black uppercase">
            {mission.status.replace(/_/g, ' ')}
          </span>
        </div>

        {actionMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg('')} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Mission Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Store Info */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4" /> Store Pickup
              </span>
              <a href={`tel:${storePhone}`} className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30">
                <Phone className="w-4 h-4" />
              </a>
            </div>
            <p className="text-white font-bold text-lg">{storeName}</p>
            <p className="text-slate-400 text-xs">{storeAddress}</p>
          </div>

          {/* Customer Info */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Delivery Destination
              </span>
              <a href={`tel:${customerPhone}`} className="p-2 bg-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/30">
                <Phone className="w-4 h-4" />
              </a>
            </div>
            <p className="text-white font-bold text-lg">{customerName}</p>
            <p className="text-slate-300 text-xs font-semibold">{deliveryAddress}</p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 border border-slate-700"
            >
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              Open Google Maps Navigation
            </a>
          </div>
        </div>

        {/* Order Items & Payment */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" /> Order Items ({mission.items?.length || 1})
          </h3>
          <div className="space-y-2">
            {mission.items?.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-200 font-semibold">{item.product?.name}</span>
                <span className="text-xs font-black bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300">x{item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-bold">Collect COD Amount</span>
            <span className="text-xl font-black text-emerald-400">{formatCurrency(mission.totalAmount)}</span>
          </div>
        </div>

        {/* SINGLE STEP ACTION BUTTON */}
        <div className="pt-2">
          <button
            onClick={() => handleStepUpdate(mission.id, stepInfo.nextStatus)}
            disabled={actionLoading === mission.id}
            className={`w-full py-5 px-8 rounded-2xl text-white font-black text-base tracking-wider transition-all shadow-2xl flex items-center justify-center gap-3 ${stepInfo.color}`}
          >
            {actionLoading === mission.id ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <CheckCircle2 className="w-6 h-6" />
            )}
            {stepInfo.label}
          </button>
        </div>
      </div>
    </div>
  );
}
