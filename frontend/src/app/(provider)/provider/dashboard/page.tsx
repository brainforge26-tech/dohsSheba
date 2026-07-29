'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { formatCurrency } from '@/utils/cn';
import { DollarSign, CheckCircle2, Clock, Star, MapPin, Check, X, PhoneCall } from 'lucide-react';

export default function ProviderDashboardOverview() {
  const [requests, setRequests] = useState([
    {
      id: '#DOHS-BS-8891',
      service: 'AC Jet Cleaning & Master Servicing',
      customer: 'Lt Col (Retd) Tariq Ahmed',
      phone: '+880 1711-223344',
      time: 'Today, 3:00 PM',
      location: 'House 42, Road 7, Mohakhali DOHS',
      price: 1200,
    },
    {
      id: '#DOHS-BS-8895',
      service: 'AC Gas Refill & Pressure Checkup',
      customer: 'Dr. Shahana Parveen',
      phone: '+880 1812-998877',
      time: 'Tomorrow, 10:00 AM',
      location: 'House 14, Road 3, Baridhara DOHS',
      price: 800,
    },
  ]);

  const handleAccept = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Provider Business Dashboard"
        subtitle="Manage incoming job requests, service schedules, and wallet earnings."
      />

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl border border-border bg-card shadow-card space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Today's Net Earnings</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{formatCurrency(4200)}</div>
            <div className="text-[11px] text-emerald-600 font-semibold">+18% vs yesterday</div>
          </div>

          <div className="p-5 rounded-3xl border border-border bg-card shadow-card space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Jobs Completed</span>
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-foreground">145 Jobs</div>
            <div className="text-[11px] text-muted-foreground">100% On-time completion</div>
          </div>

          <div className="p-5 rounded-3xl border border-border bg-card shadow-card space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Average Rating</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-500">4.9 ★</div>
            <div className="text-[11px] text-muted-foreground">320 Reviews</div>
          </div>

          <div className="p-5 rounded-3xl border border-border bg-card shadow-card space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Pending Requests</span>
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-purple-600">{requests.length} New</div>
            <div className="text-[11px] font-semibold text-purple-600">Requires action</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-border bg-card shadow-card space-y-4">
          <h2 className="font-extrabold text-base">Incoming DOHS Service Requests</h2>

          {requests.length === 0 ? (
            <p className="text-xs text-muted-foreground p-4 text-center">No pending job requests.</p>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl border border-border/80 bg-secondary/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                >
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary">{req.id}</span>
                      <span className="font-bold text-foreground">{req.service}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-3">
                      <span>Customer: <strong>{req.customer}</strong></span>
                      <span className="flex items-center gap-1">
                        <PhoneCall className="w-3 h-3 text-emerald-500" />
                        {req.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground pt-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{req.time}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{req.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-border pt-2 md:pt-0">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Job Value</div>
                      <div className="text-lg font-black text-emerald-600">{formatCurrency(req.price)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 font-bold"
                        title="Decline"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 shadow-md flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Job</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
