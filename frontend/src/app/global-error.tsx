'use client';

import React, { useEffect } from 'react';

/**
 * global-error.tsx — replaces the ENTIRE root layout on crash.
 * Must include its own <html> and <body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[DOHS Sheba GLOBAL ERROR]', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-white font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-100 shadow-2xl text-center space-y-6 mx-4">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#0E7A45] to-[#28A745] text-white font-black text-2xl flex items-center justify-center shadow-xl">
              dS
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">DOHS Sheba</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Application Error</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              {error?.message || 'A critical error occurred. Please reload the page.'}
            </p>
            {error?.digest && (
              <p className="text-[10px] text-slate-400 font-mono">Error ID: {error.digest}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 rounded-2xl bg-[#0E7A45] hover:bg-[#095A32] text-white font-extrabold text-sm shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm transition-colors"
            >
              Go to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
