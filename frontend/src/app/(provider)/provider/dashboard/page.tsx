'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { useAuthStore } from '@/store/useAuthStore';
import { formatCurrency } from '@/utils/cn';
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Calendar,
  UserCheck,
  Loader2,
  RefreshCw,
  PhoneCall,
  XCircle,
  Clock,
  User,
  X,
  CheckCircle2,
  Phone,
} from 'lucide-react';

import { useSearchParams } from 'next/navigation';

export default function ServiceOperationsDashboard() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');

  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'>('ALL');

  useEffect(() => {
    if (statusParam) {
      setFilterTab(statusParam.toUpperCase() as any);
    }
  }, [statusParam]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [bookings, setBookings] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<any | null>(null);
  const [selectedTechId, setSelectedTechId] = useState<string>('');
  const [customTechName, setCustomTechName] = useState<string>('');
  const [customTechPhone, setCustomTechPhone] = useState<string>('');
  const [assigning, setAssigning] = useState<boolean>(false);

  // Customer Contact Modal
  const [contactModalBooking, setContactModalBooking] = useState<any | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, statsRes, techRes] = await Promise.all([
        fetchApi<any>('/bookings').catch(() => null),
        fetchApi<any>('/bookings/provider/stats').catch(() => null),
        fetchApi<any>('/technicians/active').catch(() => null),
      ]);

      if (bookingsRes?.success) {
        if (Array.isArray(bookingsRes.data)) {
          setBookings(bookingsRes.data);
        } else if (Array.isArray(bookingsRes.data?.bookings)) {
          setBookings(bookingsRes.data.bookings);
        }
      }

      if (statsRes?.success && statsRes.data) {
        setStats(statsRes.data);
      }

      if (techRes?.success && Array.isArray(techRes.data) && techRes.data.length > 0) {
        setTechnicians(techRes.data);
      } else {
        // Default roster fallback
        setTechnicians([
          { id: 't1', name: 'Rakib Ahmed', phone: '+880 1711-223344', specialty: 'Electrical & AC' },
          { id: 't2', name: 'Hasan Mahmud', phone: '+880 1722-556677', specialty: 'Plumbing & Sanitary' },
          { id: 't3', name: 'Mahmudul Islam', phone: '+880 1733-889900', specialty: 'Appliance Repair' },
          { id: 't4', name: 'Sabbir Hossain', phone: '+880 1744-112233', specialty: 'General Handyman' },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const [stats, setStats] = useState({
    todayEarnings: 0,
    totalJobsCompleted: 0,
    rating: 4.9,
    pendingCount: 0,
    activeCount: 0,
    assignedCount: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleStatusUpdate = async (bookingId: string, nextStatus: string) => {
    setUpdatingId(bookingId);
    try {
      const res = await fetchApi<any>(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      }).catch(() => null);

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: nextStatus } : b))
      );
      loadDashboardData();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssignTechnicianSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForAssign) return;

    setAssigning(true);
    try {
      let techObj = technicians.find((t) => t.id === selectedTechId);

      const res = await fetchApi<any>(`/bookings/${selectedBookingForAssign.id}/assign-technician`, {
        method: 'PATCH',
        body: JSON.stringify({
          technicianId: techObj ? techObj.id : undefined,
          technicianName: techObj ? techObj.name : customTechName,
          technicianPhone: techObj ? techObj.phone : customTechPhone,
        }),
      }).catch(() => null);

      if (res?.success) {
        setSelectedBookingForAssign(null);
        setSelectedTechId('');
        setCustomTechName('');
        setCustomTechPhone('');
        loadDashboardData();
      }
    } finally {
      setAssigning(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'ALL') return true;
    if (filterTab === 'ASSIGNED') return b.status === 'TECHNICIAN_ASSIGNED' || b.status === 'TECHNICIAN_ON_THE_WAY';
    if (filterTab === 'COMPLETED') return b.status === 'WORK_COMPLETED' || b.status === 'CUSTOMER_CONFIRMED' || b.status === 'COMPLETED';
    return b.status === filterTab;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 border border-blue-500/20 shadow-xl text-white space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-2xl shadow-md border border-blue-400/30 shrink-0">
              🛡️
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-white">
                  DOHS Sheba Service Operations Control
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Service Manager Portal
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-1">
                Centralized control panel. Review incoming bookings, contact customers, accept/reject requests, and assign technicians.
              </p>
            </div>
          </div>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-blue-200/70 font-semibold">New Requests</span>
            <div className="text-2xl font-black text-amber-400">{stats.pendingCount}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-blue-200/70 font-semibold">Active Jobs</span>
            <div className="text-2xl font-black text-blue-400">{stats.activeCount}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-blue-200/70 font-semibold">Jobs Completed</span>
            <div className="text-2xl font-black text-emerald-400">{stats.totalJobsCompleted}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-blue-200/70 font-semibold">Total Revenue</span>
            <div className="text-2xl font-black text-white">{formatCurrency(stats.totalEarnings)}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          {[
            { id: 'ALL', label: 'All Requests' },
            { id: 'PENDING', label: 'New Requests' },
            { id: 'CONFIRMED', label: 'Confirmed Jobs' },
            { id: 'ASSIGNED', label: 'Assigned Jobs' },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'COMPLETED', label: 'Completed Jobs' },
            { id: 'CANCELLED', label: 'Cancelled Jobs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                filterTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Queue */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-200 rounded-3xl bg-white space-y-2">
            <Wrench className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="font-extrabold text-lg text-slate-800">No Service Requests Found</p>
            <p className="text-xs text-slate-500">There are no bookings matching this status filter.</p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                      #{b.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-700 font-bold flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      {b.customer?.name || 'Resident Customer'} ({b.customer?.phone || 'No Phone'})
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                    {b.service?.title || 'Home Maintenance Service'}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    Status: {b.status}
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    {formatCurrency(b.totalAmount || b.service?.price || 0)}
                  </span>
                </div>
              </div>

              {/* Details & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Customer Information & Location</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{b.address?.line1 || b.notes || 'Mohakhali DOHS Residence'}</span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Requested Schedule: {new Date(b.scheduledAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Assigned Internal Technician</span>
                  {b.technicianName || b.technician?.name ? (
                    <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 font-bold flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-purple-600" />
                        <span>{b.technicianName || b.technician?.name}</span>
                      </div>
                      <span className="text-[11px] text-purple-700 font-medium">
                        {b.technicianPhone || b.technician?.phone}
                      </span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold flex items-center justify-between">
                      <span>No technician assigned yet</span>
                      <button
                        onClick={() => {
                          setSelectedBookingForAssign(b);
                          setSelectedTechId(technicians[0]?.id || '');
                        }}
                        className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-xs"
                      >
                        Assign Now
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setContactModalBooking(b)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 border border-slate-200"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                    <span>Contact Customer</span>
                  </button>

                  {b.notes && <span className="text-slate-500 text-[11px]">"{b.notes}"</span>}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {b.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(b.id, 'CONFIRMED')}
                        disabled={updatingId === b.id}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-xs flex items-center gap-1.5"
                      >
                        {updatingId === b.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Accept Request</span>
                      </button>

                      <button
                        onClick={() => handleStatusUpdate(b.id, 'CANCELLED')}
                        disabled={updatingId === b.id}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {['PENDING', 'CONFIRMED'].includes(b.status) && (
                    <button
                      onClick={() => {
                        setSelectedBookingForAssign(b);
                        setSelectedTechId(technicians[0]?.id || '');
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Assign Technician</span>
                    </button>
                  )}

                  {b.status === 'TECHNICIAN_ASSIGNED' && (
                    <button
                      onClick={() => handleStatusUpdate(b.id, 'TECHNICIAN_ON_THE_WAY')}
                      disabled={updatingId === b.id}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs flex items-center gap-1.5"
                    >
                      {updatingId === b.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Mark Tech On The Way</span>
                    </button>
                  )}

                  {b.status === 'TECHNICIAN_ON_THE_WAY' && (
                    <button
                      onClick={() => handleStatusUpdate(b.id, 'IN_PROGRESS')}
                      disabled={updatingId === b.id}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-xs flex items-center gap-1.5"
                    >
                      {updatingId === b.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Mark Work In Progress</span>
                    </button>
                  )}

                  {b.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleStatusUpdate(b.id, 'WORK_COMPLETED')}
                      disabled={updatingId === b.id}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-1.5"
                    >
                      {updatingId === b.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Mark Work Completed</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual Technician Assignment Modal */}
      {selectedBookingForAssign && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                <h3 className="font-extrabold text-base text-slate-900">Assign Technician from Roster</h3>
              </div>
              <button
                onClick={() => setSelectedBookingForAssign(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50 text-blue-900 text-xs border border-blue-200 space-y-1">
              <div className="font-bold">Booking #{selectedBookingForAssign.id.slice(-8).toUpperCase()}</div>
              <div>{selectedBookingForAssign.service?.title}</div>
            </div>

            <form onSubmit={handleAssignTechnicianSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1">Select Technician Created By Admin</label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Custom Technician Below --</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.specialty || 'General'}) - {t.phone}
                    </option>
                  ))}
                </select>
              </div>

              {!selectedTechId && (
                <div className="space-y-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block text-slate-600 mb-1">Technician Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rakib Hassan"
                      value={customTechName}
                      onChange={(e) => setCustomTechName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white"
                      required={!selectedTechId}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +880 1711-000000"
                      value={customTechPhone}
                      onChange={(e) => setCustomTechPhone(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white"
                      required={!selectedTechId}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForAssign(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-md flex items-center gap-1.5"
                >
                  {assigning && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Confirm Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Contact Modal */}
      {contactModalBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">Customer Details</h3>
              </div>
              <button
                onClick={() => setContactModalBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-400 uppercase text-[10px] font-bold">Resident Name</div>
                <div className="text-slate-900 text-sm font-black">{contactModalBooking.customer?.name || 'Resident Customer'}</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-400 uppercase text-[10px] font-bold">Contact Phone</div>
                <div className="text-blue-600 text-sm font-black">{contactModalBooking.customer?.phone || 'No phone provided'}</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-400 uppercase text-[10px] font-bold">Location Address</div>
                <div className="text-slate-800 font-medium">{contactModalBooking.address?.line1 || contactModalBooking.notes || 'DOHS Residence'}</div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`tel:${contactModalBooking.customer?.phone || ''}`}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Resident Directly</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
