import { calculatePrice } from '@/lib/pricing/calc';
import prisma from '@/lib/prisma';

describe('pricing calculations', () => {
  it('returns breakdown with add-ons and seats', async () => {
    const pkg = await prisma.package.findFirst({ include: { addOns: true } });
    if (!pkg) {
      throw new Error('Seed package missing');
    }
    const baseBreakdown = await calculatePrice({
      packageId: pkg.id,
      travelerCount: 2,
      addOnIds: pkg.addOns.slice(0, 1).map((a: any) => a.id),
      bookingCurrency: pkg.currency
    });
    const seatBreakdown = await calculatePrice({
      packageId: pkg.id,
      travelerCount: 2,
      addOnIds: pkg.addOns.slice(0, 1).map((a: any) => a.id),
      bookingCurrency: pkg.currency,
      seatSelections: [
        { seatId: '1A', label: '1A', price: 25, currency: pkg.currency }
      ]
    });
    expect(seatBreakdown.total).toBeGreaterThan(0);
    expect(seatBreakdown.addOns.length).toBeGreaterThanOrEqual(0);
    const seatLine = seatBreakdown.seats.find((seat) => seat.seatId === '1A');
    expect(seatLine).toBeDefined();
    expect(Math.round(seatLine!.total)).toBeGreaterThanOrEqual(25);
    const subtotalDiff = seatBreakdown.subtotal - baseBreakdown.subtotal;
    expect(Math.round(subtotalDiff)).toBe(Math.round(seatLine!.total));
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
