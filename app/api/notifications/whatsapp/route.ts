import { NextResponse } from 'next/server';
import { sendWhatsApp } from '@/lib/notifications/whatsapp';

export async function POST(request: Request) {
  const body = await request.json();
  await sendWhatsApp(body);
  return NextResponse.json({ status: 'queued' });
}
