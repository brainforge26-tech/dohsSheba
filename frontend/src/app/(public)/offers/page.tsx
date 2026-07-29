import React from 'react';
import { Tag, Sparkles, Copy, ShieldCheck } from 'lucide-react';

const COUPONS = [
  {
    code: 'DOHS20',
    title: 'Flat 20% OFF on AC Jet Cleaning',
    description: 'Get 20% instant discount on your first AC servicing booking.',
    validity: 'Valid till end of month',
    badge: 'Hot Deal',
  },
  {
    code: 'FREESHIP',
    title: 'Free Delivery on Groceries over ৳500',
    description: 'Zero delivery charges for DOHS Mohakhali, Baridhara & Mirpur.',
    validity: 'Always Active',
    badge: 'Express Grocery',
  },
  {
    code: 'WELCOME100',
    title: '৳100 Cashback on 1st Order',
    description: 'Applicable for any home service or grocery order above ৳1,000.',
    validity: 'New Users Only',
    badge: 'New Resident',
  },
];

export default function OffersPage() {
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500 flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4" />
          Resident Savings
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight">Active Offers & Discount Coupons</h1>
        <p className="text-sm text-muted-foreground">
          Use these promotional coupon codes at checkout to enjoy extra savings on home services and daily groceries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COUPONS.map((coupon) => (
          <div
            key={coupon.code}
            className="p-6 rounded-3xl border border-amber-500/30 bg-card shadow-card hover:shadow-xl transition-all space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                {coupon.badge}
              </span>
              <span className="text-xs text-muted-foreground">{coupon.validity}</span>
            </div>

            <div>
              <h3 className="font-extrabold text-lg">{coupon.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{coupon.description}</p>
            </div>

            <div className="p-3 rounded-2xl bg-secondary flex items-center justify-between border border-dashed border-amber-500/40">
              <div className="font-mono font-bold text-sm tracking-wider text-primary">
                {coupon.code}
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
