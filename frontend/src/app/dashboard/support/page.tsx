'use client';

import React, { useState } from 'react';
import { Mail, Plus, Headphones, CheckCircle2, Clock, Paperclip } from 'lucide-react';

const TICKETS = [
  { id: 'TCK-8812', subject: 'Inquiry regarding DOHS Express delivery hours', category: 'Delivery', status: 'RESOLVED', date: '22 Jul 2026' },
  { id: 'TCK-8890', subject: 'Refund delay for damaged item', category: 'Refund', status: 'IN_PROGRESS', date: '27 Jul 2026' },
];

export default function SupportPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Headphones className="w-6 h-6 text-indigo-400" /> Support Tickets
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Submit customer care inquiries, track resolution progress, and attach files</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Ticket
        </button>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {TICKETS.map((t) => (
          <div key={t.id} className="p-5 rounded-2xl bg-[#1e1f32] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-400">#{t.id}</span>
                <span className="text-xs text-slate-400">· {t.date}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-semibold">{t.category}</span>
              </div>
              <h3 className="font-bold text-white text-sm mt-1">{t.subject}</h3>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              t.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {t.status}
            </span>
          </div>
        ))}
      </div>

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e1f32] border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Headphones className="w-5 h-5 text-indigo-400" /> Open Support Ticket
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Ticket Subject</label>
                <input
                  type="text"
                  placeholder="Brief summary of your issue..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Issue Category</label>
                <select className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none">
                  <option>Order Issue</option>
                  <option>Payment & Refund</option>
                  <option>Delivery Delay</option>
                  <option>Account & Profile</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={4}
                  placeholder="Provide detailed description..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                />
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
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
