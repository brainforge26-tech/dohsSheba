'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatCurrency } from '@/utils/cn';
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  MapPin,
  User,
  CreditCard,
  Download,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = (params?.id as string) || 'ORD-9945';

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/orders"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              Order Details <span className="text-indigo-400 font-mono">#{orderId}</span>
            </h1>
            <p className="text-xs text-slate-400">Placed on 28 Jul 2026 at 02:15 PM</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/orders/track"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Truck className="w-4 h-4" /> Live Tracking
          </Link>
          <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-xs border border-white/10 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Invoice PDF
          </button>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ordered Products Card */}
          <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-4">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-400" /> Ordered Items (2)
            </h2>

            <div className="divide-y divide-white/5">
              {[
                { name: 'Basmati Rice Premium (5kg)', seller: 'Super Bazar DOHS', qty: 1, price: 650, icon: '🌾' },
                { name: 'Cold Pressed Mustard Oil (1L)', seller: 'Pure Spices & Oils', qty: 2, price: 320, icon: '🍾' },
              ].map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-white/5">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{item.name}</h4>
                      <p className="text-xs text-slate-400">Seller: <span className="text-indigo-300">{item.seller}</span></p>
                      <p className="text-xs text-slate-400 mt-0.5">Qty: {item.qty} × ৳{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-emerald-400">৳{formatCurrency(item.qty * item.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-3">
            <h2 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-cyan-400" /> Invoice Summary
            </h2>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Subtotal</span>
              <span className="text-white font-semibold">৳1,290</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Delivery Charge (DOHS Resident Express)</span>
              <span className="text-white font-semibold">৳60</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Tax (5% VAT)</span>
              <span className="text-white font-semibold">৳64.50</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-400 font-semibold">
              <span>Coupon Discount (RESIDENT50)</span>
              <span>-৳50.00</span>
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-between text-sm font-black text-white">
              <span>Total Amount</span>
              <span className="text-emerald-400">৳1,364.50</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & Status */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-3">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" /> Delivery Address
            </h2>
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-bold text-white">Lt. Col. Rahman (Retd.)</p>
              <p>House 42, Road 7, Sector 2</p>
              <p>Mirpur DOHS, Dhaka 1216</p>
              <p className="text-slate-400 flex items-center gap-1.5 pt-1">
                <Phone className="w-3.5 h-3.5 text-indigo-400" /> +880 1711 009988
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-3">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" /> Payment Information
            </h2>
            <div className="text-xs text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="font-bold text-white">bKash Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-indigo-300">TRX99482716</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span className="font-bold text-emerald-400">PAID & VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Seller Support */}
          <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-3">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" /> Seller Support
            </h2>
            <p className="text-xs text-slate-400">Need help or want to modify your delivery details?</p>
            <div className="flex items-center gap-2 pt-1">
              <Link
                href="/dashboard/messages"
                className="flex-1 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-semibold text-xs text-center border border-indigo-500/30 transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Chat Seller
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
