'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Quote, ArrowRight, ShieldCheck, UserPlus, Store } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Brig Gen (Retd) M. Rahman',
    location: 'Road 5, Mohakhali DOHS',
    comment:
      'dohsSheba AC servicing team was super punctual and polite. High-pressure jet wash was done thoroughly without leaving any water drips on carpet.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    tag: 'AC Servicing Customer',
  },
  {
    id: 2,
    name: 'Dr. Nusrat Jahan',
    location: 'Road 11, Baridhara DOHS',
    comment:
      'The 45-minute fresh vegetable & organic fruit delivery is a lifesaver for busy working mothers. Everything arrives crisp, clean and well-packaged.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    tag: 'Grocery Express Customer',
  },
  {
    id: 3,
    name: 'Engr. Tanvir Ahmed',
    location: 'Road 2, Mirpur DOHS',
    comment:
      'Called an electrician at 8 PM for emergency main switch trip. VoltFix technician arrived in 25 minutes and fixed the short circuit cleanly.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    tag: 'Emergency Repair Customer',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 bg-background">
      <div className="w-full max-w-[1720px] mx-auto space-y-14">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">
            Resident Feedback
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Loved by DOHS Residents</h2>
          <p className="text-sm text-muted-foreground">
            Read what community members are saying about our home services & grocery delivery.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="relative p-6 rounded-3xl border border-border/80 bg-card shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20">
                  <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">{rev.name}</h4>
                  <div className="text-[10px] text-muted-foreground">{rev.location}</div>
                  <div className="text-[10px] font-semibold text-primary">{rev.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner for Service Providers & Shop Sellers */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-12 text-white border border-blue-500/20 shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Partner with DOHS Premier Platform
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Are You a Skilled Technician or Local Shop Owner?
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Join 500+ verified service providers & local shops on dohsSheba. Expand your business, reach thousands of DOHS residents, and manage bookings effortlessly with dedicated partner dashboards.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                href="/register?role=provider"
                className="py-3 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs text-center flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register as Service Provider</span>
              </Link>
              <Link
                href="/register?role=seller"
                className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Store className="w-4 h-4" />
                <span>Register as Shop Owner</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
