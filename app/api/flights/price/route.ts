import { NextResponse } from 'next/server';
import { priceOfferWithSeats } from '@/lib/flight';

export async function POST(request: Request) {
  const { offerId, seatIds } = await request.json();
  const priced = await priceOfferWithSeats(offerId, seatIds || []);
  return NextResponse.json({ priced });
}
