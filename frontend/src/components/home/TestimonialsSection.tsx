'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Quote, ArrowRight } from 'lucide-react';

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
      </div>
    </section>
  );
}
