import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const packages = await prisma.package.findMany({ include: { category: true } });
  return NextResponse.json({ packages });
}
