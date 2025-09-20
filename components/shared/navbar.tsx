'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import LocaleSwitcher from './locale-switcher';

interface NavbarProps {
  locale: string;
  topSlot?: React.ReactNode;
  children?: React.ReactNode;
}

const navLinks = [
  { href: '', key: 'home' },
  { href: 'about', key: 'about' },
  { href: 'packages', key: 'packages' },
  { href: 'hajj-umrah', key: 'hajjUmrah' },
  { href: 'flights', key: 'flights' },
  { href: 'blog', key: 'blog' },
  { href: 'contact', key: 'contact' }
];

export default function Navbar({ locale, topSlot, children }: NavbarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-surface shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center justify-center rounded-md border border-brand-200 bg-white p-2 text-brand-700 lg:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href={`/${locale}`} className="text-xl font-semibold text-textdark">
            Ghaya Travel
          </Link>
        </div>
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const href = `/${locale}/${link.href}`.replace(/\/$/, '');
            const active = pathname === href || pathname?.startsWith(href + '/');
            return (
              <Link
                key={link.key}
                href={href || `/${locale}`}
                className={cn(
                  'text-sm font-medium transition-colors',
                  active ? 'text-accent-600' : 'text-textdark hover:text-brand-700'
                )}
              >
                {t(link.key as any)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          {children}
          {topSlot || <LocaleSwitcher currentLocale={locale} />}
        </div>
      </div>
      {open && (
        <div className="border-t border-brand-100 bg-white p-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const href = `/${locale}/${link.href}`.replace(/\/$/, '');
              return (
                <Link
                  key={link.key}
                  href={href || `/${locale}`}
                  className="text-base font-medium text-textdark"
                  onClick={() => setOpen(false)}
                >
                  {t(link.key as any)}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
