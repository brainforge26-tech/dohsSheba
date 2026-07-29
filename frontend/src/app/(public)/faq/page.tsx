import React from 'react';
import { HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How fast can a technician arrive for an emergency service?',
    a: 'For emergency electrical, plumbing, or AC breakdowns in Mohakhali, Baridhara, Mirpur, or Banani DOHS, our verified technicians arrive within 30 to 60 minutes.',
  },
  {
    q: 'How fast are groceries delivered?',
    a: 'Grocery items (vegetables, fruits, meat, fish, milk) are picked from local DOHS bazaar shops and delivered to your doorstep in 45 minutes.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept bKash, Nagad, Credit/Debit cards via SSLCommerz, and Cash on Delivery (COD).',
  },
  {
    q: 'What if I am not satisfied with a service or product?',
    a: 'All home services come with a 7-day free re-service warranty. For grocery items, if any fresh item does not meet quality expectations, you can request an instant return/replacement upon delivery.',
  },
];

export default function FAQPage() {
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
          Help Center
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-sm text-muted-foreground">
          Find quick answers about service booking, grocery express delivery, and payment policies.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="p-6 rounded-3xl border border-border bg-card shadow-card space-y-2">
            <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
              <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
              {faq.q}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed pl-7">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
