'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/utils/cn';
import { CustomerEmptyState } from '@/components/dashboard/customer/CustomerEmptyState';
import { fetchApi } from '@/lib/api-client';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Truck,
  Wrench,
  Search,
  ChevronRight,
  ShieldCheck,
  Plus,
  Phone,
  UserCheck,
  AlertCircle,
  Check,
  Loader2,
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'TECHNICIAN_ASSIGNED', label: 'Tech Assigned' },
  { key: 'TECHNICIAN_ON_THE_WAY', label: 'On The Way' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'WORK_COMPLETED', label: 'Work Completed' },
  { key: 'CUSTOMER_CONFIRMED', label: 'Done' },
];

export default function UserBookingsPage() {
  const { isBn } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadBookings = () => {
    setLoading(true);
    fetchApi<any>('/bookings')
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setBookings(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setActionLoadingId(bookingId);
    try {
      await fetchApi(`/bookings/${bookingId}/cancel`, { method: 'DELETE' });
      loadBookings();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmCompletion = async (bookingId: string) => {
    setActionLoadingId(bookingId);
    try {
      await fetchApi(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'CUSTOMER_CONFIRMED' }),
      });
      loadBookings();
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesTab = activeTab === 'ALL' || b.status === activeTab;
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.service?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Confirmation
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Confirmed
          </span>
        );
      case 'TECHNICIAN_ASSIGNED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            Technician Assigned
          </span>
        );
      case 'TECHNICIAN_ON_THE_WAY':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 animate-pulse">
            <Truck className="w-3.5 h-3.5 text-indigo-600" />
            Technician On The Way
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-sky-600" />
            Work In Progress
          </span>
        );
      case 'WORK_COMPLETED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Work Completed (Action Needed)
          </span>
        );
      case 'CUSTOMER_CONFIRMED':
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const getStepIndex = (status: string) => {
    if (status === 'COMPLETED') return 6;
    const idx = STATUS_STEPS.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" />
            {isBn ? 'আমার সার্ভিস বুকিং' : 'My Service Bookings'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Managed directly by DOHS Sheba Service Team. Track technician assignment & status live.
          </p>
        </div>

        <Link
          href="/services/home-service"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 w-fit active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{isBn ? 'নতুন সার্ভিস বুক করুন' : 'Book New Service'}</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Bookings' },
              { id: 'PENDING', label: 'Pending' },
              { id: 'TECHNICIAN_ASSIGNED', label: 'Assigned' },
              { id: 'IN_PROGRESS', label: 'In Progress' },
              { id: 'CUSTOMER_CONFIRMED', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search booking ID or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-100 text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 rounded-3xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <CustomerEmptyState
          icon={Wrench}
          title="No Service Bookings Found"
          description="You haven't placed any home service requests yet."
          actionText="Explore Home Services"
          actionHref="/services/home-service"
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const currentStepIdx = getStepIndex(b.status);
            const isCancelled = b.status === 'CANCELLED';

            return (
              <div
                key={b.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-5"
              >
                {/* Top Info Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                        #{b.id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        • {new Date(b.createdAt || b.scheduledAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-900">
                      {b.service?.title || 'Home Maintenance Service'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(b.status)}
                    <span className="text-lg font-black text-slate-900">
                      {formatCurrency(b.totalAmount || b.service?.price || 0)}
                    </span>
                  </div>
                </div>

                {/* Company Provider & Assigned Technician Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Managed By</span>
                    <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>DOHS Sheba Service Team</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Verified DOHS Operations Department</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Assigned Technician</span>
                    {b.technicianName || b.technician?.name ? (
                      <div className="space-y-1">
                        <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                          <UserCheck className="w-4 h-4 text-purple-600" />
                          <span>{b.technicianName || b.technician?.name}</span>
                        </div>
                        {(b.technicianPhone || b.technician?.phone) && (
                          <div className="flex items-center gap-1 text-slate-600 font-bold">
                            <Phone className="w-3.5 h-3.5 text-blue-600" />
                            <span>{b.technicianPhone || b.technician?.phone}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-amber-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Technician will be assigned after confirmation</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Timeline Stepper */}
                {!isCancelled && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step.key} className="flex-1 min-w-[90px] text-center space-y-1.5">
                            <div className="relative flex items-center justify-center">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                  isDone
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                                } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                              >
                                {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                              </div>
                            </div>
                            <span
                              className={`text-[10px] font-extrabold block truncate ${
                                isCurrent
                                  ? 'text-blue-600 font-black'
                                  : isDone
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span className="truncate max-w-xs">{b.address?.line1 || b.notes || 'DOHS Residence'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {['PENDING', 'CONFIRMED'].includes(b.status) && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        disabled={actionLoadingId === b.id}
                        className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 font-bold hover:bg-rose-50 transition-colors flex items-center gap-1"
                      >
                        {actionLoadingId === b.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Cancel Booking</span>
                      </button>
                    )}

                    {b.status === 'WORK_COMPLETED' && (
                      <button
                        onClick={() => handleConfirmCompletion(b.id)}
                        disabled={actionLoadingId === b.id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        {actionLoadingId === b.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Work Done & Rate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
