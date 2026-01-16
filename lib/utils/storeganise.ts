// lib/utils/storeganise.ts
import { LocalizedString } from '@/lib/interfaces/LocalizedString';

/**
 * Extracts the string value from a LocalizedString object or returns the string itself if it's already a string.
 * Defaults to 'en' locale.
 */
export function getLocalizedValue(val: LocalizedString | string | undefined, locale: string = 'en'): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val[locale] || Object.values(val)[0] || '';
}

/**
 * Formats a price with the currency symbol.
 */
export function formatPrice(amount: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}
