'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function LoadingButton({
  children,
  isLoading = false,
  loadingText,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  onClick,
  ...props
}: LoadingButtonProps) {
  const [clicked, setClicked] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || clicked || disabled) {
      e.preventDefault();
      return;
    }
    setClicked(true);
    setTimeout(() => setClicked(false), 1000); // Throttling
    if (onClick) onClick(e);
  };

  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98] select-none';

  const variantStyles = {
    primary:
      'bg-[#0E7A45] hover:bg-[#095A32] text-white shadow-md hover:shadow-lg shadow-[#0E7A45]/20 border border-transparent',
    secondary:
      'bg-slate-900 hover:bg-black text-white shadow-sm border border-transparent',
    outline:
      'border border-slate-200 hover:border-[#0E7A45] bg-white text-slate-700 hover:text-[#0E7A45] hover:bg-emerald-50/50',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-transparent',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{loadingText || 'Processing...'}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
