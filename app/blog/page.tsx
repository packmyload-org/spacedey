import type { Metadata } from 'next';
import BlogHero from '@/components/blog/BlogHero';
import BlogList from '@/components/blog/BlogList';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { DEFAULT_KEYWORDS } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Storage Blog and Moving Guides',
  description:
    'Read Spacedey guides on self storage, moving, packing, and business inventory management in Nigeria.',
  keywords: [
    ...DEFAULT_KEYWORDS,
    'storage blog nigeria',
    'moving tips nigeria',
    'packing guide lagos',
    'self storage advice',
  ],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Spacedey Blog | Self Storage Guides',
    description:
      'Storage ideas, packing checklists, and moving guides designed for customers across Nigeria.',
    url: '/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spacedey Blog | Self Storage Guides',
    description:
      'Storage ideas, packing checklists, and moving guides designed for customers across Nigeria.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return (
    <div>
      <Header />
      <BlogHero />
      <BlogList/>
      <Footer />
    </div>
  )
}
