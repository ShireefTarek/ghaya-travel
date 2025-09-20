import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string, locale = 'en-EG') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}
