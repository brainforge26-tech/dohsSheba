'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { useOrderStore } from '@/store/useOrderStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency } from '@/utils/cn';
import {
  Calendar, ShoppingBag, MapPin, Award, ArrowRight, Clock,
  CheckCircle2, Zap, Loader2, ShoppingCart, Heart, RefreshCw,
  Headphones, Truck, Check, Package, RotateCcw
} from 'lucide-react';

const REORDER_ITEMS = [
  { id: 'ro1', name: 'Organic Full Cream Milk (2L)', nameBn: 'জৈব পূর্ণ দুধ (২ লিটার)', store: 'DOHS Dairy Store', storeBn: 'ডিএইচএস ডেইরি স্টোর', price: 180, img: '🥛' },
  { id: 'ro2', name: 'Premium Basmati Rice (5kg)', nameBn: 'প্রিমিয়াম বাস মতি চাল (৫ কেজি)', store: 'Super Bazaar DOHS', storeBn: 'সুপার বাজার ডিএইচএস', price: 650, img: '🌾' },
  { id: 'ro3', name: 'Cold Pressed Mustard Oil (1L)', nameBn: 'কোল্ড প্রেসড সরিষার তেল (১ লিটার)', store: 'Shuddh Masola & Oil', storeBn: 'বিশুদ্ধ মশলা ও তেল', price: 320, img: '🧴' },
  { id: 'ro4', name: 'Farm Fresh Organic Eggs (12 pcs)', nameBn: 'খামারের তাজা ডিম (১২ টি)', store: 'Jain Dham Dairy', storeBn: 'জৈন ধাম ডেইরি', price: 155, img: '🥚' },
];

export default function CustomerDashboardOverview() {
  const { language } = useLanguageStore();
  const { orders: storeOrders } = useOrderStore();
  const [activeBookingsCount, setActiveBookingsCount] = useState<number>(2);
  const [expressOrdersCount, setExpressOrdersCount] = useState<number>(12);
  const [totalSpend, setTotalSpend] = useState<number>(14850);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(420);
  const [loading, setLoading] = useState(false);
  const isBn = language === 'BN';

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetchApi<any[]>('/bookings'),
      fetchApi<any[]>('/orders'),
    ]).then(([bookingsRes, ordersRes]) => {
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success && Array.isArray(bookingsRes.value.data)) {
        const active = bookingsRes.value.data.filter((b) => b.status === 'CONFIRMED' || b.status === 'SCHEDULED' || b.status === 'EN_ROUTE');
        setActiveBookingsCount(active.length || 2);
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value.success && Array.isArray(ordersRes.value.data)) {
        const apiOrders = ordersRes.value.data;
        const allOrders = [...storeOrders, ...apiOrders];
        if (allOrders.length > 0) {
          setExpressOrdersCount(allOrders.length);
          const spend = allOrders.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);
          if (spend > 0) {
            setTotalSpend(spend);
            setLoyaltyPoints(Math.floor(spend / 35));
          }
        }
      }
    }).finally(() => setLoading(false));
  }, [storeOrders]);

  return (
    <div className="space-y-6 text-white">

      {/* ── Quick Action Cards Bar ── */}
      <div className="space-y-3">
        <h2 className="font-bold text-sm text-indigo-300 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{isBn ? 'দ্রুত পদক্ষেপ' : 'Quick Actions'}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/"
            className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all flex flex-col items-center justify-center gap-2 text-center group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{isBn ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}</span>
          </Link>

          <Link
            href="/dashboard/orders"
            className="p-4 rounded-2xl bg-[#1e1f32] hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
          >
            <Package className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>{isBn ? 'আমার আদেশ' : 'My Orders'}</span>
          </Link>

          <Link
            href="/dashboard/orders"
            className="p-4 rounded-2xl bg-[#1e1f32] hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
          >
            <Truck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>{isBn ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
          </Link>

          <Link
            href="/wishlist"
            className="p-4 rounded-2xl bg-[#1e1f32] hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
          >
            <Heart className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>{isBn ? 'ইচ্ছাতালিকা' : 'Wishlist'}</span>
          </Link>

          <Link
            href="/cart"
            className="p-4 rounded-2xl bg-[#1e1f32] hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
          >
            <ShoppingCart className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>{isBn ? 'শপিং কার্ট' : 'Shopping Cart'}</span>
          </Link>

          <Link
            href="/contact"
            className="p-4 rounded-2xl bg-[#1e1f32] hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
          >
            <Headphones className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>{isBn ? 'সহায়তার সাথে যোগাযোগ করুন' : 'Contact Support'}</span>
          </Link>
        </div>
      </div>

      {/* ── Main Dashboard Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Recent Activities */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-[#1e1f32] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>{isBn ? 'সাম্প্রতিক কার্যকলাপ' : 'Recent Activities'}</span>
              </h2>
              <Link href="/dashboard/orders" className="text-xs font-semibold text-indigo-400 hover:underline">
                {isBn ? 'সব দেখুন' : 'View All'}
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">
                      {isBn ? 'অর্ডার #ORD-9942 ডেলিভারি করা হয়েছে' : 'Order #ORD-9942 Delivered'}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isBn ? 'DOHS এক্সপ্রেসের মাধ্যমে সরবরাহ করা হয়েছে তাজা টমেটো ও অর্গানিক হোল মিল্ক' : 'Delivered Fresh Tomatoes & Organic Whole Milk via DOHS Express'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{isBn ? '১০ মিনিট আগে' : '10m ago'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">
                      {isBn ? 'পেমেন্ট নিশ্চিত করা হয়েছে' : 'Payment Confirmed'}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isBn ? '#ORD-9945 অর্ডারের জন্য বিকাশের মাধ্যমে পেমেন্ট করুন ৳১,৮৫০' : '#ORD-9945 paid ৳1,850 via bKash'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{isBn ? '২ ঘন্টা আগে' : '2h ago'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">
                      {isBn ? 'অর্ডার #ORD-9945 দেওয়া হয়েছে' : 'Order #ORD-9945 Placed'}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isBn ? 'বাসমতি চাল (৫ কেজি) এবং সরিষার তেল (১ লিটার)' : 'Basmati Rice (5kg) & Mustard Oil (1L)'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{isBn ? '২ ঘন্টা আগে' : '2h ago'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reorder Necessary Items */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-[#1e1f32] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <span>{isBn ? 'পুনরায় কেনার জন্য প্রয়োজনীয় জিনিসপত্র' : 'Essential Reorder Items'}</span>
              </h2>
              <Link href="/" className="text-xs font-semibold text-emerald-400 hover:underline">
                {isBn ? 'সবকিছু দেখুন →' : 'View All →'}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REORDER_ITEMS.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 space-y-2 flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-xl flex items-center justify-center shrink-0">
                      {item.img}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-white truncate">{isBn ? item.nameBn : item.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{isBn ? item.storeBn : item.store}</p>
                      <p className="font-black text-xs text-emerald-400 mt-0.5">৳{formatCurrency(item.price)}</p>
                    </div>
                  </div>

                  <button className="w-full py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[11px] border border-emerald-500/20 transition-all flex items-center justify-center gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    <span>{isBn ? 'পুনরায় অর্ডার করুন' : 'Reorder Now'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


