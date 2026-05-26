import type { Metadata } from 'next';
import HomePageContent from "@/components/home/HomePageContent";
import { HOME_FAQS, HOME_MARKETS, HOME_SERVICE_TYPES } from '@/lib/homeSeoContent';
import { getSiteDirectory } from '@/lib/services/siteDirectory';
import { buildPageMetadata, SITE_NAME, SITE_DESCRIPTION, getSiteUrl, serializeJsonLd } from '@/lib/seo';
import Script from 'next/script';

export const metadata: Metadata = buildPageMetadata({
  title: 'Home | Self Storage Facilities in Lagos, Nigeria',
  description:
    'Affordable, Secure self storage facilities in Lagos and across Nigeria for personal items, business inventory, and moving support. 24/7 availablity and support',
  path: '/',
  keywords: [
    'Best', 'Storage', 'Top', 'facilities', 'Lagos', 'Nigeria', 'affordable', 'self storage', 'secure', 'self storage',
  ],
  noIndex: false,
});

export const revalidate = 3600;

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
      <HomePageContent
        cities={locationDirectory.cities}
        states={locationDirectory.states}
      />
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceJsonLd) }}
      />
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webPageJsonLd) }}
      />

    </>
  );
}
