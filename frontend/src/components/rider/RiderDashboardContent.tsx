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

export function RiderDashboardContent({ initialTab = 'mission' }: { initialTab?: 'mission' | 'history' | 'earnings' }) {
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
  const [dismissedOrderIds, setDismissedOrderIds] = useState<string[]>([]);

  const handleDismissOrder = (orderId?: string) => {
    const idToDismiss = orderId || incomingOrder?.orderId || incomingOrder?.id;
    if (idToDismiss) {
      setDismissedOrderIds((prev) => (prev.includes(idToDismiss) ? prev : [...prev, idToDismiss]));
    }
    setShowPopup(false);
    setIncomingOrder(null);
  };

  // Active Missions, History & Filters
  const [activeMissions, setActiveMissions] = useState<any[]>([]);
  const [openOrdersList, setOpenOrdersList] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historySearch, setHistorySearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'mission' | 'history' | 'earnings'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // ── Withdrawal State ──────────────────────────────────────────────────────
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    paymentMethod: 'bKash',
    accountNumber: '',
    accountName: '',
    bankName: '',
    note: '',
  });

  const loadWithdrawals = useCallback(async () => {
    try {
      const res = await fetchApi<any>('/rider/withdraw').catch(() => null);
      if (res?.success && res.data) {
        setWithdrawals(res.data.requests || []);
        if (res.data.availableBalance !== undefined) {
          setAvailableBalance(res.data.availableBalance);
        }
      }
    } catch (_) {}
  }, []);

  const handleRequestWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawForm.amount);
    if (!amt || isNaN(amt) || amt < 100) {
      alert(isBn ? 'সর্বনিম্ন ১০০০ টাকা উত্তোলন করা সম্ভব' : 'Minimum withdrawal amount is ৳100.');
      return;
    }
    if (!withdrawForm.accountNumber) {
      alert(isBn ? 'অনুগ্রহ করে অ্যাকাউন্ট নম্বর দিন' : 'Please enter your account number.');
      return;
    }

    try {
      setSubmittingWithdraw(true);
      const res = await fetchApi<any>('/rider/withdraw', {
        method: 'POST',
        body: JSON.stringify({
          amount: amt,
          paymentMethod: withdrawForm.paymentMethod,
          accountNumber: withdrawForm.accountNumber,
          accountName: withdrawForm.accountName || undefined,
          bankName: withdrawForm.bankName || undefined,
          note: withdrawForm.note || undefined,
        }),
      });

      if (res?.success) {
        setActionMsg(isBn ? 'উইথড্রয়াল আবেদন সফলভাবে জমা দেওয়া হয়েছে! এডমিন রিভিউর পর পেআউট সম্পন্ন হবে।' : 'Withdrawal request submitted successfully! Admin will process payout shortly.');
        setShowWithdrawModal(false);
        setWithdrawForm({ amount: '', paymentMethod: 'bKash', accountNumber: '', accountName: '', bankName: '', note: '' });
        loadWithdrawals();
        setTimeout(() => setActionMsg(''), 4000);
      } else {
        alert(res?.message || 'Failed to submit withdrawal request');
      }
    } catch (err: any) {
      alert(err?.message || 'Error requesting withdrawal');
    } finally {
      setSubmittingWithdraw(false);
    }
  };

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
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    loadStats();
    loadActiveMissions();
    loadHistory();
    loadWithdrawals();
    checkOpenOrders();
  }, [loadStats, loadActiveMissions, loadHistory, loadWithdrawals, checkOpenOrders]);

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
      handleDismissOrder();
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

      {/* ── 2. MAIN WORKFLOW: RADAR WAITING SCREEN OR MISSION MODE (PRIMARY VIEW) ── */}
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Tab Bar */}
        <div className="flex items-center gap-3.5 border-b border-slate-800/80 pb-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-6 py-3 rounded-2xl font-extrabold text-sm transition-all duration-200 flex items-center gap-2.5 shrink-0 ${
              activeTab === 'mission'
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-950/60 scale-[1.02]'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Navigation className="w-4 h-4 text-emerald-300" />
            <span>{isBn ? 'চলতি মিশন' : 'Active Mission'}</span>
            {hasActiveMission && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />}
          </button>
          <button
            onClick={() => { setActiveTab('history'); loadHistory(); }}
            className={`px-6 py-3 rounded-2xl font-extrabold text-sm transition-all duration-200 flex items-center gap-2.5 shrink-0 ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-950/60 scale-[1.02]'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-300" />
            <span>{isBn ? 'ডেলিভারি হিস্ট্রি' : 'Delivery History'}</span>
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-6 py-3 rounded-2xl font-extrabold text-sm transition-all duration-200 flex items-center gap-2.5 shrink-0 ${
              activeTab === 'earnings'
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-950/60 scale-[1.02]'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-300" />
            <span>{isBn ? 'উপার্জন সামারি' : 'Earnings Overview'}</span>
          </button>
        </div>

        {/* ── TAB 1: RADAR WAITING SCREEN OR ACTIVE MISSION ── */}
        {activeTab === 'mission' && (
          <div>
            {!hasActiveMission ? (
              openOrdersList.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                      <Compass className="w-4 h-4 text-amber-400" />
                      {isBn ? 'উপলব্ধ সার্ভিস রিকোয়েস্ট' : 'Open Available Dispatch Orders'}
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs">{openOrdersList.length}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {openOrdersList.map((order) => {
                      const customerName = order.customer?.name || order.customerName || 'DOHS Resident';
                      const customerPhone = order.customer?.phone || order.customerPhone || '01306031982';
                      const customerAddress = order.address ? `${order.address.line1}, ${order.address.area}` : order.deliveryAddress || 'Mohakhali DOHS';
                      const storeName = order.items?.[0]?.product?.seller?.sellerProfile?.shopName || order.items?.[0]?.product?.seller?.name || order.storeName || 'DOHS Merchant';
                      const orderSummary = order.items?.map((it: any) => `${it.product?.name || 'Item'} x${it.quantity}`).join(', ') || 'Grocery & Food Delivery';

                      return (
                        <div key={order.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-emerald-500/50 transition-all space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <span className="font-mono text-xs text-amber-400 font-extrabold">ORDER #{order.id.slice(-8).toUpperCase()}</span>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                              {formatCurrency(order.deliveryFee || 50)} {isBn ? 'উপার্জন' : 'Earnings'}
                            </span>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div className="flex items-start gap-2.5">
                              <Store className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Pickup Store:</span>
                                <strong className="text-white block">{storeName}</strong>
                              </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                              <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-white block">{customerName}</strong>
                                <span className="text-slate-400 block">{customerAddress}</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-800/60 space-y-1">
                              <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Order Summary:</span>
                              <p className="text-slate-200 font-medium truncate">{orderSummary}</p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-800 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-bold">Total Amount:</span>
                              <span className="text-white font-black text-sm">{formatCurrency(order.totalAmount)}</span>
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
                                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-1.5 transition-all"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept Mission</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Radar Pulse Radar View when Idle */
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
                    <div className="absolute inset-2 rounded-full bg-emerald-500/20 animate-pulse" />
                    <div className="w-20 h-20 rounded-3xl bg-slate-950 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-2xl relative z-10">
                      <Radio className="w-10 h-10 animate-pulse text-emerald-400" />
                    </div>
                  </div>

                  <div className="max-w-md mx-auto space-y-2">
                    <h2 className="text-2xl font-black text-white">{isBn ? 'রাইড রিকোয়েস্টের অপেক্ষায়...' : 'Waiting for Delivery Request'}</h2>
                    <p className="text-slate-400 text-xs">
                      {isBn
                        ? 'মহাখালী DOHS এরিয়াতে সরাসরি নতুন রাইড ও অর্ডার নোটিফিকেশন পেতে প্রস্তুত থাকুন।'
                        : 'Stay online to automatically receive delivery requests in Mohakhali DOHS area.'}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE • AVAILABLE • Listening for new dispatch requests...
                  </div>
                </div>
              )
            ) : (
              /* Active Mission View Component */
              currentMission && (
                <CurrentMissionView
                  mission={currentMission}
                  onMissionUpdate={() => {
                    loadActiveMissions();
                    loadStats();
                  }}
                />
              )
            )}
          </div>
        )}

        {/* ── TAB 2: DELIVERY HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-cyan-400" />
              {isBn ? 'সম্পন্ন রাইড হিস্ট্রি' : 'Completed Delivery History'}
            </h3>

            {historyLoading ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
                Loading history...
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 text-center text-slate-400 text-sm">
                No delivery history found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHistory.map((h: any) => (
                  <div key={h.id} className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <span className="font-mono text-slate-400 font-bold">#{h.id.slice(-8).toUpperCase()}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px]">
                        {h.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>Customer:</span>
                      <strong className="text-white">{h.customer?.name || h.customerName || 'N/A'}</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Delivered At:</span>
                      <strong className="text-slate-300">
                        {h.deliveredAt ? new Date(h.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Completed'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800/60">
                      <span>Rider Earnings:</span>
                      <strong className="text-emerald-400 font-mono text-sm">{formatCurrency(h.deliveryFee || 50)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: EARNINGS & WITHDRAWAL OVERVIEW ── */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Fleet Earnings</span>
                  <p className="text-3xl md:text-4xl font-black text-emerald-400 font-mono mt-1">
                    {formatCurrency(stats?.totalEarnings || 0)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(true)}
                  className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all shrink-0"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Request Withdrawal</span>
                </button>
              </div>

              {/* Withdrawal History Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Recent Payout Requests</h4>
                {withdrawals.length === 0 ? (
                  <p className="text-xs text-slate-500">No withdrawal requests found.</p>
                ) : (
                  <div className="space-y-2.5">
                    {withdrawals.map((w) => (
                      <div key={w.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-white font-mono block">৳{formatCurrency(w.amount)}</strong>
                          <span className="text-slate-400 text-[11px]">{w.paymentMethod} • {w.accountNumber}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          w.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                          w.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {w.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. TODAY'S SUMMARY CARDS (HIGH-VISIBILITY KPI METRICS AT BOTTOM) ── */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 mb-8">
        <div className="bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 p-5 sm:p-6 rounded-3xl border border-emerald-500/20 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-extrabold uppercase tracking-wider block">{isBn ? 'আজকের উপার্জন' : "Today's Earnings"}</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-emerald-400 mt-3 font-mono">{statsLoading ? '...' : formatCurrency(stats?.todayEarnings || 0)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-900 p-5 sm:p-6 rounded-3xl border border-blue-500/20 shadow-xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-extrabold uppercase tracking-wider block">{isBn ? 'আজকের রাইড' : "Today's Deliveries"}</span>
            <Bike className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-white mt-3 font-mono">{statsLoading ? '...' : stats?.todayDeliveries || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-900 p-5 sm:p-6 rounded-3xl border border-cyan-500/20 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-extrabold uppercase tracking-wider block">{isBn ? 'সম্পন্ন হার' : 'Completion Rate'}</span>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-cyan-400 mt-3 font-mono">100%</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-5 sm:p-6 rounded-3xl border border-amber-500/20 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-extrabold uppercase tracking-wider block">{isBn ? 'গড় রেটিং' : 'Fleet Rating'}</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-amber-400 mt-3 font-mono">⭐ {statsLoading ? '...' : stats?.rating || '5.0'}</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-900 p-5 sm:p-6 rounded-3xl border border-indigo-500/20 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-extrabold uppercase tracking-wider block">{isBn ? 'অনলাইন সময়' : 'Online Time'}</span>
            <Clock className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-indigo-400 mt-3 font-mono">4.5 hrs</p>
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
                onClick={() => handleDismissOrder()}
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

      {/* ── Request Withdrawal Modal ── */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-base">
                  {isBn ? 'টাকা উত্তোলন (Withdrawal Request)' : 'Request Earnings Withdrawal'}
                </h3>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestWithdrawalSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-300 block mb-1">Select Payment Channel</label>
                <select
                  value={withdrawForm.paymentMethod}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="bKash">bKash (Mobile Personal / Merchant)</option>
                  <option value="Nagad">Nagad (Mobile Banking)</option>
                  <option value="Rocket">Rocket (DBBL Mobile)</option>
                  <option value="Bank">Bank Transfer (Dutch Bangla / City / Brac)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">
                  {withdrawForm.paymentMethod === 'Bank' ? 'Bank Account Number' : 'Mobile Banking Account Number'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={withdrawForm.paymentMethod === 'Bank' ? 'e.g. 148110009988' : 'e.g. 01700000000'}
                  value={withdrawForm.accountNumber}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {withdrawForm.paymentMethod === 'Bank' && (
                <>
                  <div>
                    <label className="text-slate-300 block mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Mahfuzur Rahman"
                      value={withdrawForm.accountName}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, accountName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Bank Name & Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. Dutch Bangla Bank, Uttara Branch"
                      value={withdrawForm.bankName}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-slate-300 block mb-1">Withdrawal Amount (৳)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">৳</span>
                  <input
                    type="number"
                    min="100"
                    required
                    placeholder="Min ৳100"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>Available Balance: <strong className="text-amber-400">৳{formatCurrency(availableBalance > 0 ? availableBalance : (stats?.totalEarnings || 0))}</strong></span>
                  <button
                    type="button"
                    onClick={() => setWithdrawForm({ ...withdrawForm, amount: String(availableBalance > 0 ? availableBalance : (stats?.totalEarnings || 500)) })}
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    Set Max
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Weekly earnings payout"
                  value={withdrawForm.note}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, note: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWithdraw}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  {submittingWithdraw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                  <span>{submittingWithdraw ? 'Submitting...' : 'Submit Withdrawal Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accept Order Confirmation Modal */}
      {confirmOrderToAccept && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Confirm Mission Acceptance
              </h3>
              <button onClick={() => setConfirmOrderToAccept(null)} className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p>Are you sure you want to accept Order <strong className="text-white">#{confirmOrderToAccept.id.slice(-8).toUpperCase()}</strong>?</p>
              <p className="text-slate-400">Once accepted, this mission will be locked to your fleet account.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmOrderToAccept(null)}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
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
