import { NextResponse } from 'next/server';
import { searchFlightOffers } from '@/lib/flight';

export async function POST(request: Request) {
  const body = await request.json();
  const offers = await searchFlightOffers(body);
  return NextResponse.json({ offers });
}
