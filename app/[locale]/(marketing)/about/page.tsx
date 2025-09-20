import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale });
  const awards = [
    'Egyptian Tourism Excellence 2023',
    'Saudi Umrah Partner Certification',
    'IATA Accredited Agent'
  ];
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-brand-100 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-textdark">{locale === 'ar' ? 'من نحن' : 'About Ghaya Travel'}</h1>
        <p className="mt-4 text-textdark/70">
          {locale === 'ar'
            ? 'غاية للسياحة شركة مصرية تقدم تجارب سفر فاخرة، رحلات دينية منظمة، وخدمات مخصصة للشركات والأفراد منذ عام 2008.'
            : 'Ghaya Travel crafts luxury journeys, faith-based programs, and tailored corporate travel solutions since 2008.'}
        </p>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-textdark">{locale === 'ar' ? 'رؤيتنا' : 'Our Vision'}</h2>
          <p className="mt-2 text-sm text-textdark/70">
            {locale === 'ar'
              ? 'أن تكون غاية الشريك الأول للمسافرين العرب في تجارب راقية متوازنة بين المتعة والروحانية.'
              : 'To become the premier Egyptian travel house balancing indulgence with spiritual depth for modern travelers.'}
          </p>
        </div>
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-textdark">{locale === 'ar' ? 'رسالتنا' : 'Our Mission'}</h2>
          <p className="mt-2 text-sm text-textdark/70">
            {locale === 'ar'
              ? 'نوفر رحلات مصممة بعناية مع دعم 24/7 وفريق متعدد اللغات لضمان رحلة سلسة وآمنة.'
              : 'Deliver meticulously designed itineraries backed by multilingual experts and 24/7 concierge support.'}
          </p>
        </div>
      </section>
      <section className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-textdark">{locale === 'ar' ? 'شهادات وجوائز' : 'Awards & Certifications'}</h2>
        <ul className="mt-4 grid gap-3 text-sm text-textdark/80">
          {awards.map((award) => (
            <li key={award} className="rounded-2xl bg-brand-50 px-4 py-3">{award}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
