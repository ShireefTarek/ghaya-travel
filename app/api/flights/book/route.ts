import { NextResponse } from 'next/server';
import { bookAndTicket, selectSeats } from '@/lib/flight';

export async function POST(request: Request) {
  const { offerId, seatIds, passengers } = await request.json();
  if (seatIds?.length) {
    await selectSeats(offerId, seatIds);
  }
  const result = await bookAndTicket({ offerId, passengers, seats: seatIds || [] });
  return NextResponse.json({ result });
}
