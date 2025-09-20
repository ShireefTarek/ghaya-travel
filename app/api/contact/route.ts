import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validators/contact';
import { sendEmail } from '@/lib/notifications/email';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  await sendEmail({
    to: process.env.SUPPORT_EMAIL || 'support@ghayatravel.com',
    subject: 'New contact form submission',
    html: `<p>${parsed.data.name} (${parsed.data.email})</p><p>${parsed.data.message}</p>`
  });
  return NextResponse.json({ status: 'ok' });
}
