import React from 'react';
import { MapPin, PhoneCall, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="py-12 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 w-full max-w-[1720px] mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
          Get In Touch
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Contact DOHS Support Hub</h1>
        <p className="text-sm text-muted-foreground">
          Have questions about a service booking, order status, or becoming a provider partner? Our team is ready 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-border bg-card space-y-4 shadow-card">
            <h3 className="font-bold text-base">Contact Information</h3>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span>House 14, Road 3, Mohakhali DOHS, Dhaka 1206</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>Hotline: +880 1700-112233</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span>Email: support@dohssheba.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span>Support Hours: 24 Hours / 7 Days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 p-8 rounded-3xl border border-border bg-card shadow-card space-y-6">
          <h3 className="font-bold text-xl">Send Us a Direct Message</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lt Col (Retd) Tariq"
                  className="w-full h-11 px-3.5 rounded-xl border border-input bg-background font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="tariq@example.com"
                  className="w-full h-11 px-3.5 rounded-xl border border-input bg-background font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Subject</label>
              <input
                type="text"
                placeholder="Inquiry about AC Service / Grocery Delivery"
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-background font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Your Message</label>
              <textarea
                rows={4}
                placeholder="Write your query or feedback here..."
                className="w-full p-3.5 rounded-xl border border-input bg-background font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="button"
              className="py-3 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
