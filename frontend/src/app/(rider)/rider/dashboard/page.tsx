'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useSocket } from '@/hooks/useSocket';
import {
  Bike, Navigation, CheckCircle2, Clock, MapPin, Phone, Store,
  BellRing, DollarSign, Package, Check, X, Loader2, Wifi, WifiOff,
  ExternalLink, Sparkles, TrendingUp, Calendar, Award, AlertTriangle, User,
  Radio, Search, Filter, ShieldCheck, Wallet, ChevronRight, Activity
} from 'lucide-react';

import { CurrentMissionView } from '@/components/rider/CurrentMissionView';

// Web Audio API chime synthesis & Haptic Vibration for incoming dispatch request
const triggerOrderAlert = () => {
  try {
    // 1. Web Audio Chime
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const playBeep = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = ctx.currentTime;
      playBeep(880, now, 0.15);
      playBeep(1174.66, now + 0.2, 0.35);
    }

    // 2. Mobile Haptic Vibration
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([300, 150, 300, 150, 400]);
    }
  } catch (_) {}
};

export default function RiderDashboardPage() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const { socket } = useSocket();
  const isBn = language === 'BN';

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // ── State Management ────────────────────────────────────────────────────────
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [isOnline, setIsOnline] = useState(false);
  const [togglingDuty, setTogglingDuty] = useState(false);

  // Fullscreen Foodpanda Order Popup
  const [incomingOrder, setIncomingOrder] = useState<any | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [showPopup, setShowPopup] = useState(false);

  // Active Missions, History & Filters
  const [activeMissions, setActiveMissions] = useState<any[]>([]);
  const [openOrdersList, setOpenOrdersList] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historySearch, setHistorySearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'mission' | 'history' | 'earnings'>('mission');

  // ── Load Rider Profile Stats ───────────────────────────────────────────────
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

  // ── Load Active Missions ───────────────────────────────────────────────────
  const loadActiveMissions = useCallback(async () => {
    try {
      const res = await fetchApi<any>('/rider/orders/active').catch(() => null);
      if (res?.success && Array.isArray(res.data)) {
        setActiveMissions(res.data);
      }
    } catch (_) {}
  }, []);

  // ── Load Delivery History ──────────────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetchApi<any>('/rider/orders/history?limit=20').catch(() => null);
      if (res?.success && Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // ── Check Open Broadcast Orders ────────────────────────────────────────────
  const checkOpenOrders = useCallback(async () => {
    try {
      const res = await fetchApi<any>('/rider/orders/open').catch(() => null);
      if (res?.success && Array.isArray(res.data)) {
        setOpenOrdersList(res.data);
        if (res.data.length > 0 && !showPopup && !incomingOrder) {
          const order = res.data[0];
          setIncomingOrder({
            orderId: order.id,
            storeName: order.items[0]?.product?.seller?.sellerProfile?.shopName || 'DOHS Merchant Store',
            storeAddress: 'DOHS Central Supermarket, Gate 2',
            customerName: order.customer?.name || 'Resident',
            customerPhone: order.customerPhone || order.customer?.phone || order.address?.phone || '01306031982',
            address: `${order.address?.line1 || 'Block C'}, ${order.address?.area || 'Mohakhali DOHS'}`,
            totalItems: order.items?.length || 1,
            totalAmount: order.totalAmount,
            earnings: order.deliveryFee || 50,
            distance: '1.2 km',
            estimatedTime: '20 mins',
            paymentType: 'Cash on Delivery (COD)',
          });
          setCountdown(30);
          setShowPopup(true);
          triggerOrderAlert();
        }
      }
    } catch (_) {}
  }, [showPopup, incomingOrder]);

  useEffect(() => {
    loadStats();
    loadActiveMissions();
    loadHistory();
    checkOpenOrders();
  }, [loadStats, loadActiveMissions, loadHistory, checkOpenOrders]);

  // Periodic poll check for open orders when online & no active popup
  useEffect(() => {
    if (!isOnline || showPopup || activeMissions.length > 0) return;
    const interval = setInterval(() => {
      checkOpenOrders();
    }, 4000);
    return () => clearInterval(interval);
  }, [isOnline, showPopup, activeMissions.length, checkOpenOrders]);

  // ── Real-Time Socket.IO Synchronization ─────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    if (isOnline) {
      socket.emit('register_rider');
    }

    const handleBroadcast = (data: any) => {
      console.log('⚡ [RIDER DASHBOARD] Received RIDER_ORDER_BROADCAST payload:', data);
      setIncomingOrder(data);
      setCountdown(30);
      setShowPopup(true);
      triggerOrderAlert();
    };

    const handleDismiss = (data: { orderId: string; assignedRiderId?: string }) => {
      console.log('⚡ [RIDER DASHBOARD] Received RIDER_ORDER_DISMISS event:', data);
      setIncomingOrder((prev: any) => {
        if (prev?.orderId === data.orderId || prev?.id === data.orderId) {
          setShowPopup(false);
          return null;
        }
        return prev;
      });
    };

    const handleTimeout = (data: { orderId: string }) => {
      console.log('⚡ [RIDER DASHBOARD] Received RIDER_ORDER_TIMEOUT event:', data);
      setIncomingOrder((prev: any) => {
        if (prev?.orderId === data.orderId || prev?.id === data.orderId) {
          setShowPopup(false);
          return null;
        }
        return prev;
      });
    };

    const handleStatusUpdate = () => {
      console.log('⚡ [RIDER DASHBOARD] Received ORDER_STATUS_UPDATED event');
      loadActiveMissions();
      loadStats();
    };

    socket.on('RIDER_ORDER_BROADCAST', handleBroadcast);
    socket.on('RIDER_ORDER_DISMISS', handleDismiss);
    socket.on('RIDER_ORDER_TIMEOUT', handleTimeout);
    socket.on('ORDER_STATUS_UPDATED', handleStatusUpdate);

    return () => {
      socket.off('RIDER_ORDER_BROADCAST', handleBroadcast);
      socket.off('RIDER_ORDER_DISMISS', handleDismiss);
      socket.off('RIDER_ORDER_TIMEOUT', handleTimeout);
      socket.off('ORDER_STATUS_UPDATED', handleStatusUpdate);
    };
  }, [socket, isOnline, loadActiveMissions, loadStats]);

  // ── 30-Second SVG Countdown Timer ──────────────────────────────────────────
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

  // Confirmation Modal state for open orders
  const [confirmOrderToAccept, setConfirmOrderToAccept] = useState<any | null>(null);

  // ── Toggle Duty Status ───────────────────────────────────────────────────────
  const handleToggleDuty = async () => {
    setTogglingDuty(true);
    try {
      const nextDuty = !isOnline;
      setIsOnline(nextDuty);
      const res = await fetchApi<any>('/rider/duty', {
        method: 'PATCH',
        body: JSON.stringify({ isOnline: nextDuty, isOnDuty: nextDuty }),
      }).catch((err) => {
        console.error('Error toggling rider duty:', err);
        return null;
      });

      if (res && res.data) {
        setIsOnline(res.data.isOnline ?? nextDuty);
      }
      setActionMsg(nextDuty ? (isBn ? 'আপনি এখন সক্রিয় ও অন ডিউটিতে আছেন!' : 'You are now Online & On-Duty!') : (isBn ? 'আপনি এখন অফলাইনে আছেন!' : 'You are now Offline!'));
      setTimeout(() => setActionMsg(''), 4000);
      if (nextDuty) checkOpenOrders();
    } catch (err) {
      console.error('Error in handleToggleDuty:', err);
    } finally {
      setTogglingDuty(false);
    }
  };

  // ── Accept Broadcast Order (First Rider Wins Atomic Transaction Check) ──────
  const handleAcceptOrder = async (orderIdToAccept?: string) => {
    const targetId = orderIdToAccept || incomingOrder?.orderId || incomingOrder?.id;
    if (!targetId) return;

    setActionLoading(targetId);
    setActionMsg('');
    try {
      const res = await fetchApi<any>(`/rider/orders/${targetId}/accept`, {
        method: 'POST',
      });
      if (res?.success) {
        setShowPopup(false);
        setIncomingOrder(null);
        setConfirmOrderToAccept(null);
        setActionMsg(isBn ? 'মিশন সফলভাবে গ্রহণ করা হয়েছে!' : 'Order accepted & assigned successfully!');
        loadActiveMissions();
        loadStats();
        checkOpenOrders();
      } else {
        setActionMsg(res?.message || 'This order has already been accepted by another rider.');
        setShowPopup(false);
        setIncomingOrder(null);
        setConfirmOrderToAccept(null);
      }
    } catch (err: any) {
      setActionMsg(err?.message || 'This order has already been accepted by another rider.');
      setShowPopup(false);
      setIncomingOrder(null);
      setConfirmOrderToAccept(null);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Progress Mission Status (SINGLE BUTTON MILESTONE) ──────────────────────
  const handleStepUpdate = async (orderId: string, nextStatus: string) => {
    setActionLoading(orderId);
    setActionMsg('');
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
          setActionMsg(isBn ? 'ডেলিভারি সম্পন্ন হয়েছে! পয়েন্ট যোগ করা হয়েছে।' : 'Delivery completed successfully! Mission archived.');
        }
      } else {
        setActionMsg(res?.message || 'Failed to update delivery milestone');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const getSingleStepButton = (currentStatus: string) => {
    switch (currentStatus) {
      case 'RIDER_ASSIGNED':
        return { label: isBn ? 'স্টোরে পৌঁছেছি (ARRIVED AT STORE)' : 'ARRIVED AT STORE', nextStatus: 'ARRIVED_AT_STORE', color: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-950/50' };
      case 'ARRIVED_AT_STORE':
      case 'PICKUP_STARTED':
        return { label: isBn ? 'পণ্য সংগ্রহ করা হয়েছে (PACKAGE COLLECTED)' : 'PACKAGE COLLECTED', nextStatus: 'PICKED_UP', color: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-950/50' };
      case 'PICKED_UP':
        return { label: isBn ? 'ডেলিভারি যাত্রা শুরু (START DELIVERY)' : 'START DELIVERY', nextStatus: 'ON_THE_WAY', color: 'bg-blue-600 hover:bg-blue-500 shadow-blue-950/50' };
      case 'ON_THE_WAY':
        return { label: isBn ? 'গন্তব্যে পৌঁছেছি (ARRIVED DESTINATION)' : 'ARRIVED DESTINATION', nextStatus: 'ARRIVED_DESTINATION', color: 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/50' };
      case 'ARRIVED':
      case 'ARRIVED_DESTINATION':
        return { label: isBn ? 'ডেলিভারি সম্পন্ন করুন (COMPLETE DELIVERY)' : 'COMPLETE DELIVERY', nextStatus: 'DELIVERED', color: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50' };
      default:
        return { label: 'COMPLETE DELIVERY', nextStatus: 'DELIVERED', color: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50' };
    }
  };

  const hasActiveMission = activeMissions.length > 0;
  const currentMission   = activeMissions[0];

  const filteredHistory = history.filter((item) => {
    if (!historySearch) return true;
    const q = historySearch.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.customer?.name?.toLowerCase().includes(q) ||
      item.address?.line1?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 pb-24 relative">
      {/* ── 1. RIDER PROFILE & STATUS CARD ── */}
      <div className="max-w-5xl mx-auto bg-slate-900/90 p-6 md:p-8 rounded-3xl border border-slate-800 backdrop-blur-xl mb-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/30 flex items-center justify-center font-extrabold text-2xl" suppressHydrationWarning>
                {mounted && user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
              </div>
              <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center ${
                isOnline ? 'bg-emerald-500' : 'bg-rose-500'
              }`}>
                {isOnline ? <Wifi className="w-3 h-3 text-slate-950" /> : <WifiOff className="w-3 h-3 text-white" />}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white" suppressHydrationWarning>
                  {mounted && user?.name ? user.name : (isBn ? 'রাইডার' : 'Rider')}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono text-[11px] font-bold border border-slate-700">
                  FLEET-#104
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1 font-semibold text-emerald-400">
                  <Activity className="w-3.5 h-3.5" />
                  {isOnline ? (hasActiveMission ? 'STATUS: BUSY (ON MISSION)' : 'STATUS: ONLINE & AVAILABLE') : 'STATUS: OFFLINE'}
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-300">Vehicle: {stats?.vehicleType || 'Motorbike'}</span>
              </div>
            </div>
          </div>

          {/* Large Tactile Toggle Button */}
          <button
            onClick={handleToggleDuty}
            disabled={togglingDuty}
            className={`w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-2xl ${
              isOnline
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/60'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60 animate-pulse'
            }`}
          >
            {togglingDuty ? <Loader2 className="w-5 h-5 animate-spin" /> : <BellRing className="w-5 h-5" />}
            {isOnline ? (isBn ? 'অফলাইন যান (GO OFFLINE)' : 'GO OFFLINE') : (isBn ? 'অনলাইন যান (GO ONLINE)' : 'GO ONLINE')}
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="max-w-5xl mx-auto mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between shadow-lg">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg('')} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ── 2. TODAY'S SUMMARY CARDS (NO COMPLEX CHARTS) ── */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-8">
        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">{isBn ? 'আজকের উপার্জন' : "Today's Earnings"}</span>
          <p className="text-2xl font-black text-emerald-400">{statsLoading ? '...' : formatCurrency(stats?.todayEarnings || 0)}</p>
        </div>
        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">{isBn ? 'আজকের রাইড' : "Today's Deliveries"}</span>
          <p className="text-2xl font-black text-white">{statsLoading ? '...' : stats?.todayDeliveries || 0}</p>
        </div>
        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">{isBn ? 'সম্পন্ন হার' : 'Completion Rate'}</span>
          <p className="text-2xl font-black text-cyan-400">100%</p>
        </div>
        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">{isBn ? 'গড় রেটিং' : 'Fleet Rating'}</span>
          <p className="text-2xl font-black text-amber-400">⭐ {statsLoading ? '...' : stats?.rating || '5.0'}</p>
        </div>
        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 space-y-1 col-span-2 md:col-span-1">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">{isBn ? 'অনলাইন সময়' : 'Online Time'}</span>
          <p className="text-2xl font-black text-indigo-400">4.5 hrs</p>
        </div>
      </div>

      {/* ── 3. FULLSCREEN DISPATCH REQUEST POPUP MODAL (FOODPANDA STYLE) ── */}
      {showPopup && incomingOrder && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl shadow-amber-500/30 relative animate-in zoom-in duration-300 space-y-6">
            {/* Header with SVG Animated 30s Countdown Ring */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3 text-amber-400">
                <BellRing className="w-8 h-8 animate-bounce text-amber-400" />
                <div>
                  <span className="text-xs text-amber-400 font-black uppercase tracking-widest block">
                    {isBn ? 'নতুন রাইড ডিসপ্যাচ' : 'NEW DELIVERY REQUEST'}
                  </span>
                  <h2 className="text-xl font-black text-white">{isBn ? 'নতুন অর্ডার পিকআপ' : 'Immediate Pickup Required'}</h2>
                </div>
              </div>

              {/* 30s Countdown Ring */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-slate-800" fill="transparent" />
                  <circle
                    cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4"
                    className="text-amber-400 transition-all duration-1000"
                    fill="transparent"
                    strokeDasharray={176}
                    strokeDashoffset={176 - (176 * countdown) / 30}
                  />
                </svg>
                <span className="absolute font-mono text-base font-black text-amber-400">{countdown}s</span>
              </div>
            </div>

            {/* Request Details Card */}
            <div className="space-y-4 text-slate-200">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <Store className="w-4 h-4" /> {isBn ? 'পিকআপ দোকান' : 'Pickup Store'}
                </span>
                <p className="text-white font-bold text-base">{incomingOrder.storeName}</p>
                <p className="text-slate-400 text-xs">{incomingOrder.storeAddress || 'DOHS Central Supermarket'}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-rose-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Destination'}
                </span>
                <p className="text-white font-bold text-base">{incomingOrder.address}</p>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-xs">
                  <span className="text-slate-300">Customer: <strong className="text-white">{incomingOrder.customerName}</strong></span>
                  <a
                    href={`tel:${incomingOrder.customerPhone || '01306031982'}`}
                    className="flex items-center gap-1.5 text-emerald-400 font-bold hover:underline bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{incomingOrder.customerPhone || '01306031982'}</span>
                  </a>
                </div>
              </div>

              {/* Earnings & COD */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center">
                  <span className="text-xs text-emerald-400 font-bold block">{isBn ? 'আনুমানিক আয়' : 'Estimated Earnings'}</span>
                  <span className="text-2xl font-black text-emerald-400">{formatCurrency(incomingOrder.earnings || 50)}</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl text-center">
                  <span className="text-xs text-slate-300 font-bold block">{isBn ? 'পেমেন্ট টাইপ' : 'Payment Type'}</span>
                  <span className="text-sm font-black text-white mt-1 block">Cash on Delivery (COD)</span>
                </div>
              </div>
            </div>

            {/* Action Touch Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => { setShowPopup(false); setIncomingOrder(null); }}
                className="py-4 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all text-sm"
              >
                {isBn ? 'প্রত্যাখ্যান' : 'Decline'}
              </button>
              <button
                onClick={() => handleAcceptOrder()}
                disabled={actionLoading === (incomingOrder.orderId || incomingOrder.id)}
                className="py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black transition-all shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 text-sm tracking-wide"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                {isBn ? 'একসেপ্ট করুন' : 'ACCEPT MISSION'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. MAIN WORKFLOW: RADAR WAITING SCREEN OR MISSION MODE ── */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Tab Bar */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
              activeTab === 'mission' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Navigation className="w-4 h-4" />
            {isBn ? 'চলতি মিশন' : 'Active Mission'}
            {hasActiveMission && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />}
          </button>
          <button
            onClick={() => { setActiveTab('history'); loadHistory(); }}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
              activeTab === 'history' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            {isBn ? 'ডেলিভারি হিস্ট্রি' : 'Delivery History'}
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
              activeTab === 'earnings' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            {isBn ? 'উপার্জন সামারি' : 'Earnings Overview'}
          </button>
        </div>

        {/* ── TAB 1: RADAR WAITING SCREEN OR ACTIVE MISSION ── */}
        {activeTab === 'mission' && (
          <div>
            {!hasActiveMission ? (
              openOrdersList.length > 0 ? (
                /* AVAILABLE DISPATCH REQUEST CARDS */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <BellRing className="w-5 h-5 text-amber-400 animate-bounce" />
                      {isBn ? `পিকআপের জন্য প্রস্তুত রাইড (${openOrdersList.length})` : `Available Dispatch Requests (${openOrdersList.length})`}
                    </h3>
                    <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                      Ready for Rider Pickup
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {openOrdersList.map((order: any) => {
                      const storeName = order.items?.[0]?.product?.seller?.sellerProfile?.shopName || order.items?.[0]?.product?.seller?.name || 'DOHS Merchant Store';
                      const customerAddress = `${order.address?.line1 || 'Block C'}, ${order.address?.area || 'Mohakhali DOHS'}`;
                      const customerPhone = order.customerPhone || order.customer?.phone || '01306031982';
                      const customerName = order.customer?.name || 'Resident Customer';
                      const orderSummary = order.items?.map((i: any) => `${i.product?.name || 'Item'} (x${i.quantity})`).join(', ') || 'Grocery / Home Items';
                      const earnings = order.deliveryFee || 50;

                      return (
                        <div key={order.id} className="bg-slate-900 border-2 border-slate-800 hover:border-amber-500/50 p-6 rounded-3xl space-y-4 shadow-xl transition-all flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                              <span className="font-mono font-black text-white text-sm">Order #{order.id.slice(-8).toUpperCase()}</span>
                              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                                ৳{earnings} Earnings
                              </span>
                            </div>

                            <div className="space-y-3 text-xs">
                              {/* Merchant / Store */}
                              <div className="flex items-start gap-2 text-slate-300">
                                <Store className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="text-white block text-sm">{storeName}</strong>
                                  <span className="text-slate-400">DOHS Central Market</span>
                                </div>
                              </div>

                              {/* Customer & Address */}
                              <div className="flex items-start gap-2 text-slate-300 pt-2 border-t border-slate-800/60">
                                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="text-white block">{customerName}</strong>
                                  <span className="text-slate-400 block">{customerAddress}</span>
                                </div>
                              </div>

                              {/* Order Summary */}
                              <div className="pt-2 border-t border-slate-800/60 space-y-1">
                                <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Order Summary:</span>
                                <p className="text-slate-200 font-medium truncate">{orderSummary}</p>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-800 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-bold">Total Amount:</span>
                              <span className="text-white font-black text-sm">৳{formatCurrency(order.totalAmount)}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <a
                                href={`tel:${customerPhone}`}
                                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-2xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Call Customer</span>
                              </a>

                              <button
                                type="button"
                                onClick={() => setConfirmOrderToAccept(order)}
                                disabled={actionLoading === order.id}
                                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                              >
                                {actionLoading === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                <span>Accept Delivery</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* RADAR SCANNING WAITING SCREEN */
                <div className="bg-slate-900/70 p-12 md:p-16 rounded-3xl border border-slate-800 text-center space-y-6 shadow-2xl">
                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                    <span className={`absolute inset-0 rounded-full ${isOnline ? 'bg-emerald-500/20 animate-ping' : 'bg-rose-500/10'}`} />
                    <span className={`absolute inset-3 rounded-full ${isOnline ? 'bg-emerald-500/30 animate-pulse' : 'bg-rose-500/20'}`} />
                    <div className={`relative w-20 h-20 rounded-2xl border flex items-center justify-center ${
                      isOnline ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/10 text-rose-400 border-rose-500/40'
                    }`}>
                      {isOnline ? <Radio className="w-10 h-10 animate-spin" /> : <WifiOff className="w-10 h-10" />}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white">
                      {isOnline ? (isBn ? 'ডেলিভারি রিকুয়েস্টের জন্য অপেক্ষা করা হচ্ছে...' : 'Waiting for Delivery Request') : (isBn ? 'আপনি অফলাইনে আছেন' : 'You are Currently Offline')}
                    </h3>
                    <p className="text-slate-400 text-xs max-w-md mx-auto">
                      {isOnline
                        ? (isBn ? 'অনলাইন ও ফ্রি থাকুন। স্টোর অর্ডার ছাড়লেই সাথে সাথে ফুলস্ক্রিন রিকুয়েস্ট আসবে।' : 'Stay online to automatically receive delivery requests in Mohakhali DOHS area.')
                        : (isBn ? 'নতুন রাইড পাওয়ার জন্য উপরে "GO ONLINE" বাটনে চাপ দিন।' : 'Click "GO ONLINE" button at the top to start receiving live delivery missions.')}
                    </p>
                  </div>

                  {isOnline && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      ONLINE • AVAILABLE • Listening for new dispatch requests...
                    </div>
                  )}
                </div>
              )
            ) : (
              /* ACTIVE MISSION MODE VIEW (OpenStreetMap PWA Navigation) */
              <CurrentMissionView
                mission={currentMission}
                onMissionUpdate={() => {
                  loadActiveMissions();
                  loadStats();
                }}
              />
            )}
          </div>
        )}

        {/* ── TAB 2: SIMPLE DELIVERY HISTORY (FILTERABLE CARDS ONLY - NO TABLES) ── */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" /> Completed Delivery History
              </h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by order or customer..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {historyLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              </div>
            ) : filteredHistory.length === 0 ? (
              <p className="text-slate-400 text-xs py-10 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
                No past deliveries matching search.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHistory.map((item: any) => (
                  <div key={item.id} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="font-black text-white text-sm">Order #{item.id.slice(-8).toUpperCase()}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        DELIVERED
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 space-y-1">
                      <p><strong className="text-slate-400">Customer:</strong> {item.customer?.name || 'Resident'}</p>
                      <p><strong className="text-slate-400">Address:</strong> {item.address?.line1}, {item.address?.area}</p>
                      <p><strong className="text-slate-400">Completed:</strong> {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="text-slate-400 font-bold">Delivery Fee Earned</span>
                      <span className="text-emerald-400 font-black text-base">{formatCurrency(item.deliveryFee || 50)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: EARNINGS OVERVIEW ── */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" /> Financial Earnings Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Today's Earnings</span>
                <p className="text-3xl font-black text-emerald-400">{formatCurrency(stats?.todayEarnings || 0)}</p>
                <p className="text-[11px] text-slate-400 pt-1">{stats?.todayDeliveries || 0} completed rides</p>
              </div>

              <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">This Week</span>
                <p className="text-3xl font-black text-white">{formatCurrency((stats?.todayEarnings || 0) * 4)}</p>
                <p className="text-[11px] text-slate-400 pt-1">Weekly payout cycle</p>
              </div>

              <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">This Month</span>
                <p className="text-3xl font-black text-cyan-400">{formatCurrency(stats?.totalEarnings || 9200)}</p>
                <p className="text-[11px] text-slate-400 pt-1">Monthly trip total</p>
              </div>

              <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Withdrawal Balance</span>
                <p className="text-3xl font-black text-amber-400">{formatCurrency(stats?.totalEarnings || 9200)}</p>
                <p className="text-[11px] text-emerald-400 pt-1 font-semibold">Available for payout</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accept Order Confirmation Modal */}
      {confirmOrderToAccept && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Confirm Delivery Acceptance</span>
              </h3>
              <button
                type="button"
                onClick={() => setConfirmOrderToAccept(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">Are you sure you want to accept delivery for this order?</p>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="font-bold text-white">#{confirmOrderToAccept.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Name:</span>
                  <span className="font-bold text-white">{confirmOrderToAccept.customer?.name || 'Resident'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone Number:</span>
                  <span className="font-bold text-emerald-400">{confirmOrderToAccept.customerPhone || confirmOrderToAccept.customer?.phone || '01306031982'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Address:</span>
                  <span className="font-bold text-white text-right max-w-[180px] truncate">
                    {confirmOrderToAccept.address?.line1}, {confirmOrderToAccept.address?.area}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-400 font-bold">Total Amount:</span>
                  <span className="font-black text-white text-sm">৳{formatCurrency(confirmOrderToAccept.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmOrderToAccept(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAcceptOrder(confirmOrderToAccept.id)}
                disabled={actionLoading === confirmOrderToAccept.id}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading === confirmOrderToAccept.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Confirm & Accept</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
