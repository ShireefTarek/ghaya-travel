import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import PDFDocument from 'pdfkit';

export async function GET(_request: Request, { params: { id } }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findFirst({
    where: { OR: [{ id }, { number: id }] },
    include: { booking: { include: { package: true, user: true } } }
  });
  if (!invoice) {
    return new NextResponse('Not Found', { status: 404 });
  }
  const doc = new PDFDocument();
  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => {});

  doc.fontSize(20).text('Ghaya Travel Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice #: ${invoice.number}`);
  doc.text(`Booking ID: ${invoice.bookingId}`);
  doc.text(`Customer: ${invoice.booking.user?.name || 'Traveler'}`);
  doc.text(`Package: ${invoice.booking.package?.title || 'Custom booking'}`);
  doc.text(`Total: ${invoice.booking.total} ${invoice.booking.currency}`);
  doc.end();

  await new Promise((resolve) => doc.on('end', resolve));

  return new NextResponse(Buffer.concat(chunks), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=invoice-${invoice.number}.pdf`
    }
  });
}
