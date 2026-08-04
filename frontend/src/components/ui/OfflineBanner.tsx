'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-950 text-white shadow-2xl border border-slate-800 flex items-center gap-3 text-xs font-bold"
      >
        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
          <WifiOff className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <p className="text-slate-200 font-extrabold">No Internet Connection</p>
          <p className="text-[10px] text-slate-400 font-normal">Check your connection to continue using DOHS Sheba</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="ml-2 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
