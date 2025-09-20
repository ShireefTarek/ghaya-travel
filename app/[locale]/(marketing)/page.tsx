import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import PackageCard from '@/components/marketing/package-card';
import HeroSearch from '@/components/marketing/hero-search';
import WhatsAppChip from '@/components/shared/whatsapp-chip';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const packages = await prisma.package.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' }
  });
  const posts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    take: 3,
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-accent text-white shadow-xl">
        <div className="grid gap-8 p-10 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold leading-snug md:text-4xl">
              {locale === 'ar' ? 'اكتشف مصر والعالم مع غاية للسياحة' : 'Discover Egypt & Beyond with Ghaya Travel'}
            </h1>
            <p className="text-base text-white/90">
              {locale === 'ar'
                ? 'رحلات مصممة بعناية تجمع بين الراحة، الأصالة، وخدمة عملاء على مدار الساعة.'
                : 'Curated journeys blending comfort, authenticity, and on-demand travel concierge support.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/packages`}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-accent shadow-md transition hover:bg-accent-50"
              >
                {locale === 'ar' ? 'تصفح الباقات' : 'Browse Packages'}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                {locale === 'ar' ? 'تواصل مع مستشارك' : 'Speak to an advisor'}
              </Link>
            </div>
          </div>
          <HeroSearch
            locale={locale}
            placeholderPackages={t('search.packagesPlaceholder')}
            placeholderFlights={t('search.flightsPlaceholder')}
            cta={t('search.submit')}
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-textdark">{t('featured')}</h2>
          <Link href={`/${locale}/packages`} className="text-sm font-semibold text-brand-700 hover:text-accent-600">
            {locale === 'ar' ? 'عرض الكل' : 'View all'}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} locale={locale} pkg={pkg} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-textdark">{t('blog')}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-brand-700">
                {post.publishedAt ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', { dateStyle: 'medium' }).format(post.publishedAt) : ''}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-textdark">
                {locale === 'ar' ? post.titleAr : post.titleEn}
              </h3>
              <p className="mt-2 text-sm text-textdark/70">
                {locale === 'ar' ? post.summaryAr : post.summaryEn}
              </p>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="mt-4 inline-flex items-center text-sm font-semibold text-accent hover:text-accent-600"
              >
                {locale === 'ar' ? 'اقرأ المزيد' : 'Read more'}
              </Link>
            </article>
          ))}
        </div>
      </section>
      <WhatsAppChip label={t('hero.whatsapp')} />
    </div>
  );
}
