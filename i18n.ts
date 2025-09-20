export const locales = ['ar', 'en'] as const;
export const defaultLocale = 'ar';

export type Locale = (typeof locales)[number];

export const localePrefix = 'as-needed';

export const pathnames = {
  '/': '/',
  '/about': {
    ar: '/about',
    en: '/about'
  },
  '/packages': {
    ar: '/packages',
    en: '/packages'
  },
  '/hajj-umrah': {
    ar: '/hajj-umrah',
    en: '/hajj-umrah'
  },
  '/flights': {
    ar: '/flights',
    en: '/flights'
  },
  '/blog': {
    ar: '/blog',
    en: '/blog'
  },
  '/contact': {
    ar: '/contact',
    en: '/contact'
  }
} as const;
