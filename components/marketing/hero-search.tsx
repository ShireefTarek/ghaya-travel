'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  locale: string;
  placeholderPackages: string;
  placeholderFlights: string;
  cta: string;
}

export default function HeroSearch({ locale, placeholderPackages, placeholderFlights, cta }: Props) {
  const [searchType, setSearchType] = useState<'packages' | 'flights'>('packages');
  const [query, setQuery] = useState('');
  const router = useRouter();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (searchType === 'packages') {
      router.push(`/${locale}/packages?query=${encodeURIComponent(query)}`);
    } else {
      router.push(`/${locale}/flights?query=${encodeURIComponent(query)}`);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-3xl border border-brand-100 bg-white/80 p-4 shadow-lg backdrop-blur"
    >
      <div className="flex rounded-full bg-brand-50 p-1 text-sm font-medium text-brand-700">
        <button
          type="button"
          onClick={() => setSearchType('packages')}
          className={`flex-1 rounded-full px-4 py-2 ${
            searchType === 'packages' ? 'bg-brand text-white shadow' : ''
          }`}
        >
          {locale === 'ar' ? 'الباقات' : 'Packages'}
        </button>
        <button
          type="button"
          onClick={() => setSearchType('flights')}
          className={`flex-1 rounded-full px-4 py-2 ${searchType === 'flights' ? 'bg-brand text-white shadow' : ''}`}
        >
          {locale === 'ar' ? 'الطيران' : 'Flights'}
        </button>
      </div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchType === 'packages' ? placeholderPackages : placeholderFlights}
        className="w-full rounded-2xl border border-brand-200 px-4 py-3 text-base shadow-inner focus:border-brand-600 focus:outline-none"
        aria-label={locale === 'ar' ? 'حقل البحث' : 'Search field'}
      />
      <button
        type="submit"
        className="rounded-2xl bg-accent px-4 py-3 text-base font-semibold text-white shadow-md transition hover:bg-accent-600"
      >
        {cta}
      </button>
    </form>
  );
}
