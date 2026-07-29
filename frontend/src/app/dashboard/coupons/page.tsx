'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import { Award, Tag, Copy, Check, Sparkles, Gift, Loader2 } from 'lucide-react';

interface CouponItem {
  id: string;
  code: string;
  description?: string;
  title?: string;
  discountValue: number;
  discountType: string;
  minOrderAmount?: number;
  expiresAt?: string;
  isActive: boolean;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(450);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchApi<any>('/coupons').catch(() => ({ data: [] })),
      fetchApi<any>('/orders').catch(() => ({ data: [] })),
    ])
      .then(([couponRes, orderRes]) => {
        if (couponRes?.data) {
          setCoupons(Array.isArray(couponRes.data) ? couponRes.data : []);
        }
        if (orderRes?.data && Array.isArray(orderRes.data)) {
          const totalSpent = orderRes.data.reduce((acc: number, o: any) => acc + Number(o.totalAmount || 0), 0);
          setPoints(Math.max(150, Math.round(totalSpent / 10)));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getTier = (pts: number) => {
    if (pts >= 1000) return { name: 'Platinum Tier Resident', icon: '💎', color: 'text-cyan-300', next: 'Max Tier Achieved!', percent: 100 };
    if (pts >= 400) return { name: 'Gold Tier Resident Member', icon: '👑', color: 'text-amber-300', next: `${1000 - pts} pts needed to reach Platinum`, percent: Math.min(95, Math.round((pts / 1000) * 100)) };
    if (pts >= 150) return { name: 'Silver Tier Resident', icon: '🥈', color: 'text-slate-300', next: `${400 - pts} pts needed to reach Gold`, percent: Math.round((pts / 400) * 100) };
    return { name: 'Bronze Tier Resident', icon: '🥉', color: 'text-amber-600', next: `${150 - pts} pts needed to reach Silver`, percent: Math.round((pts / 150) * 100) };
  };

  const tier = getTier(points);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-400" /> Coupons & Loyalty Rewards
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">View your loyalty level progress, available coupons, and reward point vouchers</p>
      </div>

      {/* Loyalty Level Progress Card */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-[#1e1f32] border border-purple-500/20 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl">
              {tier.icon}
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${tier.color}`}>CURRENT TIER</span>
              <h2 className="text-xl font-black text-white">{tier.name}</h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-purple-300">{points} Pts</span>
            <p className="text-xs text-slate-400">{tier.next}</p>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-500"
              style={{ width: `${tier.percent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-bold">
            <span>Bronze</span>
            <span>Silver</span>
            <span className="text-amber-400">Gold</span>
            <span>Platinum</span>
          </div>
        </div>
      </div>

      {/* Coupons List */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Tag className="w-4 h-4 text-purple-400" /> Available Discount Coupons
        </h3>

        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading coupons...
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#1e1f32] border border-white/10 text-center text-slate-400 text-xs">
            No active discount coupons available right now. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((c) => (
              <div key={c.id || c.code} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 flex items-start justify-between gap-4 relative overflow-hidden">
                <div className="space-y-2 min-w-0">
                  <div className="inline-block px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono font-black text-sm">
                    {c.code}
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    {c.description || c.title || `${c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `৳${c.discountValue}`} Discount`}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Min. Spend: ৳{c.minOrderAmount || 0} · {c.expiresAt ? `Expires: ${new Date(c.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'No Expiry'}
                  </p>
                </div>

                <button
                  onClick={() => copyCode(c.code)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-xs font-bold text-purple-200 border border-purple-500/30 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copiedCode === c.code ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode === c.code ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

