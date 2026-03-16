import type { Metadata } from 'next';
import HomePageContent from "@/components/home/HomePageContent";
import { DEFAULT_KEYWORDS } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Self Storage Units in Nigeria',
  description:
    'Reserve secure self storage units in Lagos and across Nigeria for personal items, business inventory, and flexible storage needs.',
  keywords: [
    ...DEFAULT_KEYWORDS,
    'self storage units in nigeria',
    'self storage lagos nigeria',
    'business storage lagos',
    'personal storage nigeria',
    'reserve storage unit online',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Spacedey | Self Storage Units in Nigeria',
    description:
      'Reserve secure self storage units in Lagos and across Nigeria for personal items, business inventory, and flexible storage needs.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spacedey | Self Storage Units in Nigeria',
    description:
      'Reserve secure self storage units in Lagos and across Nigeria for personal items, business inventory, and flexible storage needs.',
  },
};

export default function Home() {
  return <HomePageContent />;
}
