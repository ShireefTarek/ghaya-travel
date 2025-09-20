import { PricingBreakdown } from '@/lib/pricing/calc';
import { formatCurrency } from '@/lib/utils';

interface Props {
  breakdown: PricingBreakdown;
  currency: string;
  locale: string;
}

export default function PriceBreakdown({ breakdown, currency, locale }: Props) {
  const format = (value: number) => formatCurrency(value, currency, locale === 'ar' ? 'ar-EG' : 'en-EG');

  return (
    <div className="space-y-3 rounded-xl border border-brand-100 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-textdark">
        {locale === 'ar' ? 'تفاصيل السعر' : 'Price breakdown'}
      </h3>
      <div className="space-y-2 text-sm text-textdark/80">
        <div className="flex items-center justify-between">
          <span>{locale === 'ar' ? 'السعر الأساسي' : 'Base package'}</span>
          <span>{format(breakdown.convertedBase)}</span>
        </div>
        {breakdown.addOns.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <span>{item.title}</span>
            <span>{format(item.total)}</span>
          </div>
        ))}
        {breakdown.flight ? (
          <div className="flex items-center justify-between">
            <span>{locale === 'ar' ? 'الطيران' : 'Flight'}</span>
            <span>{format(breakdown.flight.total)}</span>
          </div>
        ) : null}
        {breakdown.seats.length > 0 && (
          <div className="flex items-center justify-between">
            <span>{locale === 'ar' ? 'اختيار المقاعد' : 'Seat selection'}</span>
            <span>{format(breakdown.seats.reduce((acc, seat) => acc + seat.total, 0))}</span>
          </div>
        )}
        {breakdown.markup ? (
          <div className="flex items-center justify-between text-accent-700">
            <span>{locale === 'ar' ? 'زيادة موسمية' : 'Seasonal markup'}</span>
            <span>{format(breakdown.markup)}</span>
          </div>
        ) : null}
        {breakdown.promo ? (
          <div className="flex items-center justify-between text-brand-700">
            <span>{locale === 'ar' ? 'خصم ترويجي' : 'Promo discount'}</span>
            <span>-{format(breakdown.promo)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <span>{locale === 'ar' ? 'الضرائب' : 'Taxes'}</span>
          <span>{format(breakdown.taxes)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>{locale === 'ar' ? 'الرسوم' : 'Fees'}</span>
          <span>{format(breakdown.fees)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-brand-100 pt-3 text-base font-semibold text-textdark">
        <span>{locale === 'ar' ? 'الإجمالي' : 'Total due'}</span>
        <span>{format(breakdown.total)}</span>
      </div>
    </div>
  );
}
