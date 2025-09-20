import type { Package, ItineraryItem } from '@prisma/client';

type FAQ = {
  question: string;
  answer: string;
};

type BreadcrumbItem = {
  name: string;
  item: string;
};

export function productJsonLd(pkg: Package) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pkg.title,
    description: pkg.summary,
    brand: {
      '@type': 'Brand',
      name: 'Ghaya Travel'
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: pkg.currency,
      lowPrice: pkg.basePrice,
      highPrice: pkg.basePrice,
      availability: 'https://schema.org/InStock'
    }
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item
    }))
  };
}

export function faqJsonLd(items: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function itineraryJsonLd(pkg: Package, itinerary: ItineraryItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Trip',
    name: pkg.title,
    description: pkg.summary,
    itinerary: itinerary.map((item) => ({
      '@type': 'TouristTrip',
      name: item.title,
      description: item.description,
      dayOfWeek: item.dayNumber
    }))
  };
}
