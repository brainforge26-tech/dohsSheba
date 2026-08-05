import React from 'react';
import { ShieldCheck, Heart, Users, MapPin, Award } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="py-12 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 w-full max-w-[1720px] mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
          About dohsSheba
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Empowering DOHS Communities with Smart Services & Grocery Express
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          dohsSheba was built with a single mission: to provide defense officers housing society (DOHS) residents with safe, reliable home repair services and ultra-fast daily grocery delivery from trusted local sellers.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl border border-border bg-card space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">100% Background Verified</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every technician, electrician, plumber, and cleaner undergoes NID verification and security vetting before entering your home.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-border bg-card space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Local Community First</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We partner with local DOHS bazaar vendors and small service entrepreneurs, giving them digital tools to thrive.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-border bg-card space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Guaranteed Quality</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            If a repair doesn't satisfy your standards, our 7-day free re-service policy ensures complete peace of mind.
          </p>
        </div>
      </div>
    </div>
  );
}
