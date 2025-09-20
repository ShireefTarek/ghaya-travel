'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Package, AddOn } from '@prisma/client';
import SeatMapComponent from '@/components/booking/seat-map';
import PriceBreakdown from '@/components/checkout/price-breakdown';
import { PricingBreakdown } from '@/lib/pricing/calc';
import { formatCurrency } from '@/lib/utils';

interface PackageWithAddOns extends Package {
  addOns: AddOn[];
  destinations?: { city: string | null; country: string | null }[];
}

interface Props {
  locale: string;
  pkg: PackageWithAddOns;
}

const defaultTraveler = { firstName: '', lastName: '', email: '', phone: '', nationality: '' };

export default function BookingWizard({ locale, pkg }: Props) {
  const stepLabels = useMemo(
    () =>
      locale === 'ar'
        ? ['الإضافات', 'الطيران', 'المقاعد', 'المسافرون', 'المراجعة', 'الدفع']
        : ['Add-ons', 'Flights', 'Seats', 'Travelers', 'Review', 'Payment'],
    [locale]
  );
  const [step, setStep] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [flightOffers, setFlightOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [seatMaps, setSeatMaps] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [travelers, setTravelers] = useState([defaultTraveler]);
  const [breakdown, setBreakdown] = useState<PricingBreakdown | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const packageCurrency = pkg.currency;

  async function loadOffers() {
    setLoadingOffers(true);
    const res = await fetch('/api/flights/search', {
      method: 'POST',
      body: JSON.stringify({
        origin: pkg.destinations?.[0]?.city || 'CAI',
        destination: pkg.destinations?.[0]?.country === 'Egypt' ? 'JED' : 'CAI',
        departureDate: new Date().toISOString().slice(0, 10),
        adults: travelers.length
      })
    });
    const data = await res.json();
    setFlightOffers(data.offers || []);
    setLoadingOffers(false);
  }

  useEffect(() => {
    if (step === 1 && flightOffers.length === 0 && !loadingOffers) {
      loadOffers();
    }
  }, [step]);

  async function handleSeatLoad(offer: any) {
    const res = await fetch('/api/flights/seat-map', {
      method: 'POST',
      body: JSON.stringify({ offerId: offer.id })
    });
    const data = await res.json();
    setSeatMaps(data.seatMaps || []);
    setSelectedSeats([]);
    setSelectedOffer(offer);
  }

  async function handleSeatChange(seats: string[]) {
    setSelectedSeats(seats);
    if (!selectedOffer) return;
    const res = await fetch('/api/flights/price', {
      method: 'POST',
      body: JSON.stringify({ offerId: selectedOffer.id, seatIds: seats })
    });
    const data = await res.json();
    setSelectedOffer({ ...selectedOffer, totalAmount: data.priced.totalAmount });
  }

  async function computeBreakdown() {
    const res = await fetch('/api/pricing/preview', {
      method: 'POST',
      body: JSON.stringify({
        packageId: pkg.id,
        travelerCount: travelers.length,
        addOnIds: selectedAddOns,
        bookingCurrency: packageCurrency,
        promoCode: undefined,
        flightSelection: selectedOffer
          ? {
              price: selectedOffer.totalAmount,
              currency: selectedOffer.currency
            }
          : undefined,
        seatSelections: selectedSeats.map((seatId) => ({
          seatId,
          label: seatId,
          price: 25,
          currency: selectedOffer?.currency || packageCurrency
        }))
      })
    });
    const data = await res.json();
    setBreakdown(data.breakdown);
  }

  useEffect(() => {
    if (step === 4) {
      computeBreakdown();
    }
  }, [step]);

  function toggleAddOn(id: string) {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function nextStep() {
    setStep((prev) => Math.min(prev + 1, stepLabels.length - 1));
  }

  function prevStep() {
    setStep((prev) => Math.max(prev - 1, 0));
  }

  function updateTraveler(index: number, key: string, value: string) {
    setTravelers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  }

  async function handleSubmit() {
    if (!breakdown) return;
    setSubmitting(true);
    const paymentRes = await fetch('/api/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({
        amount: breakdown.total,
        currency: packageCurrency,
        customerEmail: travelers[0].email,
        description: `Booking for ${pkg.title}`
      })
    });
    const payment = await paymentRes.json();
    const res = await fetch('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        packageId: pkg.id,
        travelerCount: travelers.length,
        addOnIds: selectedAddOns,
        currency: packageCurrency,
        travelers,
        userId: 'anonymous-user',
        email: travelers[0].email,
        phone: travelers[0].phone,
        seatSelections: selectedSeats.map((seatId) => {\n          const seat = seatMaps.flatMap((map: any) => map.seats).find((s: any) => s.id === seatId);\n          return { seatId, label: seatId, price: seat?.price || 0, currency: seat?.currency || packageCurrency };\n        }),
        flightSelection: selectedOffer
          ? { price: selectedOffer.totalAmount, currency: selectedOffer.currency }
          : undefined
      })
    });
    if (res.ok) {
      setMessage(locale === 'ar' ? 'تم تأكيد الحجز بنجاح!' : 'Booking confirmed successfully!');
      setStep(stepLabels.length - 1);
    } else {
      setMessage(locale === 'ar' ? 'حدث خطأ أثناء الحجز.' : 'Something went wrong.');
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {stepLabels.map((label, index) => (
          <span
            key={label}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              index === step ? 'bg-accent text-white' : 'bg-brand-50 text-textdark'
            }`}
          >
            {index + 1}. {label}
          </span>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-textdark">
            {locale === 'ar' ? 'اختر الإضافات' : 'Choose add-ons'}
          </h2>
          <div className="space-y-3">
            {pkg.addOns.map((addOn) => (
              <label
                key={addOn.id}
                className="flex items-center justify-between rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3"
              >
                <span>
                  <span className="block text-sm font-semibold text-textdark">{addOn.title}</span>
                  <span className="text-xs text-textdark/70">{addOn.description}</span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-accent">
                    {formatCurrency(addOn.price, addOn.currency, locale === 'ar' ? 'ar-EG' : 'en-EG')}
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addOn.id)}
                    onChange={() => toggleAddOn(addOn.id)}
                  />
                </span>
              </label>
            ))}
          </div>
          <button
            onClick={nextStep}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
          >
            {locale === 'ar' ? 'متابعة' : 'Continue'}
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-textdark">
              {locale === 'ar' ? 'اختر الرحلة' : 'Select a flight'}
            </h2>
            <button
              onClick={loadOffers}
              className="text-sm font-semibold text-brand-700 hover:text-accent-600"
            >
              {locale === 'ar' ? 'تحديث العروض' : 'Refresh offers'}
            </button>
          </div>
          {loadingOffers && <p>{locale === 'ar' ? 'جاري تحميل العروض...' : 'Loading offers…'}</p>}
          <div className="grid gap-4 md:grid-cols-2">
            {flightOffers.map((offer) => (
              <button
                key={offer.id}
                className={`rounded-2xl border px-4 py-3 text-left ${
                  selectedOffer?.id === offer.id ? 'border-accent bg-brand-50' : 'border-brand-100'
                }`}
                onClick={() => handleSeatLoad(offer)}
              >
                <p className="text-sm font-semibold text-textdark">
                  {formatCurrency(offer.totalAmount, offer.currency, locale === 'ar' ? 'ar-EG' : 'en-EG')}
                </p>
                <p className="text-xs text-textdark/70">
                  {offer.segments.map((seg: any) => `${seg.origin}→${seg.destination}`).join(' / ')}
                </p>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={prevStep} className="rounded-full border border-brand-200 px-4 py-2 text-sm">
              {locale === 'ar' ? 'السابق' : 'Back'}
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!selectedOffer}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
            >
              {locale === 'ar' ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && selectedOffer && (
        <div className="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-textdark">
            {locale === 'ar' ? 'اختيار المقاعد' : 'Seat selection'}
          </h2>
          {seatMaps.length > 0 ? (
            <SeatMapComponent
              seatMaps={seatMaps}
              onSelect={handleSeatChange}
              selectedSeats={selectedSeats}
              locale={locale}
            />
          ) : (
            <p>{locale === 'ar' ? 'جاري تحميل خريطة المقاعد...' : 'Loading seat map…'}</p>
          )}
          <div className="flex gap-3">
            <button onClick={prevStep} className="rounded-full border border-brand-200 px-4 py-2 text-sm">
              {locale === 'ar' ? 'السابق' : 'Back'}
            </button>
            <button
              onClick={() => setStep(3)}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
            >
              {locale === 'ar' ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-textdark">
            {locale === 'ar' ? 'بيانات المسافرين' : 'Traveler information'}
          </h2>
          <div className="space-y-4">
            {travelers.map((traveler, index) => (
              <div key={index} className="rounded-2xl border border-brand-100 p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    placeholder={locale === 'ar' ? 'الاسم الأول' : 'First name'}
                    value={traveler.firstName}
                    onChange={(event) => updateTraveler(index, 'firstName', event.target.value)}
                    className="rounded-xl border border-brand-200 px-3 py-2"
                  />
                  <input
                    placeholder={locale === 'ar' ? 'الاسم الأخير' : 'Last name'}
                    value={traveler.lastName}
                    onChange={(event) => updateTraveler(index, 'lastName', event.target.value)}
                    className="rounded-xl border border-brand-200 px-3 py-2"
                  />
                  <input
                    placeholder="Email"
                    value={traveler.email}
                    onChange={(event) => updateTraveler(index, 'email', event.target.value)}
                    className="rounded-xl border border-brand-200 px-3 py-2"
                  />
                  <input
                    placeholder={locale === 'ar' ? 'رقم الهاتف' : 'Phone'}
                    value={traveler.phone}
                    onChange={(event) => updateTraveler(index, 'phone', event.target.value)}
                    className="rounded-xl border border-brand-200 px-3 py-2"
                  />
                  <input
                    placeholder={locale === 'ar' ? 'الجنسية' : 'Nationality'}
                    value={traveler.nationality}
                    onChange={(event) => updateTraveler(index, 'nationality', event.target.value)}
                    className="rounded-xl border border-brand-200 px-3 py-2"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTravelers((prev) => [...prev, defaultTraveler])}
              className="rounded-full border border-brand-200 px-4 py-2 text-sm"
            >
              {locale === 'ar' ? 'إضافة مسافر' : 'Add traveler'}
            </button>
            {travelers.length > 1 && (
              <button
                onClick={() => setTravelers((prev) => prev.slice(0, -1))}
                className="rounded-full border border-brand-200 px-4 py-2 text-sm"
              >
                {locale === 'ar' ? 'إزالة الأخير' : 'Remove last'}
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={prevStep} className="rounded-full border border-brand-200 px-4 py-2 text-sm">
              {locale === 'ar' ? 'السابق' : 'Back'}
            </button>
            <button
              onClick={() => setStep(4)}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
            >
              {locale === 'ar' ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 4 && breakdown && (
        <div className="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-textdark">
            {locale === 'ar' ? 'مراجعة السعر' : 'Review pricing'}
          </h2>
          <PriceBreakdown breakdown={breakdown} currency={packageCurrency} locale={locale} />
          <div className="flex gap-3">
            <button onClick={prevStep} className="rounded-full border border-brand-200 px-4 py-2 text-sm">
              {locale === 'ar' ? 'السابق' : 'Back'}
            </button>
            <button
              onClick={() => setStep(5)}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
            >
              {locale === 'ar' ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-textdark">
            {locale === 'ar' ? 'الدفع والتأكيد' : 'Payment & confirmation'}
          </h2>
          <p className="text-sm text-textdark/70">
            {locale === 'ar'
              ? 'سنقوم بإنشاء عملية دفع تجريبية ثم تأكيد الحجز وإرسال التأكيد عبر البريد والواتساب.'
              : 'We will trigger a mock payment intent then confirm your booking with email and WhatsApp notifications.'}
          </p>
          {message && <p className="text-sm text-brand-700">{message}</p>}
          <div className="flex gap-3">
            <button onClick={prevStep} className="rounded-full border border-brand-200 px-4 py-2 text-sm">
              {locale === 'ar' ? 'السابق' : 'Back'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
            >
              {submitting
                ? locale === 'ar'
                  ? 'جاري المعالجة...'
                  : 'Processing…'
                : locale === 'ar'
                ? 'تأكيد الحجز'
                : 'Confirm booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
