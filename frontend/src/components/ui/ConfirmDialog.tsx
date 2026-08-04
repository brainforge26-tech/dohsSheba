'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X, Info, LogOut } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'info';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_CONFIG = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    confirmBg: 'bg-red-600 hover:bg-red-700 active:bg-red-800',
    badge: 'bg-red-50 text-red-700 border border-red-200',
    defaultTitle: 'Delete Confirmation',
    defaultConfirm: 'Delete',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    confirmBg: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    defaultTitle: 'Are you sure?',
    defaultConfirm: 'Proceed',
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    confirmBg: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
    defaultTitle: 'Confirm Action',
    defaultConfirm: 'Confirm',
  },
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
      />

      {/* Dialog Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in-95 fade-in duration-200 overflow-hidden">
        
        {/* Top accent bar */}
        <div className={`h-1 w-full ${variant === 'danger' ? 'bg-red-500' : variant === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 space-y-5">
          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl ${config.iconBg} shrink-0`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="pt-0.5 min-w-0">
              <h2
                id="confirm-title"
                className="text-base font-black text-slate-900 tracking-tight"
              >
                {title || config.defaultTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Warning note for danger */}
          {variant === 'danger' && (
            <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${config.badge}`}>
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>This action is permanent and cannot be undone.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onCancel}
              className="flex-1 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all active:scale-95 cursor-pointer border border-slate-200"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all active:scale-95 cursor-pointer shadow-sm ${config.confirmBg}`}
            >
              {confirmText || config.defaultConfirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
