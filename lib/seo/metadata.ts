import type { Metadata, ResolvingMetadata } from 'next';
import type { Package } from '@prisma/client';

export const baseMetadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Ghaya Travel',
    template: '%s | Ghaya Travel'
  },
  description: 'Ghaya Travel connects Egypt with the world through curated journeys.',
  openGraph: {
    type: 'website',
    title: 'Ghaya Travel',
    description: 'Premium travel experiences from Egypt to the world.',
    siteName: 'Ghaya Travel'
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@ghayatravel'
  }
};

export function packageMetadata(pkg: Package): Metadata {
  return {
    title: pkg.title,
    description: pkg.summary,
    openGraph: {
      type: 'product',
      title: pkg.title,
      description: pkg.summary,
      images: pkg.coverImage ? [{ url: pkg.coverImage, alt: pkg.title }] : undefined
    },
    alternates: {
      canonical: `/packages/${pkg.slug}`
    }
  };
}

export async function resolveMetadata(
  parent: ResolvingMetadata,
  overrides?: Metadata
): Promise<Metadata> {
  const resolved = await parent;
  return {
    ...resolved,
    ...overrides
  };
}
