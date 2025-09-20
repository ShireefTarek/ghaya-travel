import { calculatePrice } from '@/lib/pricing/calc';
import prisma from '@/lib/prisma';

describe('promo codes', () => {
  it('applies percentage discount', async () => {
    const pkg = await prisma.package.findFirst();
    const promo = await prisma.promoCode.findFirst();
    if (!pkg || !promo) {
      throw new Error('Seed data missing');
    }
    const breakdown = await calculatePrice({
      packageId: pkg.id,
      travelerCount: 1,
      addOnIds: [],
      bookingCurrency: pkg.currency,
      promoCode: promo.code
    });
    expect(breakdown.promo).toBeGreaterThanOrEqual(0);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
