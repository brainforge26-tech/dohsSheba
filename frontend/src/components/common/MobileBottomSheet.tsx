'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function MobileBottomSheet({ isOpen, onClose, title, children }: MobileBottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-Up Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#1e1f32] border-t border-white/10 rounded-t-3xl p-5 pb-safe max-h-[85vh] overflow-y-auto shadow-2xl space-y-4"
          >
            {/* Drag Handle Bar */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-2" />

            {/* Sheet Header */}
            {title && (
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-black text-white text-base tracking-tight">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Sheet Body */}
            <div>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
