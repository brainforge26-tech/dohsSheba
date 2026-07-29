'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/utils/cn';
import { CustomerEmptyState } from '@/components/dashboard/customer/CustomerEmptyState';
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
  FileText,
} from 'lucide-react';

const INITIAL_BOOKINGS = [
  {
    id: 'DOHS-BS-8891',
    serviceTitle: 'AC Jet Cleaning & Master Servicing',
    category: 'AC & Appliance Repair',
    provider: 'Apex Climate Care Ltd.',
    providerPhone: '+880 1711-223344',
    date: '29 Jul 2026',
    time: '3:00 PM - 5:00 PM',
    status: 'EN_ROUTE',
    price: 1200,
    address: 'House 42, Road 7, DOHS Mohakhali, Dhaka',
    technician: 'Kamrul Hasan (Senior AC Specialist)',
  },
  {
    id: 'DOHS-BS-7740',
    serviceTitle: 'Full House Deep Cleaning Package',
    category: 'Home Cleaning',
    provider: 'ShineSheba Cleaning Pros',
    providerPhone: '+880 1722-556677',
    date: '24 Jul 2026',
    time: '10:00 AM - 3:00 PM',
    status: 'COMPLETED',
    price: 4500,
    address: 'House 42, Road 7, DOHS Mohakhali, Dhaka',
    technician: 'Team ShineSheba (4 Cleaners)',
  },
  {
    id: 'DOHS-BS-6612',
    serviceTitle: 'Plumbing Leakage & Pipe Repair',
    category: 'Plumbing & Sanitary',
    provider: 'DOHS Expert Plumbers',
    providerPhone: '+880 1833-889900',
    date: '18 Jul 2026',
    time: '11:00 AM - 1:00 PM',
    status: 'COMPLETED',
    price: 850,
    address: 'House 42, Road 7, DOHS Mohakhali, Dhaka',
    technician: 'Rafiqul Islam',
  },
  {
    id: 'DOHS-BS-5501',
    serviceTitle: 'Electrical Short-Circuit Inspection',
    category: 'Electrician Services',
    provider: 'SafeVolt Electrical BD',
    providerPhone: '+880 1944-112233',
    date: '10 Jul 2026',
    time: '4:00 PM - 6:00 PM',
    status: 'CANCELLED',
    price: 500,
    address: 'House 42, Road 7, DOHS Mohakhali, Dhaka',
    technician: 'N/A',
  },
];

import { fetchApi } from '@/lib/api-client';

export default function UserBookingsPage() {
  const { isBn } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [bookings, setBookings] = useState<any[]>(INITIAL_BOOKINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchApi<any[]>('/bookings')
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((b: any) => ({
            id: `#BKG-${b.id.slice(0, 6).toUpperCase()}`,
            serviceTitle: b.service?.title || 'Home Service',
            category: b.service?.category?.name || 'General Service',
            provider: b.providerProfile?.companyName || 'DOHS Service Pro',
            providerPhone: b.providerProfile?.phone || '+880 1700-000000',
            date: new Date(b.bookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: b.slot || 'Flexible Time',
            status: b.status,
            price: b.totalAmount || b.service?.price || 0,
            address: b.address || 'DOHS Resident Location',
            technician: b.providerProfile?.name || 'Assigned Technician',
          }));
          setBookings(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesTab = activeTab === 'ALL' || b.status === activeTab;
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'EN_ROUTE':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5 animate-pulse">
            <Truck className="w-3.5 h-3.5" />
            {isBn ? 'টেকনিশিয়ান আসছে' : 'Technician En Route'}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isBn ? 'সম্পন্ন হয়েছে' : 'Completed'}
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {isBn ? 'নির্ধারিত' : 'Scheduled'}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            {isBn ? 'বাতিল' : 'Cancelled'}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-400" />
            {isBn ? 'আমার সার্ভিস বুকিং' : 'My Service Bookings'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isBn
              ? 'আপনার হোম সার্ভিস বুকিংয়ের লাইভ স্ট্যাটাস ট্র্যাক করুন ও রসিদ দেখুন'
              : 'Track live status, scheduled technician arrival, and receipt details'}
          </p>
        </div>

        <Link
          href="/services"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2 w-fit active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{isBn ? 'নতুন সার্ভিস বুক করুন' : 'Book New Service'}</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: isBn ? 'সব বুকিং' : 'All Bookings' },
              { id: 'EN_ROUTE', label: isBn ? 'চলমান' : 'En Route / Active' },
              { id: 'COMPLETED', label: isBn ? 'সম্পন্ন' : 'Completed' },
              { id: 'CANCELLED', label: isBn ? 'বাতিল' : 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isBn ? 'খুঁজুন ID বা সার্ভিস...' : 'Search booking ID or service...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <CustomerEmptyState
          icon={Wrench}
          title={isBn ? 'কোনো সার্ভিস বুকিং পাওয়া যায়নি' : 'No Service Bookings Found'}
          description={
            isBn
              ? 'আপনার নির্বাচিত ফিল্টারে কোনো বুকিং নেই। প্রয়োজনে নতুন সার্ভিস বুক করুন।'
              : 'You do not have any active or completed service bookings matching this filter.'
          }
          actionText={isBn ? 'সার্ভিস মার্কেটপ্লেস দেখুন' : 'Explore Home Services'}
          actionHref="/services"
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((bk) => (
            <div
              key={bk.id}
              className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-4 hover:border-indigo-500/30 transition-all shadow-xl"
            >
              {/* Card Top */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    #{bk.id}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {isBn ? 'বুক করার তারিখ:' : 'Booked on:'} <span className="text-slate-300 font-bold">{bk.date}</span>
                  </span>
                </div>
                {getStatusBadge(bk.status)}
              </div>

              {/* Main Content */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="space-y-2 min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-md">
                    {bk.category}
                  </span>
                  <h3 className="font-bold text-base text-white">{bk.serviceTitle}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{bk.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{bk.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
                    <span className="text-slate-400">{isBn ? 'প্রোভাইডার:' : 'Provider:'}</span>
                    <span className="font-bold text-white">{bk.provider}</span>
                    {bk.technician !== 'N/A' && (
                      <span className="text-slate-400 font-normal">({bk.technician})</span>
                    )}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5 gap-3">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {isBn ? 'মোট সেবা ফি' : 'Total Service Fee'}
                    </span>
                    <span className="text-xl font-black text-emerald-400">
                      ৳{formatCurrency(bk.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${bk.providerPhone}`}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                      title={isBn ? 'প্রোভাইডারকে কল করুন' : 'Call Provider'}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <Link
                      href={`/dashboard/orders/track?id=${bk.id}`}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                    >
                      <span>{isBn ? 'ট্র্যাক করুন' : 'Track Status'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
