import FlightSearch from '@/components/flight/flight-search';

export const dynamic = 'force-dynamic';

export default function FlightsPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-brand-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-textdark">{locale === 'ar' ? 'حجز الطيران' : 'Flights search'}</h1>
        <p className="mt-2 text-sm text-textdark/70">
          {locale === 'ar'
            ? 'ابحث عن رحلات ذهاب وعودة أو متعددة المسارات مع اختيار المقاعد داخل الموقع.'
            : 'Search one-way, return, or multi-city flights and select seats within the site.'}
        </p>
      </header>
      <FlightSearch locale={locale} />
    </div>
  );
}
