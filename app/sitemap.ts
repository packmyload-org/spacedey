import type { MetadataRoute } from 'next';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import { listPublishedBlogPosts } from '@/lib/services/blogPosts';
import { listCityLandingPages, listStateLandingPages } from '@/lib/services/locationLandingPages';
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
