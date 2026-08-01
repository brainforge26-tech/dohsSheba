'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { useAuthStore } from '@/store/useAuthStore';
import { formatCurrency } from '@/utils/cn';
import {
  Wrench,
  DollarSign,
  CheckCircle2,
  Clock,
  Star,
  MapPin,
  Check,
  X,
  PhoneCall,
  Calendar,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Activity,
  User,
  Radio,
  Loader2,
  RefreshCw,
  Zap,
  ArrowUpRight,
  Filter,
  Layers,
} from 'lucide-react';

export default function ProviderDashboardOverview() {
  const { user } = useAuthStore();

  // ── States ──────────────────────────────────────────────────────────────────
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    totalJobsCompleted: 0,
    rating: 4.9,
    pendingCount: 0,
    activeCount: 0,
    totalEarnings: 0,
  });

  // Load Real Dynamic Data from Backend API
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        fetchApi<any>('/bookings').catch(() => null),
        fetchApi<any>('/bookings/provider/stats').catch(() => null),
      ]);

      if (bookingsRes?.success && Array.isArray(bookingsRes.data)) {
        setBookings(bookingsRes.data);
      }

      if (statsRes?.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle Status Update
  const handleStatusUpdate = async (bookingId: string, nextStatus: string) => {
    setUpdatingId(bookingId);
    try {
      const res = await fetchApi<any>(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      }).catch(() => null);

      if (res?.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: nextStatus } : b))
        );
        loadDashboardData();
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered List
  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'ALL') return true;
    return b.status === filterTab;
  });

  return (
    <div className="space-y-6">
      {/* ── Top Partner Control Banner ── */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#1c1d36] via-[#1a1b32] to-[#161729] border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-0.5 shadow-xl shrink-0">
              <div className="w-full h-full rounded-2xl bg-[#181928] flex items-center justify-center font-black text-white text-xl">
                {user?.name?.[0] || 'P'}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-white">
                  {user?.name || 'Apex Climate Care Ltd.'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> VERIFIED DOHS PROVIDER
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                HVAC, AC Master Jet Wash, Electrical & Plumbing Specialist · Avg Response: <strong className="text-emerald-400">&lt; 12 Mins</strong>
              </p>
            </div>
          </div>

          {/* Duty Switch & Wallet Quick Actions */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300">Duty Status:</span>
              <button
                type="button"
                onClick={() => setIsOnline(!isOnline)}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isOnline ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isOnline ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-xs font-black font-mono ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            <Link
              href="/provider/dashboard/finance"
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4" /> Wallet Payout
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Analytics Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Today's Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">৳{formatCurrency(stats.todayEarnings)}</div>
          <div className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% growth vs yesterday
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Completed Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.totalJobsCompleted} Jobs</div>
          <div className="text-[10px] text-slate-400 font-bold">99.4% On-time Completion</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Customer Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{stats.rating} ★</div>
          <div className="text-[10px] text-slate-400 font-bold">From 284 Verified Reviews</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Requests</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400">{stats.pendingCount} Pending</div>
          <div className="text-[10px] text-indigo-300 font-extrabold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" /> Action Required
          </div>
        </div>
      </div>

      {/* ── Live Booking Requests Center ── */}
      <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="font-black text-white text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
              Incoming DOHS Service Requests
            </h2>
            <p className="text-xs text-slate-400">Real-time service orders placed by verified DOHS residents</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#181928] border border-white/5 text-xs font-bold">
            {(['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterTab === tab
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-600 opacity-40" />
              <p className="text-sm font-bold">No booking requests found for selected filter.</p>
            </div>
          ) : (
            filteredBookings.map((b) => {
              const serviceTitle = typeof b.service === 'object' ? b.service?.title : (b.service || 'Home Service');
              const customerName = typeof b.customer === 'object' ? (b.customer?.name || b.customer?.email) : (b.customer || 'Resident Customer');
              const customerPhone = typeof b.customer === 'object' ? (b.customer?.phone || '01711223344') : (b.phone || '01711223344');
              const locationText = b.address
                ? `${b.address.line1}, ${b.address.area || 'DOHS'}, ${b.address.city || 'Dhaka'}`
                : (b.location || 'DOHS Area');
              const bookingTime = b.scheduledAt
                ? new Date(b.scheduledAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                : (b.time || 'Today, 03:00 PM');
              const priceVal = b.totalAmount || b.price || b.service?.price || 0;
              const isPending = b.status === 'PENDING';
              const isConfirmed = b.status === 'CONFIRMED' || b.status === 'ACCEPTED';
              const isInProgress = b.status === 'IN_PROGRESS';
              const isCompleted = b.status === 'COMPLETED';

              return (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-[#181928] border border-white/5 hover:border-white/20 transition-all space-y-4 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-indigo-400">#{b.id.slice(-6)}</span>
                        <strong className="text-white text-sm">{serviceTitle}</strong>
                        {b.urgency === 'EXPRESS' && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            ⚡ EXPRESS EMERGENCY
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-slate-300 text-xs">
                        <span>Customer: <strong className="text-white">{customerName}</strong></span>
                        <a href={`tel:${customerPhone}`} className="flex items-center gap-1 text-emerald-400 font-bold hover:underline">
                          <PhoneCall className="w-3.5 h-3.5" /> {customerPhone}
                        </a>
                      </div>

                      <div className="flex items-center gap-4 text-slate-400 text-xs pt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {bookingTime}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" /> {locationText}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Service Value</span>
                        <span className="text-xl font-black text-emerald-400">৳{formatCurrency(priceVal)}</span>
                      </div>

                      {/* Action Triggers */}
                      <div className="flex items-center gap-2">
                        <Link
                          href="/dashboard/messages"
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                          title="Chat Customer"
                        >
                          <MessageSquare className="w-4 h-4 text-indigo-400" />
                        </Link>

                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(b.id, 'REJECTED')}
                              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                              title="Decline Request"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(b.id, 'CONFIRMED')}
                              disabled={updatingId === b.id}
                              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
                            >
                              {updatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                              <span>Accept Job</span>
                            </button>
                          </>
                        )}

                        {isConfirmed && (
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(b.id, 'IN_PROGRESS')}
                            disabled={updatingId === b.id}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5"
                          >
                            {updatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
                            <span>Start Job</span>
                          </button>
                        )}

                        {isInProgress && (
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(b.id, 'COMPLETED')}
                            disabled={updatingId === b.id}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5"
                          >
                            {updatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            <span>Mark Completed</span>
                          </button>
                        )}

                        {isCompleted && (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── DOHS Service Coverage Map & Ratings Summary ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DOHS Coverage Zones */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" /> Active DOHS Service Radius
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
              <span className="font-bold text-white">Mohakhali DOHS</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300">ACTIVE</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
              <span className="font-bold text-white">Baridhara DOHS</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300">ACTIVE</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
              <span className="font-bold text-white">Mirpur DOHS</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300">ACTIVE</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
              <span className="font-bold text-white">Savar DOHS</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Verified Customer Reviews Summary */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Customer Satisfaction Rating
          </h2>
          <div className="flex items-center gap-6">
            <div className="text-center shrink-0">
              <div className="text-4xl font-black text-amber-400">4.9</div>
              <div className="text-xs text-amber-300">★★★★★</div>
              <div className="text-[10px] text-slate-400 mt-1">284 Ratings</div>
            </div>

            <div className="flex-1 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-12 text-slate-400 text-[10px]">5 Stars</span>
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400 w-[92%]" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold">92%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-slate-400 text-[10px]">4 Stars</span>
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400 w-[6%]" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold">6%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
