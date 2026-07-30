'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useSocket } from '@/hooks/useSocket';
import {
  Bike, Navigation, CheckCircle2, Clock, MapPin, Phone, Store,
  AlertTriangle, BellRing, DollarSign, Package, Check, X, RefreshCw, Loader2, Wifi, WifiOff
} from 'lucide-react';

// Web Audio API chime synthesis for rider order popup
const playOrderChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const playBeep = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playBeep(880, now, 0.15);
    playBeep(1174.66, now + 0.2, 0.3);
  } catch (_) {}
};

export default function RiderDashboardPage() {
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const { socket, isConnected } = useSocket();
  const isBn = language === 'BN';

  // ── Rider Profile / Stats ────────────────────────────────────────────────────
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Duty Toggle ──────────────────────────────────────────────────────────────
  const [isOnline, setIsOnline] = useState(false);
  const [togglingDuty, setTogglingDuty] = useState(false);

  // ── Foodpanda Dispatch Order Popup ───────────────────────────────────────────
  const [incomingOrder, setIncomingOrder] = useState<any | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [showPopup, setShowPopup] = useState(false);

  // ── Active Missions & History ────────────────────────────────────────────────
  const [activeMissions, setActiveMissions] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState('');

  // ── Load Stats ───────────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      const res = await fetchApi<any>('/rider/stats').catch(() => null);
      if (res?.success && res.data) {
        setStats(res.data);
        setIsOnline(res.data.isOnline ?? res.data.isAvailable ?? false);
      }
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ── Load Active Missions ─────────────────────────────────────────────────────
  const loadActiveMissions = useCallback(async () => {
    try {
      const res = await fetchApi<any>('/rider/orders/active').catch(() => null);
      if (res?.success && Array.isArray(res.data)) {
        setActiveMissions(res.data);
      }
    } catch (_) {}
  }, []);

  // ── Load Delivery History ────────────────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetchApi<any>('/rider/orders/history?limit=10').catch(() => null);
      if (res?.success && Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // ── Load Open Orders ────────────────────────────────────────────────────────
  const checkOpenOrders = useCallback(async () => {
    if (!isOnline) return;
    try {
      const res = await fetchApi<any>('/rider/orders/open').catch(() => null);
      if (res?.success && Array.isArray(res.data) && res.data.length > 0 && !showPopup) {
        const order = res.data[0];
        setIncomingOrder({
          orderId: order.id,
          storeName: order.items[0]?.product?.seller?.sellerProfile?.shopName || 'DOHS Merchant Store',
          customerName: order.customer?.name || 'Resident',
          address: `${order.address?.line1}, ${order.address?.area}`,
          totalItems: order.items?.length || 1,
          totalAmount: order.totalAmount,
          earnings: order.deliveryFee || 50,
        });
        setCountdown(30);
        setShowPopup(true);
        playOrderChime();
      }
    } catch (_) {}
  }, [isOnline, showPopup]);

  // ── Initial Load ─────────────────────────────────────────────────────────────
  useEffect(() => {
    loadStats();
    loadActiveMissions();
    loadHistory();
  }, [loadStats, loadActiveMissions, loadHistory]);

  // ── Socket Events ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !isOnline) return;

    const handleBroadcast = (data: any) => {
      setIncomingOrder(data);
      setCountdown(30);
      setShowPopup(true);
      playOrderChime();
    };

    const handleDismiss = (data: { orderId: string }) => {
      if (incomingOrder?.orderId === data.orderId || incomingOrder?.id === data.orderId) {
        setShowPopup(false);
        setIncomingOrder(null);
      }
    };

    const handleStatusUpdate = () => {
      loadActiveMissions();
      loadStats();
    };

    socket.on('RIDER_ORDER_BROADCAST', handleBroadcast);
    socket.on('RIDER_ORDER_DISMISS', handleDismiss);
    socket.on('ORDER_STATUS_UPDATED', handleStatusUpdate);

    return () => {
      socket.off('RIDER_ORDER_BROADCAST', handleBroadcast);
      socket.off('RIDER_ORDER_DISMISS', handleDismiss);
      socket.off('ORDER_STATUS_UPDATED', handleStatusUpdate);
    };
  }, [socket, isOnline, incomingOrder, loadActiveMissions, loadStats]);

  // ── Countdown Timer for Foodpanda Popup ─────────────────────────────────────
  useEffect(() => {
    let timer: any;
    if (showPopup && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0 && showPopup) {
      setShowPopup(false);
      setIncomingOrder(null);
    }
    return () => clearInterval(timer);
  }, [showPopup, countdown]);

  // ── Toggle Duty Status ───────────────────────────────────────────────────────
  const handleToggleDuty = async () => {
    setTogglingDuty(true);
    try {
      const nextDuty = !isOnline;
      const res = await fetchApi<any>('/rider/duty', {
        method: 'PATCH',
        body: JSON.stringify({ isOnline: nextDuty }),
      });
      if (res?.success) {
        setIsOnline(nextDuty);
        if (nextDuty) checkOpenOrders();
      }
    } finally {
      setTogglingDuty(false);
    }
  };

  // ── Accept Broadcast Order ───────────────────────────────────────────────────
  const handleAcceptOrder = async () => {
    if (!incomingOrder) return;
    const targetId = incomingOrder.orderId || incomingOrder.id;
    setActionLoading(targetId);
    try {
      const res = await fetchApi<any>(`/rider/orders/${targetId}/accept`, {
        method: 'POST',
      });
      if (res?.success) {
        setShowPopup(false);
        setIncomingOrder(null);
        setActionMsg(isBn ? 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!' : 'Order accepted successfully!');
        loadActiveMissions();
        loadStats();
      } else {
        setActionMsg(res?.message || 'Order was accepted by another rider.');
        setShowPopup(false);
      }
    } finally {
      setActionLoading(null);
    }
  };

  // ── Progress Mission Status ───────────────────────────────────────────────────
  const handleStepUpdate = async (orderId: string, nextStatus: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetchApi<any>(`/rider/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res?.success) {
        loadActiveMissions();
        loadStats();
        if (nextStatus === 'DELIVERED') {
          loadHistory();
          setActionMsg(isBn ? 'ডেলিভারি সম্পন্ন হয়েছে!' : 'Delivery completed successfully!');
        }
      }
    } finally {
      setActionLoading(null);
    }
  };

  const getStepButtonText = (status: string) => {
    switch (status) {
      case 'RIDER_ASSIGNED': return { text: isBn ? 'স্টোরে পৌঁছেছি' : 'Arrived at Store', nextStatus: 'PICKUP_STARTED' };
      case 'PICKUP_STARTED': return { text: isBn ? 'পণ্য রিসিভ করেছি' : 'Picked Up Order', nextStatus: 'PICKED_UP' };
      case 'PICKED_UP': return { text: isBn ? 'গন্তব্যে রওনা হলাম' : 'On the Way', nextStatus: 'ON_THE_WAY' };
      case 'ON_THE_WAY': return { text: isBn ? 'গ্রাহকের দরজায় পৌঁছেছি' : 'Arrived at Doorstep', nextStatus: 'ARRIVED' };
      case 'ARRIVED': return { text: isBn ? 'ডেলিভারি কনফার্ম করুন' : 'Confirm Delivery', nextStatus: 'DELIVERED' };
      default: return { text: 'Next Step', nextStatus: 'DELIVERED' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 relative">
      {/* Header Banner */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 backdrop-blur-md mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Bike className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              {user?.name || (isBn ? 'রাইডার ড্যাশবোর্ড' : 'Rider Fleet Command')}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {isOnline ? (isBn ? 'অন ডিউটি (অনলাইন)' : 'ON DUTY') : (isBn ? 'অফ ডিউটি (অফলাইন)' : 'OFF DUTY')}
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {isBn ? 'রিয়েল-টাইম অর্ডার ডিসপ্যাচ ও ডেলিভারি ট্র্যাকিং' : 'Foodpanda-Style Real-time Delivery Dispatch & Route Guidance'}
            </p>
          </div>
        </div>

        {/* Duty Toggle Button */}
        <button
          onClick={handleToggleDuty}
          disabled={togglingDuty}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg ${
            isOnline
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
          }`}
        >
          {togglingDuty ? <Loader2 className="w-5 h-5 animate-spin" /> : <BellRing className="w-5 h-5" />}
          {isOnline ? (isBn ? 'অফলাইন যান' : 'Go OFF DUTY') : (isBn ? 'অনলাইন যান' : 'Go ON DUTY')}
        </button>
      </div>

      {actionMsg && (
        <div className="max-w-6xl mx-auto mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg('')} className="text-emerald-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Foodpanda Style Broadcast Dispatch Modal */}
      {showPopup && incomingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-amber-500/20 relative animate-in fade-in zoom-in duration-300">
            {/* Header Alert */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
              <div className="flex items-center gap-3 text-amber-400">
                <BellRing className="w-6 h-6 animate-bounce" />
                <span className="font-bold text-lg tracking-wide uppercase">
                  {isBn ? 'নতুন রাইডার ডিসপ্যাচ!' : 'NEW ORDER REQUEST!'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full font-mono text-sm font-bold">
                <Clock className="w-4 h-4" />
                {countdown}s
              </div>
            </div>

            {/* Order Brief */}
            <div className="space-y-4 text-slate-200">
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <Store className="w-4 h-4 text-emerald-400" />
                  {isBn ? 'পিকআপ শপ' : 'Store Pickup'}
                </div>
                <p className="text-white font-bold text-base">{incomingOrder.storeName}</p>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  {isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}
                </div>
                <p className="text-white font-semibold text-sm">{incomingOrder.address}</p>
                <p className="text-slate-400 text-xs">{isBn ? 'গ্রাহক:' : 'Customer:'} {incomingOrder.customerName}</p>
              </div>

              {/* Earnings & Items */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-center">
                  <span className="text-xs text-emerald-400 font-semibold block">{isBn ? 'আর্নিং' : 'Estimated Earnings'}</span>
                  <span className="text-xl font-extrabold text-emerald-400">{formatCurrency(incomingOrder.earnings || 50)}</span>
                </div>
                <div className="bg-slate-700/50 border border-slate-600/50 p-3 rounded-xl text-center">
                  <span className="text-xs text-slate-300 font-semibold block">{isBn ? 'আইটেম' : 'Total Items'}</span>
                  <span className="text-xl font-extrabold text-white">{incomingOrder.totalItems || 1} Pcs</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => { setShowPopup(false); setIncomingOrder(null); }}
                className="py-3.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold transition-all text-sm"
              >
                {isBn ? 'বাতিল' : 'Decline'}
              </button>
              <button
                onClick={handleAcceptOrder}
                disabled={actionLoading === (incomingOrder.orderId || incomingOrder.id)}
                className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                {isBn ? 'একসেপ্ট করুন' : 'ACCEPT ORDER'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Summary Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50">
          <span className="text-slate-400 text-xs font-semibold uppercase">{isBn ? 'আজকের ডেলিভারি' : "Today's Deliveries"}</span>
          <p className="text-2xl font-bold text-white mt-2">{statsLoading ? '...' : stats?.todayDeliveries || 0}</p>
        </div>
        <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50">
          <span className="text-slate-400 text-xs font-semibold uppercase">{isBn ? 'আজকের উপার্জন' : "Today's Earnings"}</span>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{statsLoading ? '...' : formatCurrency(stats?.todayEarnings || 0)}</p>
        </div>
        <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50">
          <span className="text-slate-400 text-xs font-semibold uppercase">{isBn ? 'সর্বমোট রাইড' : 'Total Rides Completed'}</span>
          <p className="text-2xl font-bold text-white mt-2">{statsLoading ? '...' : stats?.totalTrips || 0}</p>
        </div>
        <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50">
          <span className="text-slate-400 text-xs font-semibold uppercase">{isBn ? 'রাইডার রেটিং' : 'Fleet Rating'}</span>
          <p className="text-2xl font-bold text-amber-400 mt-2">⭐ {statsLoading ? '...' : stats?.rating || '5.0'}</p>
        </div>
      </div>

      {/* Main Content Area: Active Missions */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-400" />
            {isBn ? 'চলতি ডেলিভারি মিশন' : 'Active Delivery Missions'}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">
              {activeMissions.length}
            </span>
          </h2>
          <button
            onClick={() => { loadActiveMissions(); checkOpenOrders(); }}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all"
            title="Refresh Missions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {activeMissions.length === 0 ? (
          <div className="bg-slate-800/40 p-12 rounded-2xl border border-slate-800 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 font-semibold">{isBn ? 'বর্তমানে কোন সক্রিয় মিশন নেই।' : 'No active delivery missions right now.'}</p>
            <p className="text-slate-500 text-xs">
              {isOnline
                ? (isBn ? 'নতুন অর্ডার ডিসপ্যাচ পপআপের জন্য অপেক্ষা করুন...' : 'Waiting for incoming order dispatch requests...')
                : (isBn ? 'নতুন মিশন পেতে উপরে অনলাইন বোতামটি চাপুন।' : 'Toggle ON DUTY status to start receiving orders.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {activeMissions.map((mission) => {
              const stepInfo = getStepButtonText(mission.status);
              return (
                <div key={mission.id} className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 space-y-6">
                  {/* Status Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                    <div>
                      <span className="text-xs text-slate-400 font-mono">ORDER #{mission.id.slice(-8).toUpperCase()}</span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        {mission.customer?.name || 'Resident'}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        STATUS: {mission.status}
                      </span>
                      <span className="text-emerald-400 font-bold text-lg">
                        {formatCurrency(mission.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/50 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                        <span className="flex items-center gap-1.5 text-emerald-400"><Store className="w-4 h-4" /> STORE PICKUP</span>
                        {mission.items[0]?.product?.seller?.phone && (
                          <a href={`tel:${mission.items[0]?.product?.seller?.phone}`} className="text-emerald-400 flex items-center gap-1 hover:underline">
                            <Phone className="w-3.5 h-3.5" /> Call Store
                          </a>
                        )}
                      </div>
                      <p className="text-white font-bold text-sm">
                        {mission.items[0]?.product?.seller?.sellerProfile?.shopName || 'Merchant Shop'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/50 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                        <span className="flex items-center gap-1.5 text-rose-400"><MapPin className="w-4 h-4" /> DOORSTEP DELIVERY</span>
                        {mission.customer?.phone && (
                          <a href={`tel:${mission.customer?.phone}`} className="text-emerald-400 flex items-center gap-1 hover:underline">
                            <Phone className="w-3.5 h-3.5" /> Call Customer
                          </a>
                        )}
                      </div>
                      <p className="text-white font-bold text-sm">
                        {mission.address?.line1}, {mission.address?.area}
                      </p>
                    </div>
                  </div>

                  {/* Step Transition Button */}
                  <button
                    onClick={() => handleStepUpdate(mission.id, stepInfo.nextStatus)}
                    disabled={actionLoading === mission.id}
                    className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-3 text-base"
                  >
                    {actionLoading === mission.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                    {stepInfo.text}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* History Table */}
        <div className="pt-8">
          <h3 className="text-lg font-bold text-white mb-4">{isBn ? 'সাম্প্রতিক ডেলিভারি হিস্ট্রি' : 'Completed Delivery History'}</h3>
          <div className="bg-slate-800 rounded-2xl border border-slate-700/70 overflow-hidden">
            {historyLoading ? (
              <div className="p-8 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
            ) : history.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No completed deliveries recorded yet.</div>
            ) : (
              <div className="divide-y divide-slate-700/60">
                {history.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between text-sm">
                    <div>
                      <p className="text-white font-semibold">{item.customer?.name || 'Resident'}</p>
                      <p className="text-slate-400 text-xs">{item.address?.line1}, {item.address?.area}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold">{formatCurrency(item.deliveryFee || 50)}</span>
                      <span className="block text-xs text-slate-400">{new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
