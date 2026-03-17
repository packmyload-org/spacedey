'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { EMAIL_INPUT_PROPS, normalizeEmail } from '@/lib/utils/email';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  author: string;
  publishedAt: string | null;
}

function formatBlogDate(value: string | null) {
  if (!value) {
    return 'Draft';
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

function BlogCard({
  post,
  featured = false,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = !imageFailed && post.image ? post.image : '/images/blogpost1.png';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-[#D8E2FF] bg-white shadow-[0_18px_45px_rgba(17,56,216,0.08)] transition-transform duration-300 hover:-translate-y-1 ${
        featured ? 'lg:min-h-[540px]' : ''
      }`}
    >
      <div
        className={`relative overflow-hidden bg-[#EAF0FF] ${
          featured ? 'h-72 md:h-80 lg:h-[340px]' : 'h-64'
        }`}
      >
        {imageSrc.startsWith('http') ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={post.title}
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            onError={() => setImageFailed(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-medium text-[#5D74B0]">{formatBlogDate(post.publishedAt)}</p>
        <h2
          className={`mt-3 font-black leading-tight text-[#0F172A] transition-colors group-hover:text-[#1642F0] ${
            featured ? 'text-[2rem] md:text-[2.25rem]' : 'text-2xl'
          }`}
        >
          {post.title}
        </h2>
        <p className={`mt-4 flex-1 text-[#475569] ${featured ? 'text-base leading-7' : 'text-sm leading-6'}`}>
          {post.excerpt}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-[#E5ECFF] pt-4">
          <span className="text-sm font-semibold text-[#1138D8]">{post.author}</span>
          <span className="text-sm font-bold text-[#1642F0]">Read article</span>
        </div>
      </div>
    </Link>
  );
}

function BlogCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-[#D8E2FF] bg-white shadow-[0_18px_45px_rgba(17,56,216,0.08)] ${
        featured ? 'lg:min-h-[540px]' : ''
      }`}
    >
      <div
        className={`animate-pulse bg-[#EAF0FF] ${
          featured ? 'h-72 md:h-80 lg:h-[340px]' : 'h-64'
        }`}
      />

      <div className="space-y-4 p-6">
        <div className="h-4 w-28 animate-pulse rounded-lg bg-[#E8EEFF]" />
        <div className={`animate-pulse rounded-xl bg-[#EEF3FF] ${featured ? 'h-12 w-4/5' : 'h-10 w-full'}`} />
        <div className="h-4 w-full animate-pulse rounded-lg bg-[#F1F5FF]" />
        <div className="h-4 w-5/6 animate-pulse rounded-lg bg-[#F1F5FF]" />
        <div className="border-t border-[#E5ECFF] pt-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 animate-pulse rounded-lg bg-[#E8EEFF]" />
            <div className="h-4 w-20 animate-pulse rounded-lg bg-[#EEF3FF]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogListSkeleton() {
  return (
    <>
      <div>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="h-3 w-24 animate-pulse rounded-lg bg-[#DDE7FF]" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded-lg bg-[#E8EEFF]" />
          </div>
          <div className="hidden h-9 w-28 animate-pulse rounded-full bg-white md:block" />
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <BlogCardSkeleton featured />
          </div>
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      </div>

      <div className="my-10 grid gap-8 xl:grid-cols-3 xl:items-stretch">
        <div className="rounded-[32px] border border-[#BFD3FF] bg-[radial-gradient(circle_at_top_left,#2D63FF_0%,#1642F0_44%,#1233A3_100%)] p-6 shadow-[0_26px_80px_rgba(17,56,216,0.2)] md:p-8">
          <div className="h-8 w-32 animate-pulse rounded-full bg-white/15" />
          <div className="mt-5 h-10 w-5/6 animate-pulse rounded-2xl bg-white/18" />
          <div className="mt-3 h-4 w-full animate-pulse rounded-lg bg-white/12" />
          <div className="mt-2 h-4 w-4/5 animate-pulse rounded-lg bg-white/12" />
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="h-9 w-28 animate-pulse rounded-full bg-white/12" />
            <div className="h-9 w-32 animate-pulse rounded-full bg-white/12" />
            <div className="h-9 w-24 animate-pulse rounded-full bg-white/12" />
          </div>
          <div className="mt-8 space-y-4">
            <div className="h-12 w-full animate-pulse rounded-2xl bg-white/95" />
            <div className="h-12 w-full animate-pulse rounded-full bg-white/20" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:col-span-2">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        <BlogCardSkeleton />
        <BlogCardSkeleton />
        <BlogCardSkeleton />
      </div>
    </>
  );
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState<string | null>(null);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);

  const postsPerPage = 10;
  const leadPostsCount = 5;

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/blog/posts');
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load blog posts.');
        }

        setPosts(Array.isArray(data.posts) ? data.posts : []);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load blog posts.');
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return posts.slice(startIndex, startIndex + postsPerPage);
  }, [currentPage, posts]);
  const leadPosts = currentPosts.slice(0, leadPostsCount);
  const remainingPosts = currentPosts.slice(leadPostsCount);
  const postsBesideNewsletter = remainingPosts.slice(0, 2);
  const trailingPosts = remainingPosts.slice(2);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingNewsletter(true);
    setNewsletterError(null);
    setNewsletterMessage(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to subscribe.');
      }

      setNewsletterMessage(
        data?.alreadySubscribed
          ? 'You are already subscribed to updates.'
          : 'Thanks for subscribing to Spacedey updates.'
      );
      setEmail('');
    } catch (submitError) {
      setNewsletterError(submitError instanceof Error ? submitError.message : 'Failed to subscribe.');
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };

  return (
    <section className="bg-[#F5F8FF] px-6 py-14 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">Storage Journal</p>
            <h2 className="mt-3 text-3xl font-black text-[#0F172A] md:text-4xl">Fresh advice from the Spacedey team</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-[#475569]">
            Find packing ideas, business storage tips, and practical answers for making the most of your space.
          </p>
        </div>

        {isLoading ? (
          <BlogListSkeleton />
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-6 text-sm text-red-700">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl border border-[#D8E2FF] bg-white px-6 py-16 text-center">
            <h3 className="text-2xl font-black text-[#0F172A]">No blog posts yet</h3>
            <p className="mt-3 text-sm text-[#5D74B0]">Published posts from the admin dashboard will show up here.</p>
          </div>
        ) : (
          <>
            <div>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5D74B0]">
                    Latest posts
                  </p>
                  <p className="mt-2 text-sm text-[#5E6C91]">
                    The newest Spacedey articles appear here first before the newsletter break.
                  </p>
                </div>
                <p className="hidden rounded-full border border-[#D8E2FF] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#1642F0] md:inline-flex">
                  {leadPosts.length} fresh reads
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                {leadPosts[0] ? (
                  <div className="xl:col-span-2">
                    <BlogCard post={leadPosts[0]} featured />
                  </div>
                ) : null}

                {leadPosts[1] ? <BlogCard post={leadPosts[1]} /> : null}

                {leadPosts.slice(2).map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            <div className="my-10 grid gap-8 xl:grid-cols-3 xl:items-stretch">
              <div className="rounded-[32px] border border-[#BFD3FF] bg-[radial-gradient(circle_at_top_left,#2D63FF_0%,#1642F0_44%,#1233A3_100%)] p-4 text-white shadow-[0_26px_80px_rgba(17,56,216,0.2)] md:p-8">
                <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-white/90 md:inline-flex">
                  <Mail className="h-3.5 w-3.5" />
                  Newsletter
                </div>
                <h3 className="mt-5 hidden text-3xl font-black leading-tight md:block md:text-[2rem]">
                  Get practical storage advice before the next article drop.
                </h3>
                <p className="mt-4 hidden text-sm leading-7 text-[#DCE6FF] md:block md:text-base">
                  Subscribe for grounded moving tips, storage planning ideas, and business-use guidance from the Spacedey team.
                </p>

                <div className="mt-6 hidden flex-wrap gap-3 text-sm font-semibold text-white/90 md:flex">
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Moving guides</span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Storage planning</span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Business tips</span>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-4 md:mt-8">
                  <label className="block">
                    <span className="mb-2 hidden text-xs font-black uppercase tracking-[0.2em] text-white/70 md:block">
                      Email Address
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(normalizeEmail(event.target.value))}
                      required
                      className="w-full rounded-2xl border border-white/18 bg-white/96 px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#7A88B8] focus:border-white focus:ring-2 focus:ring-white/35"
                      {...EMAIL_INPUT_PROPS}
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmittingNewsletter}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-black text-[#1642F0] transition hover:bg-[#EAF0FF] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmittingNewsletter ? 'Subscribing...' : 'Subscribe to Updates'}
                    {!isSubmittingNewsletter ? <ArrowRight className="h-4 w-4" /> : null}
                  </button>

                  {newsletterMessage ? (
                    <p className="rounded-2xl border border-white/18 bg-white/92 px-4 py-3 text-sm font-medium text-green-700">
                      {newsletterMessage}
                    </p>
                  ) : null}

                  {newsletterError ? (
                    <p className="rounded-2xl border border-white/18 bg-white/92 px-4 py-3 text-sm font-medium text-red-700">
                      {newsletterError}
                    </p>
                  ) : null}
                </form>
              </div>

              <div className="grid gap-8 md:grid-cols-2 xl:col-span-2">
                {postsBesideNewsletter.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {trailingPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {trailingPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : null}

            {totalPages > 1 ? (
              <nav className="mt-12 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9D8FF] bg-white text-[#1138D8] transition hover:bg-[#F0F4FF] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-black transition ${
                      page === currentPage
                        ? 'bg-[#1642F0] text-white'
                        : 'border border-[#C9D8FF] bg-white text-[#1138D8] hover:bg-[#F0F4FF]'
                    }`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9D8FF] bg-white text-[#1138D8] transition hover:bg-[#F0F4FF] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
