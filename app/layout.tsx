import './globals.css';
import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import { ReactNode } from 'react';

const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Ghaya Travel',
  description: 'Ghaya Travel – Premium Egyptian travel experiences and booking platform.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body className={`${cairo.variable} ${inter.variable} bg-bg text-textdark antialiased`}>
        {children}
      </body>
    </html>
  );
}
