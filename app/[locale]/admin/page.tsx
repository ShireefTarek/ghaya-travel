import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['admin', 'editor', 'support'].includes(session.user.role ?? '')) {
    redirect(`/${locale}/auth/login`);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingsToday = await prisma.booking.count({
    where: {
      createdAt: { gte: today }
    }
  });
  const revenue = await prisma.booking.aggregate({
    _sum: { total: true }
  });
  const promoCodes = await prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
  const currencyRates = await prisma.currencyRate.findMany({ orderBy: { updatedAt: 'desc' }, take: 5 });

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-brand-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-textdark">{locale === 'ar' ? 'لوحة التحكم' : 'Admin dashboard'}</h1>
      </header>
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-textdark/70">{locale === 'ar' ? 'حجوزات اليوم' : 'Bookings today'}</p>
          <p className="text-3xl font-bold text-accent">{bookingsToday}</p>
        </div>
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-textdark/70">{locale === 'ar' ? 'إجمالي الإيرادات' : 'Total revenue'}</p>
          <p className="text-3xl font-bold text-accent">
            {formatCurrency(revenue._sum.total ?? 0, 'EGP', locale === 'ar' ? 'ar-EG' : 'en-EG')}
          </p>
        </div>
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-textdark/70">{locale === 'ar' ? 'أحدث الأكواد' : 'Recent promos'}</p>
          <ul className="mt-2 space-y-1 text-sm text-textdark/70">
            {promoCodes.map((promo) => (
              <li key={promo.id}>
                {promo.code} · {promo.type} {promo.value}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-textdark">{locale === 'ar' ? 'أسعار الصرف' : 'Currency rates'}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-textdark/70">
                <th className="px-4 py-2">Code</th>
                <th className="px-4 py-2">Rate to EGP</th>
                <th className="px-4 py-2">Manual?</th>
              </tr>
            </thead>
            <tbody>
              {currencyRates.map((rate) => (
                <tr key={rate.id} className="border-t border-brand-100">
                  <td className="px-4 py-2">{rate.code}</td>
                  <td className="px-4 py-2">{rate.rateToEGP}</td>
                  <td className="px-4 py-2">{rate.manual ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
