import { NextResponse } from 'next/server';
import { calculatePrice } from '@/lib/pricing/calc';

export async function POST(request: Request) {
  const body = await request.json();
  const breakdown = await calculatePrice(body);
  return NextResponse.json({ breakdown });
}
