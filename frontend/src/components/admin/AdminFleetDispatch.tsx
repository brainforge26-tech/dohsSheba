'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import { useSocket } from '@/hooks/useSocket';
import { formatCurrency } from '@/utils/cn';
import { MapLibreTracker } from '@/components/map/MapLibreTracker';
import {
  Bike,
  Navigation,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Store,
  Users,
  Radio,
  Activity,
  AlertTriangle,
  Loader2,
  RefreshCw,
  UserCheck,
  UserX,
} from 'lucide-react';

export function AdminFleetDispatch() {
  const { socket } = useSocket();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedRider, setSelectedRider] = useState<any>(null);
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);
  const [targetRiderId, setTargetRiderId] = useState<string>('');
  const [assignLoading, setAssignLoading] = useState(false);

  const loadFleetData = async () => {
    try {
      const res = await fetchApi<any>('/admin/fleet').catch(() => null);
      if (res?.success && res.data) {
        setData(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFleetData();
  }, []);

  // Real-Time Socket Sync for Fleet
  useEffect(() => {
    if (!socket) return;

    socket.emit('join_admin_fleet');

    const handleUpdate = () => {
      loadFleetData();
    };

    socket.on('RIDER_LOCATION_UPDATED', handleUpdate);
    socket.on('ORDER_STATUS_UPDATED', handleUpdate);

    return () => {
      socket.off('RIDER_LOCATION_UPDATED', handleUpdate);
      socket.off('ORDER_STATUS_UPDATED', handleUpdate);
    };
  }, [socket]);

  // Manual Rider Assignment
  const handleAssignRider = async (orderId: string) => {
    if (!targetRiderId) return;
    setAssignLoading(true);
    try {
      const res = await fetchApi<any>(`/admin/orders/${orderId}/assign-rider`, {
        method: 'POST',
        body: JSON.stringify({ riderId: targetRiderId }),
      });
      if (res?.success) {
        setAssigningOrderId(null);
        setTargetRiderId('');
        loadFleetData();
      }
    } finally {
      setAssignLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalRiders: 0,
    onlineRiders: 0,
    busyRiders: 0,
    availableRiders: 0,
    offlineRiders: 0,
    activeDeliveries: 0,
  };

  const riders = data?.riders || [];
  const activeOrders = data?.activeOrders || [];

  return (
    <div className="space-y-6">
      {/* ── Fleet Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            <span>Admin Fleet Dispatch & Live Command Center</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time OpenStreetMap tracking & automated dispatch management
          </p>
        </div>

        <button
          type="button"
          onClick={loadFleetData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/10 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Fleet
        </button>
      </div>

      {/* ── Metrics Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-3xl bg-[#1f2136] border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Total Riders</span>
          <span className="text-2xl font-black text-white">{stats.totalRiders}</span>
        </div>
        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">Online Fleet</span>
          <span className="text-2xl font-black text-emerald-400">{stats.onlineRiders}</span>
        </div>
        <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 space-y-1">
          <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wider block">Available</span>
          <span className="text-2xl font-black text-cyan-400">{stats.availableRiders}</span>
        </div>
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-1">
          <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">Busy on Mission</span>
          <span className="text-2xl font-black text-amber-400">{stats.busyRiders}</span>
        </div>
        <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-1">
          <span className="text-[10px] text-rose-400 font-extrabold uppercase tracking-wider block">Offline</span>
          <span className="text-2xl font-black text-rose-400">{stats.offlineRiders}</span>
        </div>
        <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 space-y-1">
          <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider block">Active Deliveries</span>
          <span className="text-2xl font-black text-indigo-400">{stats.activeDeliveries}</span>
        </div>
      </div>

      {/* ── Multi-Rider Live Map ── */}
      <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" /> Live Fleet OpenStreetMap
        </h2>

        <MapLibreTracker
          riderLocation={
            selectedRider?.riderProfile?.currentLatitude
              ? {
                  lat: selectedRider.riderProfile.currentLatitude,
                  lng: selectedRider.riderProfile.currentLongitude,
                  heading: selectedRider.riderProfile.heading || 0,
                  speed: selectedRider.riderProfile.speed || 0,
                }
              : null
          }
          height="450px"
        />
      </div>

      {/* ── Fleet List & Dispatch Queue Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Riders Roster */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" /> Rider Fleet Roster ({riders.length})
          </h2>

          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
            {riders.map((r: any) => {
              const prof = r.riderProfile;
              const isOnline = prof?.isOnline;
              const isAvailable = prof?.isAvailable;

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRider(r)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedRider?.id === r.id
                      ? 'bg-indigo-600/20 border-indigo-500'
                      : 'bg-[#181928] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{r.name}</p>
                      <p className="text-[11px] text-slate-400">{r.phone || '01306031982'}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    {isOnline ? (
                      isAvailable ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Available
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          On Mission
                        </span>
                      )
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        Offline
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Dispatch Queue */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Active Dispatch Queue ({activeOrders.length})
          </h2>

          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
            {activeOrders.map((o: any) => (
              <div key={o.id} className="p-4 rounded-2xl bg-[#181928] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-indigo-400">Order #{o.id.slice(-8).toUpperCase()}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                    {o.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p>Customer: <strong>{o.customer?.name}</strong></p>
                  <p>Assigned Rider: <strong className="text-emerald-400">{o.rider?.name || 'Unassigned'}</strong></p>
                </div>

                {!o.riderId && (
                  <div className="pt-2 flex items-center gap-2">
                    <select
                      value={targetRiderId}
                      onChange={(e) => setTargetRiderId(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#1f2136] border border-white/10 text-white text-xs"
                    >
                      <option value="">Select Rider to Assign…</option>
                      {riders.filter((r: any) => r.riderProfile?.isOnline).map((r: any) => (
                        <option key={r.id} value={r.id}>{r.name} ({r.phone})</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleAssignRider(o.id)}
                      disabled={assignLoading || !targetRiderId}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl disabled:opacity-50"
                    >
                      Assign
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
