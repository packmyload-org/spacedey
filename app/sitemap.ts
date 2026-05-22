import type { MetadataRoute } from 'next';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import { listPublishedBlogPosts } from '@/lib/services/blogPosts';
import { getSiteUrl } from '@/lib/seo';
import { ChangeFrequency } from '@/lib/enums/changeFrequency';
import { SitemapPriority } from '@/lib/enums/sitemapPriority';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const staticRoutes = [
    '/',
    '/search',
    '/locations',
    '/sizing',
    '/products',
    '/blog',
    '/referral',
    '/landlord',
  ];

  const [blogPostsResult] = await Promise.allSettled([
    listPublishedBlogPosts(),
  ]);
  const blogPosts = blogPostsResult.status === 'fulfilled' ? blogPostsResult.value : [];
  let locationRoutes: MetadataRoute.Sitemap = [];

  if (blogPostsResult.status === 'rejected') {
    console.error('Failed to build blog sitemap entries', blogPostsResult.reason);
  }

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
      changeFrequency: ChangeFrequency.WEEKLY,
      priority: SitemapPriority.LOCATION,
    }));
  } catch (error) {
    console.error('Failed to build location sitemap entries', error);
  }

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: route === '' ? ChangeFrequency.DAILY : ChangeFrequency.WEEKLY,
      priority: route === '' ? SitemapPriority.HOME : SitemapPriority.STATIC,
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: ChangeFrequency.MONTHLY,
      priority: SitemapPriority.BLOG_POST,
    })),
  ];
}
