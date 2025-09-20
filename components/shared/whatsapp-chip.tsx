'use client';

import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface Props {
  phoneNumber?: string;
  label: string;
}

export default function WhatsAppChip({ phoneNumber = '201000000000', label }: Props) {
  return (
    <Link
      href={`https://wa.me/${phoneNumber}`}
      className="fixed bottom-6 end-6 flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-accent-600"
      target="_blank"
      rel="noopener"
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </Link>
  );
}
