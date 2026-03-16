import type { Repository } from 'typeorm';
import { connectTypeORM } from '@/lib/db';
import BlogPost from '@/lib/db/entities/BlogPost';

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
  repo: Repository<BlogPost>,
  rawSlug: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = slugifyBlogTitle(rawSlug) || `post-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await repo.findOne({ where: { slug: candidate } });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

export async function getBlogPostRepository() {
  const dataSource = await connectTypeORM();
  return dataSource.getRepository(BlogPost);
}

export async function listPublishedBlogPosts(): Promise<SerializedBlogPost[]> {
  const repo = await getBlogPostRepository();
  const posts = await repo.find({
    where: { published: true },
    order: {
      publishedAt: 'DESC',
      createdAt: 'DESC',
    },
  });

  return posts.map(serializeBlogPost);
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<SerializedBlogPost | null> {
  const repo = await getBlogPostRepository();
  const post = await repo.findOne({
    where: { slug, published: true },
  });

  return post ? serializeBlogPost(post) : null;
}
