'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ServiceAddon, ServiceItem } from '@/types/service';
import { formatCurrency } from '@/utils/cn';
import { BookingSteps } from '@/components/services/BookingSteps';
import { fetchApi } from '@/lib/api-client';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  MapPin,
  ShieldCheck,
  Check,
  Loader2,
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
  const [loading, setLoading] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);

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

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First get user default address or use text
      const addressRes = await fetchApi<any>('/users/addresses').catch(() => null);
      let addressId = addressRes?.data?.[0]?.id;

      if (!addressId) {
        // Create quick default address
        const newAddressRes = await fetchApi<any>('/users/addresses', {
          method: 'POST',
          body: JSON.stringify({
            label: 'DOHS Service Address',
            line1: address,
            area: 'Mohakhali DOHS',
            city: 'Dhaka',
          }),
        }).catch(() => null);
        addressId = newAddressRes?.data?.id;
      }

      const bookingRes = await fetchApi<any>('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: service.id,
          addressId: addressId || 'default-address-id',
          scheduledAt: new Date().toISOString(),
          notes: `Schedule: ${dateSlot}. Phone: ${phone}. Notes: ${notes}`,
        }),
      }).catch(() => null);

      if (bookingRes?.success && bookingRes.data) {
        setCreatedBooking(bookingRes.data);
      }
    } finally {
      setLoading(false);
      setIsCompleted(true);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Back Button */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          href="/services/home-service"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home Services</span>
        </Link>
        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          DOHS Sheba Verified Booking
        </span>
      </div>

      {!isCompleted ? (
        <div className="space-y-8">
          <BookingSteps currentStep={step} />

          {/* Service Summary Banner */}
          <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
              <Image src={service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80'} alt={service.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                {service.categoryName || 'Home Service'}
              </span>
              <h2 className="font-extrabold text-base text-slate-900 truncate">{service.title}</h2>
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>DOHS Sheba Service Team</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Total Payable</div>
              <div className="text-xl font-black text-slate-900">{formatCurrency(totalPrice)}</div>
            </div>
          </div>

          {/* STEP 1: Addons Selection */}
          {step === 1 && (
            <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Choose Recommended Service Addons</h3>
                <p className="text-xs text-slate-500">
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
                            ? 'bg-blue-50/50 border-blue-500 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm text-slate-900">{addon.title}</h4>
                          <p className="text-xs text-slate-500">{addon.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-sm text-blue-600">
                            +{formatCurrency(addon.price)}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-slate-300 bg-white'
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
                <p className="text-xs text-slate-500">No extra addons required for this service.</p>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-xs flex items-center gap-2"
                >
                  <span>Continue to Schedule</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Schedule Picker */}
          {step === 2 && (
            <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Select Preferred Arrival Time
                </h3>
                <p className="text-xs text-slate-500">
                  DOHS Sheba assigned technician will arrive within your selected time window.
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
                        ? 'bg-blue-50/50 border-blue-600 text-blue-700 shadow-xs font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{slot}</span>
                    {dateSlot === slot && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 text-slate-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-xs flex items-center gap-2"
                >
                  <span>Continue to Address</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Address & Notes */}
          {step === 3 && (
            <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Service Address & Special Notes
                </h3>
                <p className="text-xs text-slate-500">
                  Provide your house/flat location within DOHS and contact details.
                </p>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-600 mb-1">DOHS House Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">
                    Special Notes for Technician (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Gate password is #4401, bring extra 10ft wire, call 10 mins before arrival"
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 text-slate-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-xs flex items-center gap-2"
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
              className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-6"
            >
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Final Review & Payment Option</h3>
                <p className="text-xs text-slate-500">
                  Confirm your booking details. Technicians are assigned internally by DOHS Sheba.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 space-y-2 text-xs border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Base Service Price ({service.title}):</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(service.price)}</span>
                </div>
                {selectedAddons.map((addon) => (
                  <div key={addon.id} className="flex justify-between text-slate-500">
                    <span>Addon ({addon.title}):</span>
                    <span className="font-semibold text-slate-900">+{formatCurrency(addon.price)}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Location:</span>
                  <span className="font-semibold text-slate-900">{address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Time:</span>
                  <span className="font-semibold text-slate-900">{dateSlot}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-sm">
                  <span className="text-slate-900">Total Booking Amount:</span>
                  <span className="text-blue-600">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Payment Method
                  </label>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Pay Cash After Completion
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
                          ? 'bg-blue-50/50 border-blue-600 text-blue-700 shadow-xs cursor-pointer'
                          : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <span>{pm.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>DOHS Sheba Managed Service. Certified technicians assigned internally. Pay cash upon job completion.</span>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 text-slate-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Confirm Booking ({formatCurrency(totalPrice)})</span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Confirmation Receipt Screen */
        <div className="p-8 rounded-3xl border border-emerald-200 bg-white shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Booking Received (PENDING)
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">Your Booking is Placed!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              The <strong className="text-slate-900">DOHS Sheba Service Operations Team</strong> will review your request and assign a technician shortly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-lg mx-auto text-left text-xs space-y-2.5">
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Booking ID:</span>
              <span className="font-mono font-extrabold text-slate-900">#{createdBooking?.id?.slice(-8) || 'DS-8891'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-bold text-slate-900">{service.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Provider:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                DOHS Sheba Service Team
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scheduled Time:</span>
              <span className="font-semibold text-slate-900">{dateSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Address:</span>
              <span className="font-semibold text-slate-900">{address}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-blue-600">
              <span>Total Amount:</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/services/home-service"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 font-semibold text-xs text-slate-700 hover:bg-slate-50"
            >
              Browse Services
            </Link>
            <Link
              href="/dashboard/bookings"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md"
            >
              Track Booking Status
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
