'use client';

import React from 'react';
import Link from 'next/link';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  ArrowLeft,
  Package,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const trackingSteps = [
    { title: 'Order Placed', time: '28 Jul 2026, 02:15 PM', by: 'System', remark: 'Order details submitted successfully', status: 'completed' },
    { title: 'Payment Confirmed', time: '28 Jul 2026, 02:16 PM', by: 'bKash Gateway', remark: 'Transaction #TRX99482716 verified', status: 'completed' },
    { title: 'Seller Accepted', time: '28 Jul 2026, 02:30 PM', by: 'Super Bazar DOHS', remark: 'Seller accepted order and allocated inventory', status: 'completed' },
    { title: 'Preparing Package', time: '28 Jul 2026, 03:00 PM', by: 'Super Bazar DOHS', remark: 'Items inspected & quality checked', status: 'completed' },
    { title: 'Packed', time: '28 Jul 2026, 03:45 PM', by: 'Super Bazar DOHS', remark: 'Package sealed with safety tape', status: 'completed' },
    { title: 'Courier Pickup', time: '28 Jul 2026, 04:15 PM', by: 'DOHS Express Fleet', remark: 'Rider Tariqul Rahman picked up package', status: 'completed' },
    { title: 'Shipped', time: '28 Jul 2026, 04:30 PM', by: 'DOHS Hub 2', remark: 'In transit via DOHS Electric Delivery Vehicle', status: 'completed' },
    { title: 'Reached Local Hub', time: '28 Jul 2026, 05:00 PM', by: 'Mirpur DOHS Dispatch Hub', remark: 'Sorting completed for Sector 2 delivery', status: 'completed' },
    { title: 'Out For Delivery', time: '28 Jul 2026, 05:30 PM', by: 'Rider Tariqul Rahman', remark: 'Delivery rider is in your street!', status: 'current' },
    { title: 'Delivered', time: 'Est. 06:00 PM', by: 'Customer Signature', remark: 'Pending customer confirmation', status: 'future' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/orders"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Truck className="w-6 h-6 text-indigo-400" /> Live Order Tracking
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time status updates for Order <span className="font-mono text-indigo-300 font-bold">#ORD-9945</span></p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
          <Clock className="w-4 h-4 animate-spin" /> Est. Remaining: 25 mins
        </div>
      </div>

      {/* Courier & Rider Info Header */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl font-bold">
            🛵
          </div>
          <div>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">DOHS RESIDENT EXPRESS FLEET</span>
            <h3 className="font-black text-white text-base">Rider: Tariqul Rahman</h3>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Vehicle: EV-Bike #42</span> · <span>Contact: +880 1822 112233</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:+8801822112233"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Phone className="w-3.5 h-3.5" /> Call Rider
          </a>
          <Link
            href="/dashboard/messages"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Message
          </Link>
        </div>
      </div>

      {/* Timeline Card */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-6 space-y-6">
        <h2 className="font-bold text-white text-sm flex items-center gap-2">
          <Package className="w-4 h-4 text-indigo-400" /> Tracking Journey
        </h2>

        {/* Animated Vertical Timeline */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[15px] sm:before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
          {trackingSteps.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isFuture = step.status === 'future';

            return (
              <div key={index} className="relative flex items-start gap-4 group">
                {/* Node Icon */}
                <div
                  className={`absolute -left-[30px] sm:-left-[34px] top-0.5 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                      : isCurrent
                      ? 'bg-indigo-500 text-white ring-4 ring-indigo-500/30 animate-bounce'
                      : 'bg-slate-800 text-slate-500 border border-white/10'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white/5 border border-white/5 group-hover:border-white/10 p-4 rounded-2xl space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className={`font-bold text-sm ${isCurrent ? 'text-indigo-400' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                      {step.title}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">{step.time}</span>
                  </div>
                  <p className="text-xs text-slate-300">{step.remark}</p>
                  <p className="text-[10px] text-slate-400 pt-1">Updated by: <span className="text-indigo-300 font-semibold">{step.by}</span></p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
