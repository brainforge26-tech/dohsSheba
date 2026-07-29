'use client';

// Rider Dashboard Command Center — STEP 5+6+7: Fully Dynamic with Live Polling
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Bike, Navigation, CheckCircle2, Clock, MapPin, Phone, Store,
  AlertTriangle, BellRing, ShieldCheck, DollarSign, Package, Check, X, RefreshCw, Loader2, Wifi, WifiOff
} from 'lucide-react';

const POLL_INTERVAL = 5000; // Poll every 5 seconds

export default function RiderDashboardPage() {
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const isBn = language === 'BN';

  // ── Rider Profile / Stats ────────────────────────────────────────────────────
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Online / Offline Toggle ──────────────────────────────────────────────────
  const [isOnline, setIsOnline] = useState(true);
  const [togglingAvail, setTogglingAvail] = useState(false);

  // ── Incoming Order Popup (Foodpanda Style) ───────────────────────────────────
  const [incomingOrder, setIncomingOrder] = useState<any | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [showPopup, setShowPopup] = useState(false);
  const seenOrderIds = useRef<Set<string>>(new Set());

  // ── Active Trip ──────────────────────────────────────────────────────────────
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [stepStatus, setStepStatus] = useState<Record<string, 'PICKUP' | 'ON_THE_WAY' | 'DELIVERED'>>({});

  // ── Delivery History ─────────────────────────────────────────────────────────
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // ── Action Message ───────────────────────────────────────────────────────────
  const [actionMsg, setActionMsg] = useState('');

  // ── Load rider stats ─────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      const res = await fetchApi<any>('/rider/stats').catch(() => null);
      if (res?.success && res.data) {
        setStats(res.data);
        setIsOnline(res.data.isAvailable ?? true);
      }
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ── Load delivery history ─────────────────────────────────────────────────────
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

  // ── Poll for assigned orders every 5s ────────────────────────────────────────
  const pollOrders = useCallback(async () => {
    try {
      const res = await fetchApi<any>('/rider/orders/assigned').catch(() => null);
      if (!res?.success || !Array.isArray(res.data)) return;

      const orders: any[] = res.data;
      setActiveOrders(orders);

      // Find RIDER_ASSIGNED orders not yet accepted
      const pendingOrders = orders.filter((o: any) => o.status === 'RIDER_ASSIGNED');
      for (const order of pendingOrders) {
        if (!seenOrderIds.current.has(order.id)) {
          seenOrderIds.current.add(order.id);
          // New incoming order! Show Foodpanda popup
          setIncomingOrder(order);
          setCountdown(30);
          setShowPopup(true);
          break; // Show one popup at a time
        }
      }
    } catch { /* silent */ }
  }, []);

  // ── Initial load ─────────────────────────────────────────────────────────────
  useEffect(() => {
    loadStats();
    loadHistory();
    pollOrders();
  }, [loadStats, loadHistory, pollOrders]);

  // ── Polling interval ─────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline) pollOrders();
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [isOnline, pollOrders]);

  // ── Countdown timer for popup ─────────────────────────────────────────────────
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

  // ── Toggle availability (Online/Offline) ─────────────────────────────────────
  const handleToggleAvailability = async () => {
    setTogglingAvail(true);
    try {
      const res = await fetchApi<any>('/rider/availability', { method: 'PATCH' }).catch(() => null);
      if (res?.success) {
        setIsOnline(res.data?.isAvailable ?? !isOnline);
      } else {
        setIsOnline((prev) => !prev);
      }
    } finally {
      setTogglingAvail(false);
    }
  };

  // ── Accept incoming order ─────────────────────────────────────────────────────
  const handleAcceptOrder = async () => {
    if (!incomingOrder) return;
    setAcceptingId(incomingOrder.id);
    try {
      const res = await fetchApi<any>(`/rider/orders/${incomingOrder.id}/accept`, { method: 'PATCH' }).catch(() => null);
      if (res?.success) {
        setShowPopup(false);
        // Optimistic: move to PROCESSING
        setActiveOrders((prev) =>
          prev.map((o) => o.id === incomingOrder.id ? { ...o, status: 'PROCESSING' } : o)
        );
        setStepStatus((prev) => ({ ...prev, [incomingOrder.id]: 'PICKUP' }));
        setActionMsg(isBn ? 'অর্ডার গ্রহণ করা হয়েছে! স্টোরে যান।' : 'Order accepted! Heading to merchant shop.');
        setTimeout(() => setActionMsg(''), 4000);
        loadStats();
      } else {
        setActionMsg(res?.message || 'Failed to accept order.');
        setTimeout(() => setActionMsg(''), 3000);
      }
    } finally {
      setAcceptingId(null);
      setIncomingOrder(null);
    }
  };

  const handleDeclineOrder = () => {
    setShowPopup(false);
    setIncomingOrder(null);
    setActionMsg(isBn ? 'অর্ডার বাতিল করা হয়েছে।' : 'Order request declined.');
    setTimeout(() => setActionMsg(''), 3000);
  };

  // ── Advance delivery step ─────────────────────────────────────────────────────
  const handleAdvanceStep = async (order: any) => {
    const currentStep = stepStatus[order.id] || 'PICKUP';
    let nextApiStatus: string;
    let nextStep: 'PICKUP' | 'ON_THE_WAY' | 'DELIVERED';
    let msg: string;

    if (currentStep === 'PICKUP') {
      nextApiStatus = 'SHIPPED';
      nextStep = 'ON_THE_WAY';
      msg = isBn ? 'পণ্য পিকআপ সম্পন্ন! ডেলিভারিতে রওনা দিন।' : 'Items picked up! On the way to customer.';
    } else {
      nextApiStatus = 'DELIVERED';
      nextStep = 'DELIVERED';
      msg = isBn ? '🎉 ডেলিভারি সম্পন্ন! ৳' + order.deliveryFee + ' ক্যাশ পাওয়া গেছে।' : `🎉 Delivered! +৳${order.deliveryFee} earned.`;
    }

    setUpdatingId(order.id);
    try {
      const res = await fetchApi<any>(`/rider/orders/${order.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextApiStatus }),
      }).catch(() => null);

      if (res?.success) {
        setStepStatus((prev) => ({ ...prev, [order.id]: nextStep }));
        if (nextStep === 'DELIVERED') {
          // Remove from active, refresh history & stats
          setActiveOrders((prev) => prev.filter((o) => o.id !== order.id));
          loadHistory();
          loadStats();
        }
        setActionMsg(msg);
        setTimeout(() => setActionMsg(''), 5000);
      } else {
        setActionMsg(res?.message || 'Failed to update status.');
        setTimeout(() => setActionMsg(''), 3000);
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Trip orders that are in active delivery (PROCESSING or SHIPPED) ───────────
  const activeTripOrders = activeOrders.filter((o) =>
    ['PROCESSING', 'SHIPPED'].includes(o.status)
  );

  return (
    <div className="space-y-6 text-white">

      {/* ── RIDER HEADER CARD ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-6 rounded-3xl bg-[#1e1f32] border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
              🛵
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1e1f32] ${
                isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-black text-xl text-white">
                {statsLoading ? 'Loading...' : (user?.name || stats?.vehicleType && `Rider (${stats.vehicleType})` || 'Rider')}
              </h1>
              {stats?.rating && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                  ★ {stats.rating} Rating
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              DOHS Express Doorstep Rider
              {stats?.vehicleType && ` • ${stats.vehicleType}`}
              {stats?.vehicleNo && ` #${stats.vehicleNo}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { pollOrders(); loadStats(); }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10 transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleAvailability}
            disabled={togglingAvail}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-lg disabled:opacity-60 ${
              isOnline
                ? 'bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {togglingAvail ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />
            )}
            <span>{isOnline ? (isBn ? 'অন ডিউটি' : 'On Duty') : (isBn ? 'অফ ডিউটি' : 'Off Duty')}</span>
          </button>
        </div>
      </div>

      {/* Action Message */}
      {actionMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {actionMsg}
        </div>
      )}

      {/* ── STATS METRICS BANNER ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'আজকের ডেলিভারি' : "Today's Deliveries"}</span>
            <Bike className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {statsLoading ? '—' : `${stats?.todayDeliveries ?? 0} Trips`}
          </div>
          <div className="text-[11px] text-emerald-400 font-bold">100% On-time Rate</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'আজকের আয়' : "Today's Earnings"}</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400">
            ৳{formatCurrency(stats?.todayEarnings ?? 0)}
          </div>
          <div className="text-[11px] text-indigo-300 font-bold">Cash + Digital Payout</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'সক্রিয় মিশন' : 'Active Mission'}</span>
            <Navigation className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {activeTripOrders.length > 0 ? `${activeTripOrders.length} Active` : '0 Active'}
          </div>
          <div className="text-[11px] text-slate-400 font-bold">
            {activeTripOrders.length > 0 ? 'Order in Transit' : 'Ready for Next Order'}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'রাইডার রেটিং' : 'Rider Score'}</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            {stats?.rating ? `${stats.rating} ★` : '—'}
          </div>
          <div className="text-[11px] text-slate-400 font-bold">
            Total: {stats?.totalTrips ?? 0} trips • ৳{formatCurrency(stats?.totalEarnings ?? 0)}
          </div>
        </div>
      </div>

      {/* ── ACTIVE TRIP NAVIGATION CARDS ── */}
      {activeTripOrders.map((order) => {
        const step = stepStatus[order.id] || 'PICKUP';
        return (
          <div key={order.id} className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-[#1f2136] to-[#1e1f32] border-2 border-indigo-500/50 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-sm">🛵</span>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                    ACTIVE DELIVERY MISSION ({step})
                  </span>
                  <h3 className="font-extrabold text-white text-lg">
                    #{order.id.slice(-6).toUpperCase()} • {order.items?.[0]?.product?.name || 'Items Order'}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Rider Earning</div>
                <div className="font-black text-emerald-400 text-lg">৳{order.deliveryFee} Fee</div>
              </div>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              {(['PICKUP', 'ON_THE_WAY', 'DELIVERED'] as const).map((s, i) => (
                <div
                  key={s}
                  className={`p-3 rounded-2xl border transition-all ${
                    step === s
                      ? s === 'DELIVERED' ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg'
                        : 'bg-indigo-600 text-white border-indigo-400 shadow-lg'
                      : 'bg-white/5 text-slate-400 border-white/5'
                  }`}
                >
                  {i + 1}. {s === 'PICKUP' ? 'Store Pickup' : s === 'ON_THE_WAY' ? 'On the Way' : 'Doorstep Delivery'}
                </div>
              ))}
            </div>

            {/* Address grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#181928] border border-white/5 space-y-1">
                <div className="text-indigo-400 font-bold flex items-center gap-1.5">
                  <Store className="w-4 h-4" /> Pick Up Store
                </div>
                <div className="font-bold text-white text-sm">
                  {order.items?.[0]?.product?.name ? `${order.items.length} item(s)` : 'DOHS Store'}
                </div>
                <div className="text-slate-400">DOHS Commercial Zone, Mirpur</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#181928] border border-white/5 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Customer Address
                </div>
                <div className="font-bold text-white text-sm">{order.customer?.name || 'Resident'}</div>
                <div className="text-slate-400">
                  {order.address?.line1}, {order.address?.area}, {order.address?.city}
                </div>
                {order.customer?.phone && (
                  <div className="text-indigo-300 font-mono pt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {order.customer.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Step Action Button */}
            {step !== 'DELIVERED' && (
              <button
                onClick={() => handleAdvanceStep(order)}
                disabled={updatingId === order.id}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-60 text-white font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2"
              >
                {updatingId === order.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                <span>
                  {step === 'PICKUP'
                    ? (isBn ? 'স্টোর থেকে পিকআপ সম্পন্ন করুন' : 'Confirm Store Pickup & Move Next')
                    : (isBn ? 'বাসায় হ্যান্ডওভার দিয়ে ডেলিভারি সম্পন্ন করুন' : 'Complete Doorstep Delivery & Collect Cash')}
                </span>
              </button>
            )}
          </div>
        );
      })}

      {/* ── FOODPANDA-STYLE REAL-TIME POPUP MODAL ── */}
      {showPopup && isOnline && incomingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#1e1f32] border-2 border-amber-500/80 p-6 space-y-5 shadow-2xl animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
                </span>
                <h3 className="font-black text-lg text-white tracking-wide">
                  {isBn ? '🚨 নতুন অর্ডার এসাইনমেন্ট!' : '🚨 NEW ORDER ASSIGNED!'}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-mono font-black text-xs border border-rose-500/30">
                {countdown}s
              </span>
            </div>

            {/* Order Details */}
            <div className="p-4 rounded-2xl bg-[#181928] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-indigo-400 text-sm">
                  #{incomingOrder.id.slice(-6).toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs border border-emerald-500/30">
                  ৳{incomingOrder.deliveryFee} Earning Fee
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Store className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">
                      {incomingOrder.items?.length ? `${incomingOrder.items.length} item(s) to pick up` : 'DOHS Store'}
                    </div>
                    <div className="text-slate-400 text-[11px]">DOHS Commercial Zone, Mirpur</div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-2 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">{incomingOrder.customer?.name || 'DOHS Resident'}</div>
                    <div className="text-slate-400 text-[11px]">
                      {incomingOrder.address?.line1}, {incomingOrder.address?.area}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-2 flex justify-between text-slate-300">
                  <span>Items: <strong>{incomingOrder.items?.length || 1}</strong></span>
                  <span className="font-mono font-bold text-white">৳{formatCurrency(incomingOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Accept / Decline Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleDeclineOrder}
                className="py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-extrabold text-xs transition-all border border-red-500/20"
              >
                {isBn ? 'বাতিল করুন' : 'Decline'}
              </button>
              <button
                onClick={handleAcceptOrder}
                disabled={!!acceptingId}
                className="py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60 text-white font-black text-xs transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-1.5"
              >
                {acceptingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{isBn ? 'অর্ডার গ্রহণ করুন' : 'ACCEPT ORDER'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELIVERY HISTORY TABLE ── */}
      <div className="rounded-3xl bg-[#1e1f32] border border-white/10 overflow-hidden shadow-xl space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-white">
            {isBn ? 'সম্পন্ন ট্রিপ হিস্ট্রি' : 'Completed Delivery Trips'}
          </h3>
          <button
            onClick={loadHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-semibold transition-all border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {isBn ? 'রিফ্রেশ' : 'Refresh'}
          </button>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            {isBn ? 'এখনো কোনো ডেলিভারি সম্পন্ন হয়নি।' : 'No completed deliveries yet. Accept and complete an order to see it here.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181928] text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer & Address</th>
                  <th className="p-3">Rider Fee</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {history.map((t: any) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono font-bold text-indigo-400">#{t.id.slice(-6).toUpperCase()}</td>
                    <td className="p-3">
                      <div className="font-bold text-white">{t.customer?.name || 'Resident'}</div>
                      <div className="text-[11px] text-slate-400">{t.address?.area}, {t.address?.city}</div>
                    </td>
                    <td className="p-3 font-black text-emerald-400">৳{formatCurrency(t.deliveryFee)}</td>
                    <td className="p-3 text-slate-400">
                      {new Date(t.updatedAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        DELIVERED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
