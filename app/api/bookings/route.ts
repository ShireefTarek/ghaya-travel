import { NextResponse } from 'next/server';
import { calculatePrice } from '@/lib/pricing/calc';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/notifications/email';
import { bookingConfirmationEmail } from '@/lib/emails/templates';
import { sendWhatsApp } from '@/lib/notifications/whatsapp';

export async function POST(request: Request) {
  const body = await request.json();
  const breakdown = await calculatePrice({
    packageId: body.packageId,
    travelerCount: body.travelerCount,
    addOnIds: body.addOnIds,
    bookingCurrency: body.currency,
    promoCode: body.promoCode,
    seatSelections: body.seatSelections,
    flightSelection: body.flightSelection,
    travelDate: body.travelDate
  });

  const seatFeeTotal = breakdown.seats.reduce((acc, seat) => acc + seat.total, 0);

  const addOns = body.addOnIds?.length
    ? await prisma.addOn.findMany({ where: { id: { in: body.addOnIds } } })
    : [];

  let userId = body.userId;
  if (!userId) {
    const user = await prisma.user.upsert({
      where: { email: body.email },
      update: { name: body.travelers?.[0]?.firstName || 'Traveler' },
      create: {
        email: body.email,
        name: body.travelers?.[0]?.firstName || 'Traveler',
        role: 'customer'
      }
    });
    userId = user.id;
  }
  const invoiceNumber = `INV-${Date.now()}`;
  const booking = await prisma.booking.create({
    data: {
      userId,
      packageId: body.packageId,
      currency: body.currency,
      subtotal: breakdown.subtotal,
      taxes: breakdown.taxes,
      fees: breakdown.fees,
      discounts: breakdown.promo ?? 0,
      total: breakdown.total,
      seatFees: seatFeeTotal,
      travelers: body.travelers,
      paymentStatus: 'paid',
      status: 'confirmed',
      invoiceNumber
    },
    include: {
      package: true
    }
  });

  const invoice = await prisma.invoice.create({
    data: {
      bookingId: booking.id,
      number: invoiceNumber,
      pdfUrl: `/api/invoices/${invoiceNumber}`
    }
  });

  if (addOns.length) {
    await prisma.bookingAddon.createMany({
      data: addOns.map((addOn) => ({
        bookingId: booking.id,
        addOnId: addOn.id,
        unitPrice: addOn.price,
        qty: body.travelerCount
      }))
    });
  }

  let flightRecord = null;
  if (body.flightSelection?.offerId) {
    flightRecord = await prisma.flightSelection.create({
      data: {
        bookingId: booking.id,
        aggregator: body.flightSelection.provider || 'mock',
        offerId: body.flightSelection.offerId,
        price: body.flightSelection.price,
        currency: body.flightSelection.currency,
        seatIds: body.flightSelection.seatIds || [],
        segments: {
          segments: body.flightSelection.segments || [],
          ticketing: body.flightSelection.ticketing || null
        },
        recordLocator:
          body.flightSelection.ticketing?.recordLocator || body.flightSelection.recordLocator || null
      }
    });
  }

  await sendEmail({
    to: body.email,
    subject: 'Ghaya Travel Booking Confirmation',
    html: bookingConfirmationEmail({
      customerName: body.travelers?.[0]?.firstName || 'Traveler',
      packageTitle: booking.package?.title || 'Package',
      total: breakdown.total,
      currency: body.currency,
      bookingId: booking.id
    })
  });

  await sendWhatsApp({
    to: body.phone,
    template: 'booking_confirmation',
    components: []
  });

  return NextResponse.json({ booking: { ...booking, invoice, flight: flightRecord }, breakdown });
}
