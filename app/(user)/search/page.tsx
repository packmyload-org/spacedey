import type { Metadata } from 'next';
import SearchPageContent from '@/components/search/SearchPageContent';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Storage Facilities in Nigeria',
  description:
    'Search Spacedey storage facilities by city and state, compare locations on the map, and find the right self storage unit in Nigeria.',
  path: '/search',
  keywords: [
    'No.1 storage facilities in Nigeria',
    'storage facilities near me nigeria',
    'self storage map nigeria',
    'book storage unit online nigeria',
  ],
  noIndex: false,
});

export default function SearchPage() {
  return <SearchPageContent />;
}
