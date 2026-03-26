import type { Metadata } from 'next';
import HomePageContent from "@/components/home/HomePageContent";
import { HOME_FAQS, HOME_MARKETS, HOME_SERVICE_TYPES } from '@/lib/homeSeoContent';
import { buildPageMetadata, getSiteUrl, serializeJsonLd, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Affordable Self Storage in Nigeria',
  description:
    'Compare and reserve secure self storage units in Lagos and across Nigeria for personal items, business inventory, and moving support.',
  path: '/',
  keywords: [
    'affordable self storage nigeria',
    'self storage near me nigeria',
    'storage units in nigeria',
    'self storage lagos nigeria',
    'secure storage units nigeria',
    'business storage lagos',
    'personal storage nigeria',
    'reserve self storage online',
  ],
  noIndex: false,
});

export default function Home() {
  const siteUrl = getSiteUrl();
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
      <HomePageContent />
    </>
  );
}
