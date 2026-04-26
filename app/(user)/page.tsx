import type { Metadata } from 'next';
import HomePageContent from "@/components/home/HomePageContent";
import { HOME_FAQS, HOME_SERVICE_TYPES } from '@/lib/homeSeoContent';
import { getSiteDirectory } from '@/lib/services/siteDirectory';
import { buildPageMetadata, getSiteUrl, serializeJsonLd, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Secure Storage Facilities in Lagos, Nigeria | Spacedey',
  description:
    'Compare and reserve secure self storage facilities in Lagos and across Nigeria for personal items, business inventory, and moving support.',
  path: '/',
  keywords: [
    'Best', 'Storage', 'Top', 'facilities', 'Lagos', 'Nigeria', 'secure', 'affordable', 'self storage',
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
