import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default async function AccountDashboard({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }
  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { package: true, invoice: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-brand-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-textdark">
          {locale === 'ar' ? 'حجوزاتي' : 'My bookings'}
        </h1>
      </header>
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <article key={booking.id} className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-textdark">{booking.package?.title}</h2>
                <p className="text-sm text-textdark/70">
                  {locale === 'ar' ? 'الحالة' : 'Status'}: {booking.status}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-accent">
                  {formatCurrency(booking.total, booking.currency, locale === 'ar' ? 'ar-EG' : 'en-EG')}
                </p>
                {booking.invoice && (
                  <a
                    href={booking.invoice.pdfUrl}
                    className="text-sm font-semibold text-brand-700 hover:text-accent-600"
                  >
                    {locale === 'ar' ? 'تحميل الفاتورة' : 'Download invoice'}
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
        {bookings.length === 0 && (
          <p className="rounded-3xl border border-dashed border-brand-200 p-6 text-center text-textdark/70">
            {locale === 'ar'
              ? 'لا توجد حجوزات حتى الآن. تصفح باقاتنا وابدأ رحلتك.'
              : 'No bookings yet. Explore our packages and start your journey.'}
          </p>
        )}
      </div>
    </div>
  );
}
