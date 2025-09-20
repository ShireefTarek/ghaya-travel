import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');

  return (
    <footer className="bg-surface border-t border-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-textdark">Ghaya Travel</p>
            <p className="text-sm text-textdark/70">{t('rights')}</p>
          </div>
          <div className="flex gap-6 text-sm text-textdark/80">
            <Link href={`/${locale}/privacy`}>{t('links.privacy')}</Link>
            <Link href={`/${locale}/terms`}>{t('links.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
