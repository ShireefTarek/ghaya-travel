'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

const currencies = ['EGP', 'USD', 'EUR'];

interface Props {
  locale: string;
}

export default function CurrencySelector({ locale }: Props) {
  const [selected, setSelected] = useState('EGP');

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-textdark/70">{locale === 'ar' ? 'العملة' : 'Currency'}</span>
      <select
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
        className="rounded-md border border-brand-200 bg-white px-2 py-1 text-xs text-textdark focus:border-brand-600 focus:outline-none"
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
}
