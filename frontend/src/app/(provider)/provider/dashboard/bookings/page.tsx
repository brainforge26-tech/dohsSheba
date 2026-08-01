'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import {
  Calendar,
  Clock,
  MapPin,
  PhoneCall,
  Check,
  X,
  MessageSquare,
  Wrench,
  CheckCircle2,
  Loader2,
  Search,
  Filter,
} from 'lucide-react';

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([
    {
      id: 'BK-9912',
      service: 'AC Jet Cleaning & Master Servicing',
      customer: 'Lt Col (Retd) Tariq Ahmed',
      phone: '+8801711223344',
      time: 'Today, 03:00 PM',
      location: 'House 42, Road 7, Block C, Mohakhali DOHS',
      price: 1500,
      status: 'PENDING',
    },
    {
      id: 'BK-9915',
      service: 'Master Plumbing & Water Line Repair',
      customer: 'Dr. Shahana Parveen',
      phone: '+8801812998877',
      time: 'Today, 05:30 PM',
      location: 'House 14, Road 3, Baridhara DOHS',
      price: 1200,
      status: 'ACCEPTED',
    },
    {
      id: 'BK-9908',
      service: 'Main DB Box & Circuit Breaker Setup',
      customer: 'Engr. Kamal Hossain',
      phone: '+8801911554433',
      time: 'Tomorrow, 10:00 AM',
      location: 'House 88, Road 11, Mirpur DOHS',
      price: 2200,
      status: 'IN_PROGRESS',
    },
    {
      id: 'BK-9890',
      service: 'Inverter AC Outdoor Unit Gas Refill',
      customer: 'Brig Gen (Retd) Anisur Rahman',
      phone: '+8801700112233',
      time: '29 Jul 2026, 11:00 AM',
      location: 'House 21, Road 4, Mohakhali DOHS',
      price: 3500,
      status: 'COMPLETED',
    },
  ]);

  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApi<any>('/bookings')
      .then((res) => {
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setBookings(res.data);
        }
      })
      .catch(() => null);
  }, []);

  const handleStatusUpdate = async (id: string, nextStatus: string) => {
    setUpdatingId(id);
    try {
      await fetchApi<any>(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      }).catch(() => null);

      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: nextStatus } : b)));
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    if (filter !== 'ALL' && b.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q) ||
        b.customer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" /> Live Service Job Bookings
          </h1>
          <p className="text-xs text-slate-400">Manage all incoming, active, and completed DOHS appointments</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-[#1f2136] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by ID, customer, service…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-2xl bg-[#181928] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-bold">
          {['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                filter === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filtered.map((b) => (
          <div key={b.id} className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-indigo-400 text-sm">#{b.id}</span>
                  <strong className="text-white text-base">{b.service}</strong>
                </div>

                <div className="flex items-center gap-4 text-slate-300">
                  <span>Customer: <strong className="text-white">{b.customer}</strong></span>
                  <a href={`tel:${b.phone}`} className="text-emerald-400 font-bold flex items-center gap-1 hover:underline">
                    <PhoneCall className="w-3.5 h-3.5" /> {b.phone}
                  </a>
                </div>

                <div className="flex items-center gap-4 text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-400" /> {b.time}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-400" /> {b.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Earnings</span>
                  <span className="text-2xl font-black text-emerald-400">৳{formatCurrency(b.price)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard/messages"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                    title="Chat Customer"
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                  </Link>

                  {b.status === 'PENDING' && (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(b.id, 'ACCEPTED')}
                      disabled={updatingId === b.id}
                      className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
                    >
                      {updatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      <span>Accept Booking</span>
                    </button>
                  )}

                  {b.status === 'ACCEPTED' && (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(b.id, 'IN_PROGRESS')}
                      disabled={updatingId === b.id}
                      className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5"
                    >
                      {updatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
                      <span>Start Job</span>
                    </button>
                  )}

                  {b.status === 'IN_PROGRESS' && (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(b.id, 'COMPLETED')}
                      disabled={updatingId === b.id}
                      className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5"
                    >
                      {updatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>Mark Completed</span>
                    </button>
                  )}

                  {b.status === 'COMPLETED' && (
                    <span className="px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
