'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { useSocket } from '@/hooks/useSocket';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  Truck, Radio, AlertTriangle, CheckCircle2, Clock, Users, UserCheck,
  UserX, Search, RefreshCw, ShieldAlert, Loader2, Send, Check
} from 'lucide-react';

export default function AdminDispatchQueuePage() {
  const { language } = useLanguageStore();
  const { socket } = useSocket();
  const isBn = language === 'BN';

  const [data, setData] = useState<any>({
    pendingDispatch: [],
    manualAssignmentRequired: [],
    activeDeliveries: [],
    riders: [],
  });
  const [loading, setLoading] = useState(true);

  // Manual assignment modal state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [assigningRiderId, setAssigningRiderId] = useState<string>('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const loadDispatchData = useCallback(async () => {
    try {
      const res = await fetchApi<any>('/admin/dispatch-queue').catch(() => null);
      if (res?.success && res.data) {
        setData(res.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDispatchData();
  }, [loadDispatchData]);

  // Socket real-time synchronization
  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => loadDispatchData();

    socket.on('MANUAL_ASSIGNMENT_REQUIRED', handleRefresh);
    socket.on('RIDER_ORDER_BROADCAST', handleRefresh);
    socket.on('RIDER_ORDER_ACCEPTED', handleRefresh);
    socket.on('RIDER_ORDER_DISMISS', handleRefresh);
    socket.on('ORDER_STATUS_UPDATED', handleRefresh);

    return () => {
      socket.off('MANUAL_ASSIGNMENT_REQUIRED', handleRefresh);
      socket.off('RIDER_ORDER_BROADCAST', handleRefresh);
      socket.off('RIDER_ORDER_ACCEPTED', handleRefresh);
      socket.off('RIDER_ORDER_DISMISS', handleRefresh);
      socket.off('ORDER_STATUS_UPDATED', handleRefresh);
    };
  }, [socket, loadDispatchData]);

  const handleManualAssign = async () => {
    if (!selectedOrder || !assigningRiderId) return;
    setAssignLoading(true);
    setMsg('');
    try {
      const res = await fetchApi<any>(`/admin/orders/${selectedOrder.id}/assign-rider`, {
        method: 'POST',
        body: JSON.stringify({ riderId: assigningRiderId }),
      });
      if (res?.success) {
        setMsg(isBn ? 'রাইডার সফলভাবে অ্যাসাইন করা হয়েছে!' : 'Rider assigned successfully!');
        setSelectedOrder(null);
        setAssigningRiderId('');
        loadDispatchData();
      } else {
        setMsg(res?.message || 'Failed to assign rider');
      }
    } catch (e: any) {
      setMsg(e.message || 'Error occurred');
    } finally {
      setAssignLoading(false);
    }
  };

  const onlineRiders  = data.riders.filter((r: any) => r.riderProfile?.isOnline);
  const availableRiders = data.riders.filter((r: any) => r.riderProfile?.isOnline && r.riderProfile?.isAvailable);
  const busyRiders      = data.riders.filter((r: any) => r.riderProfile?.isOnline && !r.riderProfile?.isAvailable);
  const offlineRiders   = data.riders.filter((r: any) => !r.riderProfile?.isOnline);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Radio className="w-7 h-7 text-amber-400 animate-pulse" />
            {isBn ? 'রিয়েল-টাইম রাইডার ডিসপ্যাচ কমান্ড সেন্টার' : 'Real-time Rider Dispatch Command Center'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isBn ? 'ফুডপান্ডা স্টাইল রিয়েল-টাইম অটোমেটিক ডিসপ্যাচ ও ম্যানুয়াল ফলব্যাক কিউ' : 'Foodpanda-style Automatic Rider Dispatch & Manual Fallback Queue'}
          </p>
        </div>

        <button
          onClick={loadDispatchData}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> {isBn ? 'রিফ্রেশ' : 'Refresh Queue'}
        </button>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Fleet Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>{isBn ? 'অনলাইন রাইডার' : 'Online Fleet'}</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{onlineRiders.length}</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>{isBn ? 'ফ্রি / এভেইলএবল' : 'Available Riders'}</span>
            <UserCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-cyan-400 mt-2">{availableRiders.length}</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>{isBn ? 'ব্যস্ত / অন ট্রিপ' : 'Busy / On Mission'}</span>
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400 mt-2">{busyRiders.length}</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>{isBn ? 'অফলাইন রাইডার' : 'Offline Fleet'}</span>
            <UserX className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-400 mt-2">{offlineRiders.length}</p>
        </div>
      </div>

      {/* Manual Assignment Alert Section */}
      {data.manualAssignmentRequired?.length > 0 && (
        <div className="bg-rose-950/40 border-2 border-rose-500/80 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-rose-400 font-extrabold text-lg">
              <ShieldAlert className="w-6 h-6 animate-bounce text-rose-400" />
              <span>
                {isBn ? 'ম্যানুয়াল অ্যাসাইনমেন্ট প্রয়োজন (৩০ সেকেন্ড টাইমআউট)' : 'MANUAL ASSIGNMENT REQUIRED (30s Timeout Expired)'}
              </span>
            </div>
            <span className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-bold border border-rose-500/40">
              {data.manualAssignmentRequired.length} Orders
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.manualAssignmentRequired.map((order: any) => (
              <div key={order.id} className="bg-slate-900/80 p-4 rounded-2xl border border-rose-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-base">Order #{order.id.slice(-8).toUpperCase()}</span>
                  <span className="text-xs text-rose-400 font-bold bg-rose-500/20 px-2.5 py-1 rounded-full">TIMEOUT EXPIRED</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p><strong className="text-slate-400">Customer:</strong> {order.customer?.name} ({order.customer?.phone || 'N/A'})</p>
                  <p><strong className="text-slate-400">Address:</strong> {order.address?.line1}, {order.address?.area}</p>
                  <p><strong className="text-slate-400">Amount:</strong> {formatCurrency(order.totalAmount)}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  {isBn ? 'ম্যানুয়ালি রাইডার অ্যাসাইন করুন' : 'Assign Available Rider Manually'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Broadcast Dispatching Queue */}
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Radio className="w-5 h-5 text-cyan-400" />
          {isBn ? 'লাইভ অটো-ডিসপ্যাচ ব্রডকাস্ট কিউ' : 'Live Auto-Dispatch Broadcast Queue (Active 30s Broadcast)'}
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300">
            {data.pendingDispatch?.length || 0}
          </span>
        </h2>

        {data.pendingDispatch?.length === 0 ? (
          <p className="text-slate-400 text-sm py-4">{isBn ? 'বর্তমানে কোনো ব্রডকাস্ট পেন্ডিং অর্ডার নেই' : 'No active dispatch broadcast at this moment.'}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.pendingDispatch.map((order: any) => (
              <div key={order.id} className="bg-slate-900/60 p-4 rounded-2xl border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Order #{order.id.slice(-8).toUpperCase()}</span>
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-md text-[11px] font-bold">READY FOR RIDER</span>
                </div>
                <p className="text-xs text-slate-300">{order.customer?.name} • {order.address?.line1}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <span className="text-emerald-400 font-bold">{formatCurrency(order.totalAmount)}</span>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    Force Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Assign Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">
              Manual Rider Assignment (Order #{selectedOrder.id.slice(-8).toUpperCase()})
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <p>Select an online available rider to assign this mission instantly:</p>
            </div>

            <select
              value={assigningRiderId}
              onChange={(e) => setAssigningRiderId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-amber-400"
            >
              <option value="">-- Choose Rider --</option>
              {onlineRiders.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.phone || 'No Phone'}) {r.riderProfile?.isAvailable ? '🟢 Available' : '🔴 Busy'}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleManualAssign}
                disabled={!assigningRiderId || assignLoading}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm flex items-center gap-2"
              >
                {assignLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
