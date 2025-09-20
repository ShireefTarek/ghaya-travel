import { NextResponse } from 'next/server';
import { getSeatMaps } from '@/lib/flight';

export async function POST(request: Request) {
  const { offerId } = await request.json();
  const seatMaps = await getSeatMaps(offerId);
  return NextResponse.json({ seatMaps });
}
