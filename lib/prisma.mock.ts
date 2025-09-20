import { randomUUID } from 'node:crypto';

type PackageAddOn = {
  id: string;
  packageId: string;
  title: string;
  price: number;
};

type TravelPackage = {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  currency: string;
  addOns: PackageAddOn[];
};

type PromoCode = {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  validFrom?: Date;
  validTo?: Date;
  maxRedemptions?: number | null;
  usedCount: number;
};

type CurrencyRate = {
  id: string;
  code: string;
  rateToEGP: number;
  updatedAt: Date;
  manual: boolean;
};

type PricingRule = {
  id: string;
  packageId: string;
  percent: number;
  startsAt: Date;
  endsAt: Date;
};

type FindArgs<T> = {
  where?: Partial<Record<keyof T, unknown>>;
  include?: Record<string, boolean>;
  orderBy?: Record<string, 'asc' | 'desc'>;
};

type UpsertArgs<T> = {
  where: Partial<Record<keyof T, unknown>>;
  create: T;
  update: Partial<T>;
};

function matchWhere<T extends Record<string, any>>(item: T, where?: Partial<Record<keyof T, unknown>>): boolean {
  if (!where) return true;
  return Object.entries(where).every(([key, value]) => {
    const itemValue = (item as any)[key];
    if (value && typeof value === 'object' && 'lte' in (value as any)) {
      const { lte } = value as { lte?: Date };
      if (lte && itemValue instanceof Date) {
        return itemValue <= lte;
      }
    }
    if (value && typeof value === 'object' && 'gte' in (value as any)) {
      const { gte } = value as { gte?: Date };
      if (gte && itemValue instanceof Date) {
        return itemValue >= gte;
      }
    }
    if (value instanceof Date && itemValue instanceof Date) {
      return itemValue.getTime() === value.getTime();
    }
    if (typeof value === 'string') {
      return String(itemValue).toLowerCase() === value.toLowerCase();
    }
    return itemValue === value;
  });
}

class MockModel<T extends Record<string, any>> {
  constructor(private data: T[]) {}

  async findFirst(args: FindArgs<T> = {}): Promise<T | null> {
    const filtered = this.data.filter((item) => matchWhere(item, args.where));
    if (args.orderBy) {
      const [key, direction] = Object.entries(args.orderBy)[0];
      filtered.sort((a, b) => {
        const first = (a as any)[key];
        const second = (b as any)[key];
        if (first instanceof Date && second instanceof Date) {
          const diff = first.getTime() - second.getTime();
          return direction === 'desc' ? -diff : diff;
        }
        if (typeof first === 'number' && typeof second === 'number') {
          return direction === 'desc' ? second - first : first - second;
        }
        return 0;
      });
    }
    const record = filtered[0] ?? null;
    return this.applyIncludes(record, args.include);
  }

  async findUnique(args: FindArgs<T> = {}): Promise<T | null> {
    return this.findFirst(args);
  }

  async upsert(args: UpsertArgs<T>): Promise<T> {
    const existingIndex = this.data.findIndex((item) => matchWhere(item, args.where));
    if (existingIndex >= 0) {
      this.data[existingIndex] = {
        ...this.data[existingIndex],
        ...args.update,
        id: (this.data[existingIndex] as any).id
      };
      return this.data[existingIndex];
    }
    const created = { ...args.create } as any;
    if (!created.id) {
      created.id = randomUUID();
    }
    this.data.push(created);
    return created;
  }

  private applyIncludes(record: T | null, include?: Record<string, boolean>): T | null {
    if (!record) return record;
    if (!include) return record;
    const result: Record<string, unknown> = { ...record };
    for (const [relation, shouldInclude] of Object.entries(include)) {
      if (!shouldInclude) continue;
      const relationValue = (record as any)[relation];
      result[relation] = Array.isArray(relationValue)
        ? relationValue.map((value) => ({ ...value }))
        : relationValue;
    }
    return result as T;
  }
}

const packages: TravelPackage[] = [
  {
    id: 'pkg_cairo_nile',
    title: 'Discover Cairo & Nile Cruise – 5D4N',
    slug: 'discover-cairo-nile-cruise',
    basePrice: 1200,
    currency: 'USD',
    addOns: [
      {
        id: 'addon_flight',
        packageId: 'pkg_cairo_nile',
        title: 'Roundtrip Flights',
        price: 350
      },
      {
        id: 'addon_hotair',
        packageId: 'pkg_cairo_nile',
        title: 'Luxor Hot Air Balloon',
        price: 180
      }
    ]
  }
];

const promoCodes: PromoCode[] = [
  {
    id: 'promo_newyear',
    code: 'NY2025',
    type: 'percent',
    value: 10,
    validFrom: new Date('2024-01-01T00:00:00.000Z'),
    validTo: new Date('2026-01-01T00:00:00.000Z'),
    maxRedemptions: null,
    usedCount: 0
  }
];

const currencyRates: CurrencyRate[] = [
  {
    id: 'rate_usd',
    code: 'USD',
    rateToEGP: 30,
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    manual: true
  },
  {
    id: 'rate_egp',
    code: 'EGP',
    rateToEGP: 1,
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    manual: true
  },
  {
    id: 'rate_eur',
    code: 'EUR',
    rateToEGP: 33,
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    manual: true
  }
];

const pricingRules: PricingRule[] = [
  {
    id: 'markup_winter',
    packageId: 'pkg_cairo_nile',
    percent: 5,
    startsAt: new Date('2024-12-01T00:00:00.000Z'),
    endsAt: new Date('2025-03-01T00:00:00.000Z')
  }
];

export class MockPrismaClient {
  package: MockModel<TravelPackage>;
  promoCode: MockModel<PromoCode>;
  currencyRate: MockModel<CurrencyRate>;
  pricingRule: MockModel<PricingRule>;

  constructor() {
    this.package = new MockModel(packages);
    this.promoCode = new MockModel(promoCodes);
    this.currencyRate = new MockModel(currencyRates);
    this.pricingRule = new MockModel(pricingRules);
  }

  async $disconnect(): Promise<void> {
    return;
  }
}

export default MockPrismaClient;
