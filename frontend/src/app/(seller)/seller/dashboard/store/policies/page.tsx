'use client';

import React, { useState } from 'react';
import { FileText, Save, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';

const POLICIES = [
  {
    key: 'return',
    label: 'Return & Refund Policy',
    default: `Return & Refund Policy

We accept returns within 3 days of delivery for the following reasons:
• Wrong item delivered
• Damaged or spoiled product on arrival
• Item significantly different from description

Non-returnable items: Fresh produce, frozen foods, and perishables once opened.

Refund Process:
Approved refunds will be credited to your original payment method within 3–5 business days. Cash on Delivery refunds will be transferred via bKash.

To initiate a return, contact us at seller@freshbazaar.com or call 01711-000001.`,
  },
  {
    key: 'shipping',
    label: 'Shipping Policy',
    default: `Shipping Policy

We deliver to all DOHS zones in Dhaka, Bangladesh.

Standard Delivery:
• Orders above ৳500: FREE delivery (within 2–4 hours for in-stock items)
• Orders below ৳500: ৳60 flat shipping fee

Express Delivery (1–2 hours):
• Available for select items — ৳100 extra charge
• Available 8 AM – 8 PM daily

Orders placed before 12 PM are delivered the same day.
Orders after 12 PM are delivered the next morning by 10 AM.

We do not ship outside Dhaka at this time.`,
  },
  {
    key: 'privacy',
    label: 'Privacy Policy',
    default: `Privacy Policy

Fresh Bazaar collects only the personal information necessary to complete your orders:
• Name, phone, and delivery address
• Order history and preferences

Your data is never sold to third parties.

We use cookies to improve your shopping experience. You may disable cookies in your browser settings.

Contact: seller@freshbazaar.com`,
  },
];

export default function StorePoliciesPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState('');
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(POLICIES.map(p => [p.key, p.default]))
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved('Policies saved successfully!'); setTimeout(() => setSaved(''), 3000); }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-slate-500 mb-0.5">Store / Policies</p>
        <h1 className="font-black text-white text-xl flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" /> Store Policies
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Define your store's return, shipping, and privacy policies</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4" /> {saved}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {POLICIES.map((p) => (
          <div key={p.key} className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> {p.label}
              </h2>
              <button type="button" onClick={() => setValues(v => ({ ...v, [p.key]: p.default }))}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>
            <div className="p-4">
              <textarea
                rows={10}
                value={values[p.key]}
                onChange={(e) => setValues(v => ({ ...v, [p.key]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 resize-y font-mono leading-relaxed"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">{values[p.key].length} characters</p>
            </div>
          </div>
        ))}

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save All Policies'}
        </button>
      </form>
    </div>
  );
}
