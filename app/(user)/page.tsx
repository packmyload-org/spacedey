import type { Metadata } from 'next';
import HomePageContent from "@/components/home/HomePageContent";
import { HOME_FAQS, HOME_MARKETS, HOME_SERVICE_TYPES } from '@/lib/homeSeoContent';
import { getSiteDirectory } from '@/lib/services/siteDirectory';
import { buildPageMetadata, getSiteUrl, serializeJsonLd, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Affordable And Largest Secure Storage Facilities in Lagos, Nigeria & West Africa',
  description:
    'Compare and reserve secure self storage facilities in Lagos and across Nigeria for personal items, business inventory, and moving support.',
  path: '/',
  keywords: [
    'Best', 'Africa', 'storage', 'facilities', 'Lagos', 'Nigeria', 'secure', 'affordable', 'self storage',
    'No.1 storage facilities in Nigeria',
    'affordable self storage nigeria',
    'self storage near me nigeria',
    'storage facilities in nigeria',
    'storage facilities in lagos nigeria',
  ],
  noIndex: false,
});

export default async function Home() {
  const siteUrl = getSiteUrl();
  const locationDirectory = await getSiteDirectory();
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${SITE_NAME} self storage`,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    areaServed: HOME_MARKETS.map((market) => ({
      '@type': 'City',
      name: market,
    })),
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
    },
    serviceType: [...HOME_SERVICE_TYPES],
  };

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${SITE_NAME} home`,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    about: HOME_SERVICE_TYPES,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webPageJsonLd) }}
      />
      <HomePageContent
        cities={locationDirectory.cities}
        states={locationDirectory.states}
      />
    </>
  );
}
