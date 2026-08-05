'use client';

import React from 'react';
import { Search, CalendarCheck, CheckCircle2, ShoppingBag, Truck, ThumbsUp } from 'lucide-react';

export function HowItWorksSection() {
  return (
    <section className="py-16 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 bg-background border-b border-border">
      <div className="w-full max-w-[1720px] mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
            Simple & Seamless Process
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">How dohsSheba Works</h2>
          <p className="text-sm text-muted-foreground">
            Whether you need emergency home repair or daily grocery items, we make it effortlessly fast.
          </p>
        </div>

        {/* Dual Flow Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Flow 1: Home Services */}
          <div className="p-6 sm:p-8 rounded-3xl border border-blue-500/20 bg-blue-50/40 dark:bg-blue-950/20 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                1
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-blue-900 dark:text-blue-200">
                  Booking Home Services
                </h3>
                <p className="text-xs text-blue-700/80 dark:text-blue-300/80">3 easy steps for home repairs</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-border">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex-shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Select Service & Provider</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Browse AC servicing, electrical work, plumbing, cleaning, or pest control categories.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-border">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex-shrink-0">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Choose Schedule & Location</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pick your preferred date and time slot within DOHS. Emergency 2-hour arrival available.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-border">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Job Done & Warranty Pay</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Technician arrives, completes work cleanly, and you pay digitally or cash after satisfaction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Flow 2: Shopping Express */}
          <div className="p-6 sm:p-8 rounded-3xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg">
                2
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-emerald-900 dark:text-emerald-200">
                  Ordering Daily Groceries
                </h3>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">
                  Fresh market items to your table
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-border">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex-shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Add Items to Cart</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose fresh vegetables, fruits, fish, meat, rice, and snacks from verified local shops.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-border">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex-shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">45-Minute Express Delivery</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Our local DOHS delivery riders pick up fresh items and deliver right to your door.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-border">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex-shrink-0">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Inspect & Enjoy</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Inspect your fresh produce and enjoy hassle-free return or replacement if not satisfied.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
