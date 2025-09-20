import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HajjUmrahPage({ params: { locale } }: { params: { locale: string } }) {
  const packages = await prisma.package.findMany({
    where: { category: { key: 'religious' } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-brand-100 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-textdark">
          {locale === 'ar' ? 'برامج الحج والعمرة' : 'Hajj & Umrah Journeys'}
        </h1>
        <p className="mt-3 text-sm text-textdark/70">
          {locale === 'ar'
            ? 'باقات معتمدة تشمل السكن القريب من الحرم، الزيارات، وخيارات أقساط مرنة.'
            : 'Certified programs with near-Haram hotels, guided visits, and flexible installment options.'}
        </p>
        <div className="mt-6 rounded-3xl bg-brand-50 p-6 text-sm text-textdark">
          <p>{locale === 'ar' ? 'تقسيط بدون فوائد لمدة 6 أشهر على باقات العمرة المميزة.' : '0% installment plans over 6 months for premium Umrah packages.'}</p>
          <p className="mt-2">
            {locale === 'ar'
              ? 'إشعارات تلقائية عبر البريد والواتساب قبل السفر بـ 7 أيام و48 ساعة.'
              : 'Automated email & WhatsApp reminders 7 days and 48 hours before departure.'}
          </p>
        </div>
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        {packages.map((pkg) => (
          <article key={pkg.id} className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-textdark">{pkg.title}</h2>
            <p className="mt-2 text-sm text-textdark/70">{pkg.summary}</p>
            <ul className="mt-3 space-y-2 text-sm text-textdark/80">
              {pkg.inclusions.slice(0, 4).map((item) => (
                <li key={item} className="rounded-xl bg-brand-50 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={`/${locale}/packages/${pkg.slug}`}
              className="mt-4 inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
            >
              {locale === 'ar' ? 'تفاصيل البرنامج' : 'View program'}
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
