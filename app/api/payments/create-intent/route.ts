import { NextResponse } from 'next/server';
import { createPayment } from '@/lib/payments';

export async function POST(request: Request) {
  const body = await request.json();
  const intent = await createPayment(body);
  return NextResponse.json(intent);
}
