'use client';

import React, { useMemo } from 'react';
import { Package, ShoppingBag, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/cn';
import { useLanguageStore } from '@/store/useLanguageStore';

interface ProductTrackingProps {
  recentOrders?: any[];
  recentBookings?: any[];
}

const DEFAULT_MOCK = [
  {
    id: '#ORD-9821',
    name: 'Fresh Organic Milk & Fruits',
    category: 'Grocery Express',
    customer: 'Mrs. Nusrat Jahan',
    status: 'DELIVERED',
    amount: 1450,
    date: '27 Jul 2026',
  },
  {
    id: '#SRV-3012',
    name: 'AC Master Servicing & Gas Top-up',
    category: 'Home Services',
    customer: 'Dr. Tariqul Islam',
    status: 'IN_PROGRESS',
    amount: 3200,
    date: '27 Jul 2026',
  },
  {
    id: '#ORD-9819',
    name: 'Pure Honey & Organic Ghee Pack',
    category: 'Bazaar Essentials',
    customer: 'Mr. Selim Khan',
    status: 'PENDING',
    amount: 2100,
    date: '26 Jul 2026',
  },
  {
    id: '#SRV-3010',
    name: 'Deep Apartment Sanitization',
    category: 'Cleaning',
    customer: 'Lt. Col. Rahim',
    status: 'COMPLETED',
    amount: 4500,
    date: '26 Jul 2026',
  },
];

export function ProductTrackingWidget({ recentOrders = [], recentBookings = [] }: ProductTrackingProps) {
  const { language } = useLanguageStore();
  const isBn = language === 'BN';

  const trackingData = useMemo(() => {
    const list: any[] = [];
    if (Array.isArray(recentOrders) && recentOrders.length > 0) {
      recentOrders.forEach((o) => {
        list.push({
          id: `#ORD-${(o.id || '').slice(0, 5).toUpperCase()}`,
          name: o.items?.[0]?.product?.name || 'Express Marketplace Order',
          category: 'Marketplace Order',
          customer: o.customer?.name || 'Resident Customer',
          status: o.status || 'PENDING',
          amount: o.totalAmount || 1200,
          date: new Date(o.createdAt || Date.now()).toLocaleDateString(),
        });
      });
    }
    if (Array.isArray(recentBookings) && recentBookings.length > 0) {
      recentBookings.forEach((b) => {
        list.push({
          id: `#SRV-${(b.id || '').slice(0, 5).toUpperCase()}`,
          name: b.service?.title || 'Home Service Booking',
          category: 'Home Service',
          customer: b.customer?.name || 'Resident Customer',
          status: b.status || 'CONFIRMED',
          amount: b.totalAmount || b.service?.price || 1500,
          date: new Date(b.createdAt || Date.now()).toLocaleDateString(),
        });
      });
    }
    return list.length > 0 ? list : DEFAULT_MOCK;
  }, [recentOrders, recentBookings]);

  return (
    <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 text-white shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-white">Product & Service Tracking</h3>
          <p className="text-xs text-slate-400">Live order fulfillment and service progress</p>
        </div>

        <button className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-xs border border-indigo-500/30 transition-all flex items-center gap-1">
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="pb-3 px-2">Tracking ID</th>
              <th className="pb-3 px-2">Item / Service Name</th>
              <th className="pb-3 px-2">Customer</th>
              <th className="pb-3 px-2">Amount</th>
              <th className="pb-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {trackingData.map((item) => {
              const isDone = item.status === 'DELIVERED' || item.status === 'COMPLETED';
              const isPending = item.status === 'PENDING';

              return (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-indigo-400">{item.id}</td>
                  <td className="py-3 px-2">
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.category}</div>
                  </td>
                  <td className="py-3 px-2 text-slate-300 font-medium">{item.customer}</td>
                  <td className="py-3 px-2 font-black text-emerald-400">{formatCurrency(item.amount)}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isPending
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{item.status}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
