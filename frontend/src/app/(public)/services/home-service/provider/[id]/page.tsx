import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_PROVIDER_PROFILES } from '@/constants/services';
import { formatCurrency } from '@/utils/cn';
import {
  Star,
  ShieldCheck,
  MapPin,
  PhoneCall,
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  MessageSquare,
  Wrench,
} from 'lucide-react';

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = MOCK_PROVIDER_PROFILES[id] || Object.values(MOCK_PROVIDER_PROFILES)[0];

  return (
    <div className="py-8 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 w-full max-w-[1720px] mx-auto space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/services/home-service" className="hover:text-primary">Home Services</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-bold">{provider.name}</span>
      </nav>

      {/* Hero Cover & Provider Profile Card */}
      <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xl">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900">
          <Image
            src={provider.coverImage}
            alt={provider.name}
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </div>

        {/* Profile Info Row */}
        <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-background bg-secondary shadow-xl flex-shrink-0">
              <Image
                src={provider.avatar}
                alt={provider.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {provider.name}
                </h1>
                {provider.isVerified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Verified Partner
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-primary">{provider.categoryName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{provider.address}</span>
              </div>
            </div>
          </div>

          {/* Core Stats Badge Pill */}
          <div className="w-full md:w-auto flex items-center justify-around gap-6 p-4 rounded-2xl bg-secondary/80 border border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500 font-extrabold text-lg">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{provider.rating}</span>
              </div>
              <div className="text-[10px] text-muted-foreground font-semibold">
                {provider.reviewCount} Reviews
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="font-extrabold text-lg text-primary">
                {provider.completedJobs}+
              </div>
              <div className="text-[10px] text-muted-foreground font-semibold">Jobs Completed</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="font-extrabold text-lg text-emerald-600">
                {provider.experienceYears} Yrs
              </div>
              <div className="text-[10px] text-muted-foreground font-semibold">Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 rounded-3xl border border-border bg-card space-y-3 shadow-card">
            <h2 className="text-lg font-extrabold">About {provider.name}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{provider.bio}</p>
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Specialties & Expertise
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {provider.specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-bold text-xs border border-primary/20"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              <span>Available Service Packages</span>
            </h2>

            <div className="space-y-4">
              {provider.services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-6 rounded-3xl border border-border bg-card hover:border-primary/40 transition-all shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-2 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        {srv.categoryName}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {srv.duration}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base">{srv.title}</h3>
                    <p className="text-xs text-muted-foreground">{srv.description}</p>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold pt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>90-Day Free Warranty & Transparent Quote</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto text-right border-t sm:border-t-0 border-border pt-3 sm:pt-0 flex sm:flex-col justify-between items-center sm:items-end gap-3">
                    <div>
                      <div className="text-2xl font-black text-primary">
                        {formatCurrency(srv.price)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">/ {srv.priceUnit}</div>
                    </div>
                    <Link
                      href={`/services/home-service/book/${srv.id}`}
                      className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      <span>Book Service</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              <span>Resident Reviews ({provider.reviews.length})</span>
            </h2>

            {provider.reviews.length === 0 ? (
              <p className="text-xs text-muted-foreground p-4 border border-border rounded-2xl bg-card">
                No reviews yet for this provider.
              </p>
            ) : (
              <div className="space-y-4">
                {provider.reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl border border-border bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {rev.userAvatar && (
                          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border">
                            <Image src={rev.userAvatar} alt={rev.userName} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-xs">{rev.userName}</div>
                          <div className="text-[10px] text-muted-foreground">{rev.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-border bg-card space-y-4 shadow-card">
            <h3 className="font-extrabold text-base">Direct Provider Contact</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-semibold text-foreground">{provider.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-muted-foreground">{provider.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{provider.address}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Available for Today Arrival</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
