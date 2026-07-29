import React from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-background text-foreground">
      <div className="w-full max-w-md p-8 rounded-3xl border border-border bg-card shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black">Verify Your Email</h1>
          <p className="text-xs text-muted-foreground">
            We sent a verification link to your email address. Please click the link to activate your dohsSheba account.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-block px-8 py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md"
        >
          Proceed to Login
        </Link>
      </div>
    </div>
  );
}
