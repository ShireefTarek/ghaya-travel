import prisma from '@/lib/prisma';

export type CurrencyRate = {
  id: string;
  code: string;
  rateToEGP: number;
  updatedAt: Date;
  manual: boolean;
};

async function fetchProviderRate(code: string): Promise<number | null> {
  if (!process.env.OPEN_EXCHANGE_RATES_KEY) {
    console.warn('Open Exchange Rates key missing. Using fallback mock rate.');
    const mockRates: Record<string, number> = {
      USD: 30,
      EUR: 33,
      EGP: 1
    };
    return mockRates[code] ?? null;
  }
  try {
    const res = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${process.env.OPEN_EXCHANGE_RATES_KEY}&symbols=${code},EGP`
    );
    if (!res.ok) {
      console.error('Failed to load exchange rates', await res.text());
      return null;
    }
    const data = await res.json();
    const { rates } = data as { rates: Record<string, number> };
    const rate = rates[code];
    const egp = rates.EGP;
    if (!rate || !egp) return null;
    return rate / egp;
  } catch (error) {
    console.error('Rate provider error', error);
    return null;
  }
}

export async function getCurrencyRate(code: string): Promise<CurrencyRate> {
  const normalized = code.toUpperCase();
  const manual = await prisma.currencyRate.findFirst({
    where: { code: normalized },
    orderBy: { updatedAt: 'desc' }
  });
  if (manual && manual.manual) {
    return manual;
  }
  if (manual && !manual.manual && manual.updatedAt && Date.now() - manual.updatedAt.getTime() < 12 * 3600 * 1000) {
    return manual;
  }
  const providerRate = await fetchProviderRate(normalized);
  if (providerRate) {
    return await prisma.currencyRate.upsert({
      where: { code: normalized },
      create: {
        code: normalized,
        rateToEGP: providerRate,
        manual: false
      },
      update: {
        rateToEGP: providerRate,
        manual: false,
        updatedAt: new Date()
      }
    });
  }
  if (manual) {
    return manual;
  }
  return {
    id: 'mock-' + normalized,
    code: normalized,
    rateToEGP: normalized === 'EGP' ? 1 : 30,
    updatedAt: new Date(),
    manual: true
  } as CurrencyRate;
}

export async function convertCurrency(amount: number, from: string, to: string): Promise<number> {
  if (from === to) return amount;
  const [fromRate, toRate] = await Promise.all([getCurrencyRate(from), getCurrencyRate(to)]);
  const amountInEgp = from === 'EGP' ? amount : amount * fromRate.rateToEGP;
  if (to === 'EGP') {
    return amountInEgp;
  }
  return amountInEgp / toRate.rateToEGP;
}
