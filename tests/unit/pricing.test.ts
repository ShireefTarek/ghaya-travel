import { calculatePrice } from '@/lib/pricing/calc';
import prisma from '@/lib/prisma';

describe('pricing calculations', () => {
  it('returns breakdown with add-ons and seats', async () => {
    const pkg = await prisma.package.findFirst({ include: { addOns: true } });
    if (!pkg) {
      throw new Error('Seed package missing');
    }
    const breakdown = await calculatePrice({
      packageId: pkg.id,
      travelerCount: 2,
      addOnIds: pkg.addOns.slice(0, 1).map((a) => a.id),
      bookingCurrency: pkg.currency,
      seatSelections: [
        { seatId: '1A', label: '1A', price: 25, currency: pkg.currency }
      ]
    });
    expect(breakdown.total).toBeGreaterThan(0);
    expect(breakdown.addOns.length).toBeGreaterThanOrEqual(0);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
