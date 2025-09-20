import { convertCurrency } from '@/lib/pricing/rates';

describe('currency conversion', () => {
  it('converts between currencies', async () => {
    const amount = await convertCurrency(100, 'USD', 'EGP');
    expect(amount).toBeGreaterThan(100);
  });
});
