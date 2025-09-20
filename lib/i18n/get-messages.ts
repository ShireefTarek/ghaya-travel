import { cache } from 'react';
import { defaultLocale, locales, type Locale } from '@/../i18n';
import ar from '@/messages/ar.json';
import en from '@/messages/en.json';

const store: Record<Locale, any> = {
  ar,
  en
};

export const getMessages = cache(async (locale: string) => {
  const normalized = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
  return store[normalized];
});
