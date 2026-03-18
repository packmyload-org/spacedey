import type { Metadata } from 'next';
import HomePageContent from "@/components/home/HomePageContent";
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Best and Affordable Self Storage Units near you | Spacedey',
  description:
    'Reserve secure self storage units in Lagos and across Nigeria for personal items, business inventory, and flexible storage needs.',
  path: '/',
  keywords: [
    'self storage units in nigeria',
    'self storage lagos nigeria',
    'business storage lagos',
    'personal storage nigeria',
    'reserve storage unit online',
  ],
  "noIndex": false,
});

export default function Home() {
  return <HomePageContent />;
}
