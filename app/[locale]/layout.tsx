import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/../i18n';
import { getMessages } from '@/lib/i18n/get-messages';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import LocaleSwitcher from '@/components/shared/locale-switcher';
import CurrencySelector from '@/components/shared/currency-selector';

export const dynamic = 'force-dynamic';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;
  if (!locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Cairo">
      <div className={locale === 'ar' ? 'rtl' : 'ltr'} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar locale={locale} topSlot={<LocaleSwitcher currentLocale={locale} />}>
          <CurrencySelector locale={locale} />
        </Navbar>
        <main className="bg-bg">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </main>
        <Footer locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}
