import type { Metadata } from 'next';
import HomePageContent from "@/components/home/HomePageContent";
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Self Storage Units in Nigeria',
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
});

export default function Home() {
  return <HomePageContent />;
}
