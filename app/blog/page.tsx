import type { Metadata } from 'next';
import BlogHero from '@/components/blog/BlogHero';
import BlogList from '@/components/blog/BlogList';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Storage Blog and Moving Guides',
  description:
    'Read Spacedey guides on self storage, moving, packing, and business inventory management in Nigeria.',
  path: '/blog',
  keywords: [
    'storage blog nigeria',
    'moving tips nigeria',
    'packing guide lagos',
    'self storage advice',
  ],
});

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
