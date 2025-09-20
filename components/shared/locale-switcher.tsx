'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Props {
  currentLocale: string;
}

export default function LocaleSwitcher({ currentLocale }: Props) {
  const pathname = usePathname();
  const segments = pathname?.split('/') ?? [];
  segments[1] = currentLocale === 'ar' ? 'en' : 'ar';
  const otherLocale = currentLocale === 'ar' ? 'en' : 'ar';
  const newPath = segments.join('/') || '/';

  return (
    <Link
      href={newPath}
      className="rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold uppercase text-brand-700 hover:bg-brand-50"
    >
      {otherLocale === 'ar' ? 'العربية' : 'English'}
    </Link>
  );
}
