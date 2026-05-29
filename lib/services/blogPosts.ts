import { cache } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import BlogPost from '@/lib/db/entities/BlogPost';
import { mapBlogPost } from '@/lib/db/mappers';

export interface SerializedBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  author: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function serializeBlogPost(post: BlogPost): SerializedBlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    author: post.author,
    published: post.published,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

export function slugifyBlogTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export async function ensureUniqueBlogSlug(
  rawSlug: string,
  excludeId?: string
): Promise<string> {
  const supabase = createAdminClient();
  const baseSlug = slugifyBlogTitle(rawSlug) || `post-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id, slug')
      .eq('slug', candidate)
      .maybeSingle();

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

const listPublishedBlogPostsCached = cache(async (): Promise<SerializedBlogPost[]> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('publishedAt', { ascending: false })
    .order('createdAt', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => serializeBlogPost(mapBlogPost(row)));
});

const getPublishedBlogPostBySlugCached = cache(
  async (slug: string): Promise<SerializedBlogPost | null> => {
    const posts = await listPublishedBlogPostsCached();
    return posts.find((post) => post.slug === slug) ?? null;
  }
);

export async function listPublishedBlogPosts(): Promise<SerializedBlogPost[]> {
  return listPublishedBlogPostsCached();
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<SerializedBlogPost | null> {
  return getPublishedBlogPostBySlugCached(slug);
}
