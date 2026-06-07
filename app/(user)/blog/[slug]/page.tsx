import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { extractFaqsFromBlogContent, getBlogActionLinks } from '@/lib/blogSeo';
import { getPublishedBlogPostBySlug, listPublishedBlogPosts } from '@/lib/services/blogPosts';
import { getBlogKeywords, serializeJsonLd, SITE_NAME, toAbsoluteUrl } from '@/lib/seo';

export const dynamicParams = false;

function formatBlogDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export async function generateStaticParams() {
  const posts = await listPublishedBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `/blog/${post.slug}`;
  const keywords = getBlogKeywords(post.title, post.excerpt);

  return {
    title: post.title.split(':')[0].slice(0, 20) + '...',
    description: post.excerpt,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title.split(':')[0].slice(0, 20) + '...',
      description: post.excerpt,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      authors: [post.author],
      tags: keywords,
      images: post.image
        ? [
            {
              url: post.image,
              alt: post.title,
            },
          ] 
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.split(':')[0].slice(0, 20) + '...',
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = (await listPublishedBlogPosts())
    .filter((candidate) => candidate.id !== post.id)
    .slice(0, 3);
  const articleUrl = toAbsoluteUrl(`/blog/${post.slug}`);
  const keywords = getBlogKeywords(post.title, post.excerpt);
  const faqs = extractFaqsFromBlogContent(post.content);
  const actionLinks = getBlogActionLinks(post.title, post.excerpt);
  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image ? [post.image] : undefined,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: articleUrl,
    keywords: keywords.join(', '),
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Blog',
        item: toAbsoluteUrl('/blog'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.title,
        item: articleUrl,
      },
    ],
  };
  const faqJsonLd = faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        />
      ) : null}

      <main className="px-6 pb-20 pt-28 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <Link href="/blog" className="text-sm font-bold text-[#1642F0] transition hover:text-[#1138D8]">
            Back to Blog
          </Link>

          <div className="mt-6 rounded-[36px] bg-white p-8 shadow-[0_24px_70px_rgba(17,56,216,0.08)] md:p-12">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">
              {formatBlogDate(post.publishedAt) || 'Spacedey Blog'}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-[#0F172A] md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#5D74B0]">
              <span className="rounded-full bg-[#EDF3FF] px-4 py-2 font-bold text-[#1138D8]">{post.author}</span>
              <span>{post.excerpt}</span>
            </div>

            {post.image ? (
              <div className="relative mt-10 h-[320px] overflow-hidden rounded-[28px] bg-[#EAF0FF] md:h-[460px]">
                {post.image.startsWith('http') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                )}
              </div>
            ) : null}

            <article className="mt-10 whitespace-pre-line text-base leading-8 text-[#334155]">
              {post.content}
            </article>

            <section className="mt-10 rounded-[28px] border border-[#D8E2FF] bg-[#F8FAFF] p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">Next steps</p>
              <h2 className="mt-3 text-2xl font-black text-[#0F172A]">Keep the research moving</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {actionLinks.map((link, i) => (
                  <Link
                    key={link.href + i}
                    href={link.href}
                    className="rounded-3xl border border-[#D8E2FF] bg-white p-5 transition hover:-translate-y-1"
                  >
                    <p className="text-base font-black text-[#0F172A]">{link.label}</p>
                    <p className="mt-3 text-sm leading-6 text-[#475569]">{link.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {relatedPosts.length > 0 ? (
            <section className="mt-12">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">Keep Reading</p>
                  <h2 className="mt-3 text-3xl font-black text-[#0F172A]">More from the journal</h2>
                </div>
                <Link href="/blog" className="text-sm font-bold text-[#1642F0]">
                  View all posts
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="rounded-3xl border border-[#D8E2FF] bg-white p-6 shadow-[0_16px_40px_rgba(17,56,216,0.06)] transition hover:-translate-y-1"
                  >
                    <p className="text-sm font-medium text-[#5D74B0]">{formatBlogDate(relatedPost.publishedAt)}</p>
                    <h3 className="mt-4 text-xl font-black text-[#0F172A]">{relatedPost.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-[#475569]">{relatedPost.excerpt}</p>
                    <p className="mt-5 text-sm font-bold text-[#1642F0]">{relatedPost.author}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
