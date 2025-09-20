'use client';

import { useState } from 'react';
import { SearchQuery, Offer, SeatMap } from '@/lib/flight/providers/types';
import SeatMapComponent from '@/components/booking/seat-map';
import { formatCurrency } from '@/lib/utils';

interface Props {
  locale: string;
}

export default function FlightSearch({ locale }: Props) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [seatMaps, setSeatMaps] = useState<SeatMap[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [pricedTotal, setPricedTotal] = useState<number | null>(null);

  async function onSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const query: SearchQuery = {
      origin: String(form.get('origin')),
      destination: String(form.get('destination')),
      departureDate: String(form.get('departureDate')),
      returnDate: form.get('returnDate') ? String(form.get('returnDate')) : undefined,
      adults: Number(form.get('adults') || 1)
    };
    setLoading(true);
    const res = await fetch('/api/flights/search', {
      method: 'POST',
      body: JSON.stringify(query)
    });
    const data = await res.json();
    setOffers(data.offers);
    setLoading(false);
  }

  async function onSelectOffer(offer: Offer) {
    setSelectedOffer(offer);
    setSelectedSeats([]);
    const res = await fetch('/api/flights/seat-map', {
      method: 'POST',
      body: JSON.stringify({ offerId: offer.id })
    });
    const data = await res.json();
    setSeatMaps(data.seatMaps);
    setPricedTotal(offer.totalAmount);
  }

  async function onSeatChange(seats: string[]) {
    setSelectedSeats(seats);
    if (!selectedOffer) return;
    const res = await fetch('/api/flights/price', {
      method: 'POST',
      body: JSON.stringify({ offerId: selectedOffer.id, seatIds: seats })
    });
    const data = await res.json();
    setPricedTotal(data.priced.totalAmount);
  }

  return (
    <div className="space-y-10">
      <form
        onSubmit={onSearch}
        className="grid gap-3 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm md:grid-cols-5"
      >
        <div className="md:col-span-1">
          <label className="text-xs text-textdark/70">{locale === 'ar' ? 'من' : 'Origin'}</label>
          <input
            name="origin"
            required
            defaultValue="CAI"
            className="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs text-textdark/70">{locale === 'ar' ? 'إلى' : 'Destination'}</label>
          <input
            name="destination"
            required
            defaultValue="JED"
            className="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs text-textdark/70">{locale === 'ar' ? 'تاريخ المغادرة' : 'Departure'}</label>
          <input
            type="date"
            name="departureDate"
            required
            className="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs text-textdark/70">{locale === 'ar' ? 'تاريخ العودة' : 'Return'}</label>
          <input
            type="date"
            name="returnDate"
            className="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs text-textdark/70">{locale === 'ar' ? 'عدد المسافرين' : 'Travelers'}</label>
          <input
            type="number"
            name="adults"
            min={1}
            defaultValue={1}
            className="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div className="md:col-span-5">
          <button
            type="submit"
            className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-600"
            disabled={loading}
          >
            {loading ? (locale === 'ar' ? 'جاري البحث...' : 'Searching…') : locale === 'ar' ? 'ابحث عن رحلات' : 'Search flights'}
          </button>
        </div>
      </form>
      <div className="grid gap-6 md:grid-cols-2">
        {offers.map((offer) => (
          <div key={offer.id} className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-brand-700">{offer.provider}</p>
                <p className="text-lg font-semibold text-textdark">
                  {formatCurrency(offer.totalAmount, offer.currency, locale === 'ar' ? 'ar-EG' : 'en-EG')}
                </p>
              </div>
              <button
                onClick={() => onSelectOffer(offer)}
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                {locale === 'ar' ? 'اختر' : 'Select'}
              </button>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-textdark/70">
              {offer.segments.map((segment) => (
                <li key={segment.id} className="rounded-xl bg-brand-50 px-3 py-2">
                  {segment.origin} → {segment.destination} · {segment.carrier}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {selectedOffer && seatMaps.length > 0 && (
        <div className="space-y-6 rounded-3xl border border-brand-100 bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-textdark">
            {locale === 'ar' ? 'اختيار المقاعد' : 'Seat selection'}
          </h2>
          <SeatMapComponent
            seatMaps={seatMaps}
            onSelect={onSeatChange}
            selectedSeats={selectedSeats}
            locale={locale}
          />
          <p className="text-lg font-semibold text-accent">
            {locale === 'ar' ? 'الإجمالي بعد المقاعد:' : 'Total with seats:'}{' '}
            {pricedTotal !== null
              ? formatCurrency(pricedTotal, selectedOffer.currency, locale === 'ar' ? 'ar-EG' : 'en-EG')
              : '—'}
          </p>
        </div>
      )}
    </div>
  );
}
