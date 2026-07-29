import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount?: number | null): string {
  const val = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return `৳${val.toLocaleString('en-BD')}`;
}
