import createIntlMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n';
import { NextResponse } from 'next/server';
import { createSecureHeaders } from 'next-secure-headers';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export function middleware(request: Request) {
  const response = intlMiddleware(request);
  const secureHeaders = createSecureHeaders({
    frameGuard: 'deny',
    noopen: 'noopen',
    nosniff: 'nosniff',
    referrerPolicy: 'same-origin',
    forceHTTPSRedirect: [true, { maxAge: 63072000, includeSubDomains: true }],
    xssProtection: 'sanitize'
  });
  const nextResponse = NextResponse.next();
  Object.entries(secureHeaders).forEach(([key, value]) => {
    nextResponse.headers.set(key, value as string);
  });
  return response ?? nextResponse;
}

export const config = {
  matcher: ['/((?!_next|.*\..*).*)']
};
