import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Package } from '@prisma/client';

interface Props {
  locale: string;
  pkg: Pick<Package, 'id' | 'slug' | 'title' | 'summary' | 'coverImage' | 'basePrice' | 'currency' | 'durationDays'>;
}

export default function PackageCard({ locale, pkg }: Props) {
  return (
    <article className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={pkg.coverImage || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'}
          alt={pkg.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="space-y-3 p-6">
        <h3 className="text-lg font-semibold text-textdark">{pkg.title}</h3>
        <p className="text-sm text-textdark/70 overflow-hidden">{pkg.summary}</p>
        <div className="flex items-center justify-between text-sm font-medium text-textdark">
          <span>{locale === 'ar' ? `${pkg.durationDays} يوم` : `${pkg.durationDays} days`}</span>
          <span>{formatCurrency(pkg.basePrice, pkg.currency, locale === 'ar' ? 'ar-EG' : 'en-EG')}</span>
        </div>
        <Link
          href={`/${locale}/packages/${pkg.slug}`}
          className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
        >
          {locale === 'ar' ? 'استكشف الباقة' : 'View package'}
        </Link>
      </div>
    </article>
  );
}
