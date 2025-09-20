import prisma from '@/lib/prisma';
import { convertCurrency } from './rates';
export type PricingInput = {
  packageId: string;
  travelerCount: number;
  addOnIds?: string[];
  bookingCurrency: string;
  promoCode?: string;
  flightSelection?: {
    price: number;
    currency: string;
  };
  seatSelections?: {
    seatId: string;
    label: string;
    price: number;
    currency: string;
  }[];
  travelDate?: string;
};

export type PricingBreakdown = {
  basePrice: number;
  baseCurrency: string;
  convertedBase: number;
  addOns: {
    id: string;
    title: string;
    total: number;
  }[];
  flight?: {
    total: number;
    details: string;
  };
  seats: {
    seatId: string;
    label: string;
    total: number;
  }[];
  markup?: number;
  promo?: number;
  subtotal: number;
  taxes: number;
  fees: number;
  total: number;
};

async function applySeasonalMarkup(pkgId: string, travelDate?: string) {
  if (!travelDate) return 0;
  const rule = await prisma.pricingRule.findFirst({
    where: {
      packageId: pkgId,
      startsAt: { lte: new Date(travelDate) },
      endsAt: { gte: new Date(travelDate) }
    }
  });
  if (!rule) return 0;
  return rule.percent;
}

async function resolvePromo(code?: string) {
  if (!code) return null;
  const promo = await prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } });
  if (!promo) return null;
  const now = new Date();
  if ((promo.validFrom && promo.validFrom > now) || (promo.validTo && promo.validTo < now)) {
    return null;
  }
  if (promo.maxRedemptions && promo.usedCount >= promo.maxRedemptions) {
    return null;
  }
  return promo;
}

export async function calculatePrice(input: PricingInput): Promise<PricingBreakdown> {
  const pkg = await prisma.package.findUnique({
    where: { id: input.packageId },
    include: {
      addOns: true
    }
  });
  if (!pkg) {
    throw new Error('Package not found');
  }
  const travelerCount = Math.max(1, input.travelerCount);
  const base = pkg.basePrice * travelerCount;
  const convertedBase = await convertCurrency(base, pkg.currency, input.bookingCurrency);

  const addOns = (input.addOnIds || [])
    .map((id) => pkg.addOns.find((a) => a.id === id))
    .filter(Boolean)
    .map((addOn) => ({
      id: addOn!.id,
      title: addOn!.title,
      total: addOn!.price * travelerCount
    }));

  const convertedAddOns = await Promise.all(
    addOns.map(async (item) => ({
      ...item,
      total: await convertCurrency(item.total, pkg.currency, input.bookingCurrency)
    }))
  );

  let flightLine: PricingBreakdown['flight'];
  if (input.flightSelection) {
    flightLine = {
      total: await convertCurrency(
        input.flightSelection.price,
        input.flightSelection.currency,
        input.bookingCurrency
      ),
      details: 'Flight integration'
    };
  }

  const seatLines = await Promise.all(
    (input.seatSelections || []).map(async (seat) => ({
      seatId: seat.seatId,
      label: seat.label,
      total: await convertCurrency(seat.price, seat.currency, input.bookingCurrency)
    }))
  );

  const seasonalPercent = await applySeasonalMarkup(pkg.id, input.travelDate);
  const promo = await resolvePromo(input.promoCode);

  const subtotal = [convertedBase, ...convertedAddOns.map((i) => i.total), seatLines.reduce((acc, seat) => acc + seat.total, 0), flightLine?.total || 0].reduce(
    (acc, val) => acc + val,
    0
  );

  const markupAmount = seasonalPercent ? (subtotal * seasonalPercent) / 100 : 0;
  let promoAmount = 0;
  if (promo) {
    promoAmount =
      promo.type === 'percent'
        ? ((subtotal + markupAmount) * promo.value) / 100
        : await convertCurrency(promo.value, pkg.currency, input.bookingCurrency);
  }
  const adjustedSubtotal = subtotal + markupAmount - promoAmount;
  const taxes = adjustedSubtotal * 0.05;
  const fees = 50;
  const total = adjustedSubtotal + taxes + fees;

  return {
    basePrice: base,
    baseCurrency: pkg.currency,
    convertedBase,
    addOns: convertedAddOns,
    flight: flightLine,
    seats: seatLines,
    markup: markupAmount,
    promo: promoAmount,
    subtotal,
    taxes,
    fees,
    total
  };
}
