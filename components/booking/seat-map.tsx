'use client';

import { useState } from 'react';
import type { SeatMap as SeatMapType } from '@/lib/flight/providers/types';
import { cn } from '@/lib/utils';

interface SeatMapProps {
  seatMaps: SeatMapType[];
  onSelect: (seatIds: string[]) => void;
  selectedSeats: string[];
  locale: string;
}

export default function SeatMap({ seatMaps, onSelect, selectedSeats, locale }: SeatMapProps) {
  const [activeSegment, setActiveSegment] = useState(seatMaps[0]?.segmentId);
  const segment = seatMaps.find((map) => map.segmentId === activeSegment) || seatMaps[0];

  function toggleSeat(seatId: string, available: boolean) {
    if (!available) return;
    if (selectedSeats.includes(seatId)) {
      onSelect(selectedSeats.filter((id) => id !== seatId));
    } else {
      onSelect([...selectedSeats, seatId]);
    }
  }

  const legend = [
    { key: 'standard', label: locale === 'ar' ? 'قياسي' : 'Standard', color: 'bg-brand-100' },
    { key: 'extra_legroom', label: locale === 'ar' ? 'مساحة إضافية' : 'Extra legroom', color: 'bg-brand-200' },
    { key: 'exit', label: locale === 'ar' ? 'مخرج طوارئ' : 'Exit row', color: 'bg-amber-200' },
    { key: 'paid', label: locale === 'ar' ? 'مقعد مدفوع' : 'Paid seat', color: 'bg-accent/50' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {seatMaps.map((map) => (
          <button
            key={map.segmentId}
            className={cn(
              'rounded-full border px-4 py-1 text-sm',
              map.segmentId === segment?.segmentId
                ? 'border-brand-600 bg-brand text-white'
                : 'border-brand-100 bg-white text-textdark'
            )}
            onClick={() => setActiveSegment(map.segmentId)}
          >
            {locale === 'ar' ? 'المقطع' : 'Leg'} {map.segmentId}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-brand-100 bg-white p-4">
        <div className="grid grid-cols-6 gap-2">
          {segment?.seats.map((seat) => {
            const isSelected = selectedSeats.includes(seat.id);
            const isUnavailable = !seat.available;
            const typeClass =
              seat.type === 'extra_legroom'
                ? 'bg-brand-200'
                : seat.type === 'exit'
                ? 'bg-amber-200'
                : seat.type === 'paid'
                ? 'bg-accent/60'
                : 'bg-brand-50';
            return (
              <button
                key={seat.id}
                onClick={() => toggleSeat(seat.id, seat.available)}
                className={cn(
                  'flex h-12 flex-col items-center justify-center rounded-lg border text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500',
                  typeClass,
                  isSelected && 'border-accent-600 ring-2 ring-accent-600',
                  isUnavailable && 'cursor-not-allowed opacity-40'
                )}
                aria-pressed={isSelected}
                aria-label={`${seat.label} ${seat.price ? `(${seat.price} ${seat.currency})` : ''}`}
              >
                <span>{seat.label}</span>
                {seat.price ? <span className="text-[10px]">{seat.price} {seat.currency}</span> : null}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-textdark/80">
        {legend.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <span className={cn('h-4 w-4 rounded', item.color)} aria-hidden />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
