'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-background text-foreground">
      <div className="w-full max-w-md p-8 rounded-3xl border border-border bg-card shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black">Reset Password</h1>
          <p className="text-xs text-muted-foreground">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {sent ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
              Reset Link Sent!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              We have sent password reset instructions to <strong>{email}</strong>.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md mt-2"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-muted-foreground mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Send Reset Instructions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-muted-foreground">
          Remembered password?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
