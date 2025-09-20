import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { packageMetadata } from '@/lib/seo/metadata';
import { productJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import PriceBreakdown from '@/components/checkout/price-breakdown';
import { calculatePrice } from '@/lib/pricing/calc';
import Link from 'next/link';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { formatCurrency } from '@/lib/utils';
import VirtualTour from '@/components/shared/virtual-tour';

const Map = dynamic(() => import('@/components/shared/map'), { ssr: false, loading: () => <div>Loading map…</div> });

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  const pkg = await prisma.package.findUnique({ where: { slug } });
  if (!pkg) return {};
  return packageMetadata(pkg);
}

export default async function PackageDetail({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: {
      itineraryItems: true,
      addOns: true,
      destinations: true,
      reviews: {
        where: { status: 'approved' },
        take: 6,
        include: { user: true }
      }
    }
  });

  if (!pkg) {
    notFound();
  }

  const breakdown = await calculatePrice({
    packageId: pkg.id,
    travelerCount: 2,
    bookingCurrency: pkg.currency
  });

  const faq = Array.isArray(pkg.faq) ? (pkg.faq as any[]) : [];

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...productJsonLd(pkg),
            breadcrumb: breadcrumbJsonLd([
              { name: 'Home', item: '/' },
              { name: 'Packages', item: '/packages' },
              { name: pkg.title, item: `/packages/${pkg.slug}` }
            ]),
            faq: faqJsonLd(
              faq.map((item: any) => ({
                question: item.question || item.q,
                answer: item.answer || item.a
              }))
            )
          })
        }}
      />
      <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={pkg.coverImage || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'}
              alt={pkg.title}
              className="h-72 w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-textdark">{pkg.title}</h1>
            <p className="text-textdark/70">{pkg.summary}</p>
            <div className="flex flex-wrap gap-3 text-sm text-textdark">
              {pkg.highlights.map((highlight) => (
                <span key={highlight} className="rounded-full bg-brand-50 px-3 py-1">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-textdark">
              {locale === 'ar' ? 'المشتملات' : 'Inclusions'}
            </h2>
            <ul className="grid gap-2 text-sm text-textdark/80">
              {pkg.inclusions.map((item) => (
                <li key={item} className="rounded-xl bg-white p-3 shadow-sm">
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-textdark">
              {locale === 'ar' ? 'البرنامج اليومي' : 'Itinerary'}
            </h2>
            <ol className="space-y-3 text-sm text-textdark/80">
              {pkg.itineraryItems
                .sort((a, b) => a.dayNumber - b.dayNumber)
                .map((item) => (
                  <li key={item.id} className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase text-brand-600">
                      {locale === 'ar' ? `اليوم ${item.dayNumber}` : `Day ${item.dayNumber}`}
                    </p>
                    <h3 className="text-lg font-semibold text-textdark">{item.title}</h3>
                    <p>{item.description}</p>
                  </li>
                ))}
            </ol>
          </section>
          {pkg.virtualTourUrl && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-textdark">
                {locale === 'ar' ? 'جولة افتراضية' : 'Virtual Tour'}
              </h2>
              <VirtualTour url={pkg.virtualTourUrl} />
            </section>
          )}
          {pkg.destinations.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-textdark">
                {locale === 'ar' ? 'الوجهات' : 'Destinations'}
              </h2>
              <Suspense fallback={<div>Loading map…</div>}>
                <Map destinations={pkg.destinations} apiKey={process.env.GOOGLE_MAPS_API_KEY} />
              </Suspense>
            </section>
          )}
        </div>
        <aside className="space-y-6">
          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-lg">
            <p className="text-sm text-textdark/70">
              {locale === 'ar' ? 'يبدأ السعر من' : 'Starting from'}
            </p>
            <p className="text-3xl font-bold text-accent">
              {formatCurrency(pkg.basePrice, pkg.currency, locale === 'ar' ? 'ar-EG' : 'en-EG')}
            </p>
            <Link
              href={`/${locale}/checkout?packageId=${pkg.id}`}
              className="mt-4 block rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-white hover:bg-accent-600"
            >
              {locale === 'ar' ? 'ابدأ الحجز' : 'Start booking'}
            </Link>
          </div>
          <PriceBreakdown breakdown={breakdown} currency={pkg.currency} locale={locale} />
        </aside>
      </div>
    </div>
  );
}
