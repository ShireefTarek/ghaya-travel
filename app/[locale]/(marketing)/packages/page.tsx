import prisma from '@/lib/prisma';
import PackageCard from '@/components/marketing/package-card';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string };
  searchParams?: Record<string, string | string[]>;
}

export default async function PackagesPage({ params: { locale }, searchParams }: Props) {
  const t = await getTranslations({ locale, namespace: 'packages' });
  const category = typeof searchParams?.category === 'string' ? searchParams?.category : undefined;
  const destination =
    typeof searchParams?.destination === 'string' ? searchParams?.destination : undefined;

  const packages = await prisma.package.findMany({
    where: {
      ...(category
        ? {
            category: {
              key: category as any
            }
          }
        : {}),
      ...(destination
        ? {
            destinations: {
              some: {
                name: destination
              }
            }
          }
        : {})
    },
    include: {
      category: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-textdark">{t('filters.apply')}</h1>
        <p className="text-sm text-textdark/70">
          {locale === 'ar'
            ? 'استكشف باقات مخصصة عبر الوجهات، الرحلات البحرية، العمرة، والمزيد.'
            : 'Explore tailored journeys across Egypt, cruises, Umrah, and beyond.'}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} locale={locale} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}
