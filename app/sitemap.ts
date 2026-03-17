import type { MetadataRoute } from 'next';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import { listPublishedBlogPosts } from '@/lib/services/blogPosts';
import { getSiteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const staticRoutes = [
    '',
    '/search',
    '/locations',
    '/sizing',
    '/products',
    '/blog',
    '/referral',
    '/landlord',
  ];

  const blogPosts = await listPublishedBlogPosts();
  let locationRoutes: MetadataRoute.Sitemap = [];

  try {
    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(Site);
    const sites = await repo.find({
      select: {
        id: true,
        updatedAt: true,
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    locationRoutes = sites.map((site) => ({
      url: `${siteUrl}/locations/${site.id}`,
      lastModified: site.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  } catch (error) {
    console.error('Failed to build location sitemap entries', error);
  }

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...locationRoutes,
  ];
}
