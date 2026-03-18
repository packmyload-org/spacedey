'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ImagePlus,
  PencilLine,
  Save,
  Trash2,
} from 'lucide-react';

interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  author: string;
  published: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

interface BlogFormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  published: boolean;
}

const EMPTY_FORM: BlogFormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image: '',
  author: '',
  published: true,
};

function formatDate(value: string | null) {
  if (!value) {
    return 'Draft';
  }

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function mapPostToForm(post: BlogPostRecord): BlogFormState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image || '',
    author: post.author,
    published: post.published,
  };
}

function BlogOverviewCard({
  post,
  onEdit,
}: {
  post: BlogPostRecord;
  onEdit: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-[#D8E2FF] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#BCD0FF]">
      {post.image ? (
        <div className="relative h-52 overflow-hidden bg-[#EEF3FF]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-52 items-center justify-center bg-[#EEF3FF] px-6 text-center">
          <p className="text-sm font-semibold text-[#7386B9]">No cover image yet</p>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#5D74B0]">
              {formatDate(post.publishedAt || post.updatedAt)}
            </p>
            <h3 className="mt-3 text-xl font-black leading-tight text-[#0F172A]">
              {post.title}
            </h3>
          </div>
          <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${
            post.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {post.published ? 'Live' : 'Draft'}
          </span>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#5D74B0]">{post.excerpt}</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E6EEFF] pt-4">
          <p className="text-sm font-semibold text-[#1138D8]">{post.author}</p>
          <div className="flex flex-wrap gap-2">
            {post.published ? (
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-[#D8E2FF] px-4 py-2 text-sm font-bold text-[#1642F0] transition hover:bg-[#F0F4FF]"
              >
                Preview
                <ExternalLink className="h-4 w-4" />
              </Link>
            ) : null}
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-full bg-[#1642F0] px-4 py-2 text-sm font-black text-white transition hover:bg-[#1138D8]"
            >
              <PencilLine className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function AdminBlogsSkeleton() {
  return (
    <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-[#D8E2FF] bg-white p-5 shadow-sm xl:sticky xl:top-28 xl:max-h-[calc(100vh-8.5rem)] xl:overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="h-7 w-24 animate-pulse rounded-xl bg-[#E8EEFF]" />
            <div className="mt-3 h-4 w-52 animate-pulse rounded-lg bg-[#EEF3FF]" />
          </div>
          <div className="h-10 w-24 animate-pulse rounded-full bg-[#E8EEFF]" />
        </div>

        <div className="mt-6 space-y-3 xl:max-h-[calc(100vh-14rem)] xl:overflow-y-auto xl:pr-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#E6EEFF] bg-[#FBFCFF] px-4 py-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="h-4 w-40 animate-pulse rounded-lg bg-[#E8EEFF]" />
                <div className="h-6 w-14 animate-pulse rounded-full bg-[#EEF3FF]" />
              </div>
              <div className="mt-3 h-3 w-full animate-pulse rounded-lg bg-[#EEF3FF]" />
              <div className="mt-2 h-3 w-4/5 animate-pulse rounded-lg bg-[#EEF3FF]" />
              <div className="mt-4 flex items-center justify-between">
                <div className="h-3 w-20 animate-pulse rounded-lg bg-[#EEF3FF]" />
                <div className="h-3 w-24 animate-pulse rounded-lg bg-[#EEF3FF]" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="rounded-[32px] border border-[#D8E2FF] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 border-b border-[#E6EEFF] pb-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="h-3 w-24 animate-pulse rounded-lg bg-[#E8EEFF]" />
            <div className="mt-4 h-10 w-2/3 animate-pulse rounded-2xl bg-[#EEF3FF]" />
          </div>
          <div className="h-10 w-36 animate-pulse rounded-full bg-[#EEF3FF]" />
        </div>

        <div className="mt-8 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 2 }, (_, index) => (
              <div key={index}>
                <div className="mb-2 h-4 w-24 animate-pulse rounded-lg bg-[#E8EEFF]" />
                <div className="h-12 w-full animate-pulse rounded-2xl bg-[#F3F6FF]" />
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-6">
              <div>
                <div className="mb-2 h-4 w-24 animate-pulse rounded-lg bg-[#E8EEFF]" />
                <div className="h-32 w-full animate-pulse rounded-2xl bg-[#F3F6FF]" />
              </div>
              <div>
                <div className="mb-2 h-4 w-24 animate-pulse rounded-lg bg-[#E8EEFF]" />
                <div className="h-[340px] w-full animate-pulse rounded-2xl bg-[#F3F6FF]" />
              </div>
            </div>

            <div className="space-y-6">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index}>
                  <div className="mb-2 h-4 w-24 animate-pulse rounded-lg bg-[#E8EEFF]" />
                  <div className="h-12 w-full animate-pulse rounded-2xl bg-[#F3F6FF]" />
                </div>
              ))}
              <div className="h-16 w-full animate-pulse rounded-2xl bg-[#F3F6FF]" />
              <div className="h-20 w-full animate-pulse rounded-2xl bg-[#F3F6FF]" />
              <div className="h-48 w-full animate-pulse rounded-[24px] bg-[#F3F6FF]" />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#E6EEFF] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-4 w-60 animate-pulse rounded-lg bg-[#E8EEFF]" />
            <div className="h-12 w-36 animate-pulse rounded-full bg-[#E8EEFF]" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AdminBlogsPage() {
  const postsPerPage = 10;
  const authStore = useAuthStore();
  const [posts, setPosts] = useState<BlogPostRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [form, setForm] = useState<BlogFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? null,
    [posts, selectedPostId]
  );
  const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return posts.slice(startIndex, startIndex + postsPerPage);
  }, [currentPage, posts]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/blog-posts', {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch blog posts.');
      }

      const nextPosts = Array.isArray(data.posts) ? data.posts : [];
      setPosts(nextPosts);
      setCurrentPage(1);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch blog posts.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [authStore.accessToken]);

  useEffect(() => {
    if (authStore.isAuthenticated && authStore.isAdmin() && authStore.accessToken) {
      fetchPosts();
    }
  }, [authStore.accessToken, authStore, fetchPosts]);

  useEffect(() => {
    if (selectedPost) {
      setForm(mapPostToForm(selectedPost));
    }
  }, [selectedPost]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    const currentUser = authStore.user;

    if (!selectedPostId && currentUser) {
      setForm((current) => ({
        ...current,
        author: current.author || `${currentUser.firstName} ${currentUser.lastName}`.trim(),
      }));
    }
  }, [authStore.user, selectedPostId]);

  const handleChange = <K extends keyof BlogFormState>(field: K, value: BlogFormState[K]) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setSelectedPostId(null);
    setForm({
      ...EMPTY_FORM,
      author: authStore.user ? `${authStore.user.firstName} ${authStore.user.lastName}`.trim() : '',
      published: true,
    });
    setSuccessMessage(null);
    setError(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsEditorVisible(true);
  };

  const closeEditor = () => {
    setIsEditorVisible(false);
    setSuccessMessage(null);
    setError(null);
  };

  const handleSelectPost = (post: BlogPostRecord) => {
    setSelectedPostId(post.id);
    setForm(mapPostToForm(post));
    setSuccessMessage(null);
    setError(null);
    setIsEditorVisible(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const isEditing = Boolean(selectedPostId);
      const response = await fetch(
        isEditing ? `/api/admin/blog-posts/${selectedPostId}` : '/api/admin/blog-posts',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.accessToken}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to save blog post.');
      }

      const savedPost = data.post as BlogPostRecord;
      setPosts((current) => {
        const others = current.filter((post) => post.id !== savedPost.id);
        return [savedPost, ...others].sort((a, b) => (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ));
      });
      setCurrentPage(1);
      setSelectedPostId(savedPost.id);
      setForm(mapPostToForm(savedPost));
      setIsEditorVisible(true);
      setSuccessMessage(isEditing ? 'Blog post updated.' : 'Blog post created.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save blog post.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPostId || !selectedPost) {
      return;
    }

    if (!window.confirm(`Delete "${selectedPost.title}"?`)) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(`/api/admin/blog-posts/${selectedPostId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to delete blog post.');
      }

      setPosts((current) => current.filter((post) => post.id !== selectedPostId));
      closeEditor();
      resetForm();
      setCurrentPage(1);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete blog post.');
    } finally {
      setDeleting(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'blogs');

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to upload image.');
      }

      handleChange('image', String(data.url || ''));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  if (loading) {
    return <AdminBlogsSkeleton />;
  }

  if (!isEditorVisible) {
    return (
      <section className="rounded-[32px] border border-[#D8E2FF] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 border-b border-[#E6EEFF] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">
              Content Library
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#0F172A]">Blog posts</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5D74B0]">
              Browse published posts and drafts in a single grid, then open any item when you want to edit it.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center rounded-full bg-[#1642F0] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1138D8]"
          >
            Create new post
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm text-[#5D74B0]">
            Showing {paginatedPosts.length} of {posts.length} post{posts.length === 1 ? '' : 's'} across drafts and live content.
          </p>
          <p className="hidden rounded-full border border-[#D8E2FF] bg-[#F8FAFF] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#1642F0] md:inline-flex">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mt-8 rounded-[28px] border border-dashed border-[#D8E2FF] bg-[#FBFCFF] px-6 py-16 text-center">
            <h2 className="text-2xl font-black text-[#0F172A]">No blog posts yet</h2>
            <p className="mt-3 text-sm text-[#5D74B0]">
              Create your first article to populate the admin library and public blog.
            </p>
            <button
              type="button"
              onClick={openCreateForm}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1642F0] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1138D8]"
            >
              Start writing
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {paginatedPosts.map((post) => (
              <BlogOverviewCard
                key={post.id}
                post={post}
                onEdit={() => handleSelectPost(post)}
              />
            ))}
          </div>
        )}

        {posts.length > postsPerPage ? (
          <nav className="mt-10 flex items-center justify-center gap-2">
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
      </section>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-[#D8E2FF] bg-white p-5 shadow-sm xl:sticky xl:top-28 xl:max-h-[calc(100vh-8.5rem)] xl:overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A]">Blogs</h1>
            <p className="mt-1 text-sm text-[#5D74B0]">Create and publish what appears on the public blog.</p>
          </div>

          {selectedPost ? (
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center rounded-full border border-[#D8E2FF] px-4 py-2 text-sm font-bold text-[#1642F0] transition hover:bg-[#F0F4FF]"
            >
              New post
            </button>
          ) : null}
        </div>

        <div className="mt-6 space-y-3 xl:max-h-[calc(100vh-14rem)] xl:overflow-y-auto xl:pr-2">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D8E2FF] px-4 py-8 text-center text-sm text-[#5D74B0]">
              No posts yet. Create your first article.
            </div>
          ) : (
            posts.map((post) => {
              const isActive = selectedPostId === post.id;

              return (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => handleSelectPost(post)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                    isActive
                      ? 'border-[#1642F0] bg-[#F0F4FF]'
                      : 'border-[#E6EEFF] bg-white hover:border-[#BCD0FF] hover:bg-[#F8FAFF]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-bold text-[#0F172A]">{post.title}</h2>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${
                      post.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {post.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#5D74B0]">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-[#7386B9]">
                    <span>{post.author}</span>
                    <span>{formatDate(post.publishedAt || post.updatedAt)}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section className="rounded-[32px] border border-[#D8E2FF] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 border-b border-[#E6EEFF] pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">
              {selectedPost ? 'Edit Post' : 'New Post'}
            </p>
            <h2 className="mt-2 text-3xl font-black text-[#0F172A]">
              {selectedPost ? selectedPost.title : 'Write a new article'}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={closeEditor}
              className="inline-flex items-center gap-2 rounded-full border border-[#D8E2FF] px-4 py-2 text-sm font-bold text-[#5D74B0] transition hover:bg-[#F8FAFF]"
            >
              Back to library
            </button>
            {selectedPost?.published ? (
              <Link
                href={`/blog/${selectedPost.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-[#D8E2FF] px-4 py-2 text-sm font-bold text-[#1642F0] transition hover:bg-[#F0F4FF]"
              >
                Preview live post
                <ExternalLink className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#0F172A]">Title</span>
              <input
                type="text"
                value={form.title}
                onChange={(event) => handleChange('title', event.target.value)}
                required
                className="w-full rounded-2xl border border-[#C9D8FF] px-4 py-3 text-sm outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D7E3FF]"
                placeholder="A headline readers will want to open"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#0F172A]">Slug</span>
              <input
                type="text"
                value={form.slug}
                onChange={(event) => handleChange('slug', event.target.value)}
                className="w-full rounded-2xl border border-[#C9D8FF] px-4 py-3 text-sm outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D7E3FF]"
                placeholder="Optional. Auto-generated if blank"
              />
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-6">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#0F172A]">Excerpt</span>
                <textarea
                  value={form.excerpt}
                  onChange={(event) => handleChange('excerpt', event.target.value)}
                  required
                  rows={4}
                  className="w-full rounded-2xl border border-[#C9D8FF] px-4 py-3 text-sm outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D7E3FF]"
                  placeholder="Short summary for blog cards and previews"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#0F172A]">Content</span>
                <textarea
                  value={form.content}
                  onChange={(event) => handleChange('content', event.target.value)}
                  required
                  rows={16}
                  className="w-full rounded-2xl border border-[#C9D8FF] px-4 py-3 text-sm outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D7E3FF]"
                  placeholder="Write the full article here"
                />
              </label>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#0F172A]">Author</span>
                <input
                  type="text"
                  value={form.author}
                  onChange={(event) => handleChange('author', event.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#C9D8FF] px-4 py-3 text-sm outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D7E3FF]"
                  placeholder="Author name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#0F172A]">Cover Image URL</span>
                <input
                  type="url"
                  value={form.image}
                  onChange={(event) => handleChange('image', event.target.value)}
                  className="w-full rounded-2xl border border-[#C9D8FF] px-4 py-3 text-sm outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D7E3FF]"
                  placeholder="https://..."
                />
              </label>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#BCD0FF] bg-[#F8FAFF] px-4 py-4 text-sm font-bold text-[#1642F0] transition hover:bg-[#F0F4FF]">
                <ImagePlus className="h-4 w-4" />
                {uploadingImage ? 'Uploading...' : 'Upload image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-[#D8E2FF] bg-[#F8FAFF] px-4 py-4">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(event) => handleChange('published', event.target.checked)}
                  className="h-4 w-4 rounded border-[#BCD0FF] text-[#1642F0] focus:ring-[#1642F0]"
                />
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">Publish this post</p>
                  <p className="text-xs text-[#5D74B0]">Turn this off to keep the article in draft mode.</p>
                </div>
              </label>

              {form.image ? (
                <div className="overflow-hidden rounded-[24px] border border-[#D8E2FF] bg-[#F8FAFF]">
                  <div className="relative h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="Blog cover preview" className="h-full w-full object-cover" />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#E6EEFF] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#5D74B0]">
              {selectedPost ? (
                <span className="inline-flex items-center gap-2">
                  <PencilLine className="h-4 w-4" />
                  Editing <strong className="text-[#0F172A]">{selectedPost.slug}</strong>
                </span>
              ) : (
                'New posts will appear in the public blog as soon as they are published.'
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {selectedPost ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[#1642F0] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1138D8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : selectedPost ? 'Save changes' : 'Create post'}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
