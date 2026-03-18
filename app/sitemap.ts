import type { MetadataRoute } from 'next';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import { listPublishedBlogPosts } from '@/lib/services/blogPosts';
import { listCityLandingPages, listStateLandingPages } from '@/lib/services/locationLandingPages';
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
  const [cityPages, statePages] = await Promise.all([
    listCityLandingPages(),
    listStateLandingPages(),
  ]);
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
    ...cityPages.map((city) => ({
      url: `${siteUrl}/locations/city/${city.slug}`,
      lastModified: city.sites[0]?.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.86,
    })),
    ...statePages.map((state) => ({
      url: `${siteUrl}/locations/state/${state.slug}`,
      lastModified: state.sites[0]?.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.82,
    })),
    ...locationRoutes,
  ];
}
