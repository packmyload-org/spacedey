'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Mail } from 'lucide-react';

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

function BlogCard({ post }: { post: BlogPost }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = !imageFailed && post.image ? post.image : '/images/blogpost1.png';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#D8E2FF] bg-white shadow-[0_18px_45px_rgba(17,56,216,0.08)] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative h-64 overflow-hidden bg-[#EAF0FF]">
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
        <h2 className="mt-3 text-2xl font-black leading-tight text-[#0F172A] transition-colors group-hover:text-[#1642F0]">
          {post.title}
        </h2>
        <p className="mt-4 flex-1 text-sm leading-6 text-[#475569]">{post.excerpt}</p>

        <div className="mt-6 flex items-center justify-between border-t border-[#E5ECFF] pt-4">
          <span className="text-sm font-semibold text-[#1138D8]">{post.author}</span>
          <span className="text-sm font-bold text-[#1642F0]">Read article</span>
        </div>
      </div>
    </Link>
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

  const postsPerPage = 6;

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
  const featuredPosts = currentPosts.slice(0, 3);
  const remainingPosts = currentPosts.slice(3);

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
          <div className="rounded-3xl border border-[#D8E2FF] bg-white px-6 py-20 text-center text-[#5D74B0]">
            Loading articles...
          </div>
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
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {featuredPosts.map((post, index) => (
                <div key={post.id} className={index === 0 ? 'lg:col-span-2' : ''}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>

            <div className="my-10 overflow-hidden rounded-[36px] border border-[#BFD3FF] bg-[radial-gradient(circle_at_top_left,#2D63FF_0%,#1642F0_38%,#0F2FA5_100%)] text-white shadow-[0_26px_80px_rgba(17,56,216,0.22)]">
              <div className="grid gap-8 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-12">
                <div className="relative">
                  <div className="absolute -left-12 top-0 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute bottom-0 right-8 h-28 w-28 rounded-full bg-[#8FB0FF]/20 blur-2xl" />

                  <div className="relative">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-white/90">
                      <Mail className="h-3.5 w-3.5" />
                      Newsletter
                    </div>
                    <h3 className="mt-5 max-w-2xl text-3xl font-black leading-tight md:text-4xl">
                      Get storage ideas, moving checklists, and smart space tips before everyone else.
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#DCE6FF] md:text-base">
                      Subscribe for practical guides from the Spacedey team, from move-day prep and business storage to decluttering, packing, and getting more value from every square foot.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-white/90">
                      <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Moving guides</span>
                      <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Storage planning</span>
                      <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Business inventory tips</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/12 bg-white p-5 text-[#0F172A] shadow-[0_22px_50px_rgba(9,26,92,0.2)] md:p-6">
                  <p className="text-sm font-bold text-[#1138D8]">Join the Spacedey update list</p>
                  <p className="mt-2 text-sm leading-6 text-[#5D74B0]">
                    One strong email address gets you first access to fresh articles and storage insights.
                  </p>

                  <form onSubmit={handleSubscribe} className="mt-6 space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-[#7386B9]">
                        Email Address
                      </span>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        className="w-full rounded-2xl border border-[#C4D5FF] bg-[#F8FAFF] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D7E3FF]"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmittingNewsletter}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1642F0] px-4 py-3 text-sm font-black text-white transition hover:bg-[#1138D8] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmittingNewsletter ? 'Subscribing...' : 'Subscribe to Updates'}
                      {!isSubmittingNewsletter ? <ArrowRight className="h-4 w-4" /> : null}
                    </button>

                    {newsletterMessage ? (
                      <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                        {newsletterMessage}
                      </p>
                    ) : null}

                    {newsletterError ? (
                      <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {newsletterError}
                      </p>
                    ) : null}
                  </form>
                </div>
              </div>
            </div>

            {remainingPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {remainingPosts.map((post) => (
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
