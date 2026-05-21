import type { Metadata } from 'next';
import HomePageContent from "@/components/home/HomePageContent";
import { HOME_FAQS, HOME_SERVICE_TYPES } from '@/lib/homeSeoContent';
import { getSiteDirectory } from '@/lib/services/siteDirectory';
import { buildPageMetadata, getSiteUrl, serializeJsonLd, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Secure Storage Facilities in Lagos, Nigeria',
  description:
    'Compare and reserve secure self storage facilities in Lagos and across Nigeria for personal items, business inventory, and moving support.',
  path: '/',
  keywords: [
    'Best', 'Storage', 'Top', 'facilities', 'Lagos', 'Nigeria', 'secure', 'affordable', 'self storage',
  ],
  noIndex: false,
});

export default async function Home() {
const locationDirectory = await getSiteDirectory();
  return (
    <>
      <HomePageContent
        cities={locationDirectory.cities}
        states={locationDirectory.states}
      />
    </>
  );
}
