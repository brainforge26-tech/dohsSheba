'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/cn';
import {
  ClipboardList,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  RefreshCcw,
  ArrowRight,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

const MOCK_REFUNDS = [
  {
    id: 'RFD-4410',
    orderId: 'ORD-9910',
    product: 'Saffron Premium Grade A (5g)',
    amount: 350,
    reason: 'Damaged packaging during transit',
    date: '24 Jul 2026',
    status: 'COMPLETED',
    timeline: [
      { step: 'Requested', date: '24 Jul, 10:00 AM', done: true },
      { step: 'Approved', date: '24 Jul, 11:30 AM', done: true },
      { step: 'Pickup Scheduled', date: '24 Jul, 02:00 PM', done: true },
      { step: 'Product Received', date: '25 Jul, 09:00 AM', done: true },
      { step: 'Refund Sent', date: '25 Jul, 12:00 PM', done: true },
      { step: 'Completed', date: '25 Jul, 12:05 PM', done: true },
    ],
  },
];

export default function RefundsPage() {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('Damaged Product');
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-amber-400" /> Returns & Refunds
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Submit return claims and monitor refund processing timelines</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Request Return/Refund
        </button>
      </div>

      {/* Refunds List */}
      <div className="space-y-4">
        {MOCK_REFUNDS.map((rfd) => (
          <div key={rfd.id} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-indigo-400 text-sm">#{rfd.id}</span>
                  <span className="text-xs text-slate-400">· Order #{rfd.orderId}</span>
                </div>
                <h3 className="font-bold text-white text-sm mt-0.5">{rfd.product}</h3>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Refund Completed (৳{formatCurrency(rfd.amount)})
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Reason: {rfd.reason}</p>
              </div>
            </div>

            {/* Refund Timeline Steps */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300">Refund Processing Timeline</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {rfd.timeline.map((st, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold text-white">{st.step}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">{st.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e1f32] border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-indigo-400" /> Request Return / Refund
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Select Order Item</label>
                <select className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none">
                  <option value="ORD-9942">ORD-9942: Organic Whole Milk (2L)</option>
                  <option value="ORD-9945">ORD-9945: Basmati Rice (5kg)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Reason for Return</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option>Damaged Product</option>
                  <option>Expired Item</option>
                  <option>Wrong Item Delivered</option>
                  <option>Quality Not as Expected</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Explain the issue in detail..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Upload Photo / Video Proof</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500/50 transition-colors">
                  <ImageIcon className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-400">Click to upload image or video proof</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
              >
                Submit Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
