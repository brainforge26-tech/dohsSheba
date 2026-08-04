'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ServiceAddon, ServiceItem } from '@/types/service';
import { formatCurrency } from '@/utils/cn';
import { BookingSteps } from '@/components/services/BookingSteps';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  MapPin,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';

interface BookingClientProps {
  service: ServiceItem;
}

export function BookingClient({ service }: BookingClientProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [dateSlot, setDateSlot] = useState<string>('Today (Within 2 Hours)');
  const [address, setAddress] = useState<string>('House 42, Road 7, DOHS Mohakhali, Dhaka');
  const [phone, setPhone] = useState<string>('+880 1712-345678');
  const [notes, setNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card' | 'cod'>('cod');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const selectedAddons: ServiceAddon[] = (service.addons || []).filter((a) =>
    selectedAddonIds.includes(a.id)
  );
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = service.price + addonsTotal;

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompleted(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Back Button */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          href={`/services/home-service/${service.categorySlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Services</span>
        </Link>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Service Booking Checkout
        </span>
      </div>

      {!isCompleted ? (
        <div className="space-y-8">
          <BookingSteps currentStep={step} />

          {/* Service Summary Banner */}
          <div className="p-5 rounded-3xl border border-border bg-card shadow-card flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
              <Image src={service.image} alt={service.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                {service.categoryName}
              </span>
              <h2 className="font-extrabold text-base truncate">{service.title}</h2>
              <div className="text-xs text-muted-foreground">By {service.providerName}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Total Price</div>
              <div className="text-xl font-black text-primary">{formatCurrency(totalPrice)}</div>
            </div>
          </div>

          {/* STEP 1: Addons Selection */}
          {step === 1 && (
            <div className="p-6 rounded-3xl border border-border bg-card shadow-card space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="font-extrabold text-lg">Choose Recommended Service Addons</h3>
                <p className="text-xs text-muted-foreground">
                  Select optional extra services to include with your booking.
                </p>
              </div>

              {service.addons && service.addons.length > 0 ? (
                <div className="space-y-3">
                  {service.addons.map((addon) => {
                    const isSelected = selectedAddonIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-primary/10 border-primary shadow-sm'
                            : 'border-border hover:bg-secondary'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm">{addon.title}</h4>
                          <p className="text-xs text-muted-foreground">{addon.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-sm text-primary">
                            +{formatCurrency(addon.price)}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'border-border bg-background'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No extra addons available for this service.</p>
              )}

              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
                >
                  <span>Continue to Schedule</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Schedule Picker */}
          {step === 2 && (
            <div className="p-6 rounded-3xl border border-border bg-card shadow-card space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Select Date & Preferred Time Slot
                </h3>
                <p className="text-xs text-muted-foreground">
                  Our technician will arrive strictly within your selected time window.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Today (Within 2 Hours - Express)',
                  'Today Evening (5:00 PM - 8:00 PM)',
                  'Tomorrow Morning (9:00 AM - 12:00 PM)',
                  'Tomorrow Afternoon (2:00 PM - 5:00 PM)',
                  'Day After Tomorrow (9:00 AM - 12:00 PM)',
                ].map((slot) => (
                  <div
                    key={slot}
                    onClick={() => setDateSlot(slot)}
                    className={`p-4 rounded-2xl border cursor-pointer font-semibold text-xs transition-all flex items-center justify-between ${
                      dateSlot === slot
                        ? 'bg-primary/10 border-primary text-primary shadow-sm font-bold'
                        : 'border-border hover:bg-secondary text-foreground'
                    }`}
                  >
                    <span>{slot}</span>
                    {dateSlot === slot && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-secondary"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
                >
                  <span>Continue to Address</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Address & Notes */}
          {step === 3 && (
            <div className="p-6 rounded-3xl border border-border bg-card shadow-card space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Service Address & Special Instructions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Provide your house/flat location within DOHS and contact number.
                </p>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-muted-foreground mb-1">DOHS House Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-input bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-input bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">
                    Special Notes for Technician (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Gate password is #4401, bring extra 10ft wire, call 10 mins before arrival"
                    className="w-full p-3 rounded-xl border border-input bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-secondary"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
                >
                  <span>Review Summary & Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Summary & Payment */}
          {step === 4 && (
            <form
              onSubmit={handleConfirmOrder}
              className="p-6 rounded-3xl border border-border bg-card shadow-card space-y-6 animate-in fade-in duration-300"
            >
              <div>
                <h3 className="font-extrabold text-lg">Final Review & Payment Method</h3>
                <p className="text-xs text-muted-foreground">
                  Confirm your booking details and choose payment options.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Service Price ({service.title}):</span>
                  <span className="font-semibold">{formatCurrency(service.price)}</span>
                </div>
                {selectedAddons.map((addon) => (
                  <div key={addon.id} className="flex justify-between text-muted-foreground">
                    <span>Addon ({addon.title}):</span>
                    <span className="font-semibold text-foreground">+{formatCurrency(addon.price)}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Location:</span>
                  <span className="font-semibold text-foreground">{address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled Time:</span>
                  <span className="font-semibold text-foreground">{dateSlot}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-extrabold text-sm">
                  <span>Total Booking Amount:</span>
                  <span className="text-primary">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Select Payment Method
                  </label>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Cash After Service Active
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'cod', label: 'Cash After Service', available: true },
                    { id: 'bkash', label: 'bKash Mobile', available: false },
                    { id: 'nagad', label: 'Nagad Wallet', available: false },
                    { id: 'card', label: 'Debit/Credit Card', available: false },
                  ].map((pm) => (
                    <div
                      key={pm.id}
                      onClick={() => {
                        if (pm.available) setPaymentMethod(pm.id as any);
                      }}
                      className={`relative p-3.5 rounded-2xl border text-center transition-all text-xs font-bold ${
                        pm.available && paymentMethod === pm.id
                          ? 'bg-primary/10 border-primary text-primary shadow-sm cursor-pointer'
                          : 'border-border bg-slate-50/50 text-slate-400 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <span>{pm.label}</span>
                      {!pm.available && (
                        <span className="block text-[9px] font-normal text-slate-400 mt-0.5">
                          (Coming Soon)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                <span>100% Satisfaction Guarantee. No upfront charges required for Cash After Service.</span>
              </div>

              <div className="flex justify-between pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-secondary"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Confirm Booking ({formatCurrency(totalPrice)})</span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Confirmation Receipt Screen */
        <div className="p-8 rounded-3xl border border-emerald-500/30 bg-card shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12 stroke-[2]" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Booking Confirmed
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">Your Service is Booked!</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Technician from <strong className="text-foreground">{service.providerName}</strong> has accepted your booking request.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-secondary/70 border border-border max-w-lg mx-auto text-left text-xs space-y-2.5">
            <div className="flex justify-between pb-2 border-b border-border">
              <span className="text-muted-foreground">Booking Order Reference:</span>
              <span className="font-mono font-extrabold text-foreground">#DOHS-BS-8891</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Name:</span>
              <span className="font-bold text-foreground">{service.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scheduled Time:</span>
              <span className="font-semibold text-foreground">{dateSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address:</span>
              <span className="font-semibold text-foreground">{address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-bold uppercase text-primary">{paymentMethod}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-black text-sm text-primary">
              <span>Total Paid / Payable:</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border font-semibold text-xs hover:bg-secondary"
            >
              Return to Home
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 shadow-md"
            >
              View My Bookings Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
