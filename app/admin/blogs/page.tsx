'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import {
  ExternalLink,
  ImagePlus,
  Loader,
  PencilLine,
  Plus,
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

export default function AdminBlogsPage() {
  const authStore = useAuthStore();
  const [posts, setPosts] = useState<BlogPostRecord[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
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

  const handleSelectPost = (post: BlogPostRecord) => {
    setSelectedPostId(post.id);
    setForm(mapPostToForm(post));
    setSuccessMessage(null);
    setError(null);
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
      setSelectedPostId(savedPost.id);
      setForm(mapPostToForm(savedPost));
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
      resetForm();
      setSuccessMessage('Blog post deleted.');
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
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-[#1642F0]" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-[#D8E2FF] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A]">Blogs</h1>
            <p className="mt-1 text-sm text-[#5D74B0]">Create and publish what appears on the public blog.</p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1642F0] text-white transition hover:bg-[#1138D8]"
            aria-label="Create new post"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-3">
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
