import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import PackageCard from '@/components/marketing/package-card';

export default async function WishlistPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }
  const wishlist = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: { package: true }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-textdark">{locale === 'ar' ? 'المفضلة' : 'Wishlist'}</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {wishlist.map((item) => (
          <PackageCard key={item.id} locale={locale} pkg={item.package} />
        ))}
      </div>
      {wishlist.length === 0 && (
        <p className="rounded-3xl border border-dashed border-brand-200 p-6 text-center text-textdark/70">
          {locale === 'ar' ? 'لم تقم بإضافة أي باقات بعد.' : 'You have no saved packages yet.'}
        </p>
      )}
    </div>
  );
}
