import type { Metadata } from 'next';
import BlogHero from '@/components/blog/BlogHero';
import BlogList from '@/components/blog/BlogList';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { listPublishedBlogPosts } from '@/lib/services/blogPosts';
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
  noIndex: false
});

export default async function Page() {
  const posts = await listPublishedBlogPosts();

  return (
    <div>
      <Header />
      <BlogHero />
      <BlogList initialPosts={posts} />
      <Footer />
    </div>
  )
}
