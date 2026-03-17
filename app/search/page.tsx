import type { Metadata } from 'next';
import SearchPageContent from '@/components/search/SearchPageContent';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Find Storage Facilities in Nigeria',
  description:
    'Search Spacedey storage facilities by city and state, compare locations on the map, and find the right self storage unit in Nigeria.',
  path: '/search',
  keywords: [
    'find storage near me nigeria',
    'search storage locations lagos',
    'self storage map nigeria',
    'storage facilities by city nigeria',
    'book storage unit online nigeria',
  ],
});

export default function SearchPage() {
  return <SearchPageContent />;
}
