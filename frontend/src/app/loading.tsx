import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl animate-bounce shadow-lg">
        dS
      </div>
      <p className="text-sm font-semibold text-muted-foreground animate-pulse">
        Loading dohsSheba Marketplace...
      </p>
    </div>
  );
}
