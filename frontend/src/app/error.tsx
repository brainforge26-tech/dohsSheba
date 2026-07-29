'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {error.message || 'An unexpected error occurred while loading this page.'}
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
