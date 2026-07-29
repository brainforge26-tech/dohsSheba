import React from 'react';
import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center space-y-5">
      <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center text-primary">
        <Compass className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <span className="text-4xl font-black text-primary">404</span>
        <h2 className="text-2xl font-extrabold">Page Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          The service or shopping page you are looking for might have been moved or does not exist.
        </p>
      </div>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
