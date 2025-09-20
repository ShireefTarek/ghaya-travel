import prisma from '@/lib/prisma';
import BookingWizard from '@/components/forms/booking-wizard';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
  params: { locale },
  searchParams
}: {
  params: { locale: string };
  searchParams: { packageId?: string };
}) {
  if (!searchParams.packageId) {
    notFound();
  }
  const pkg = await prisma.package.findUnique({
    where: { id: searchParams.packageId },
    include: { addOns: true, destinations: true }
  });
  if (!pkg) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-textdark">
        {locale === 'ar' ? 'إتمام الحجز' : 'Complete your booking'}
      </h1>
      <BookingWizard locale={locale} pkg={pkg} />
    </div>
  );
}
