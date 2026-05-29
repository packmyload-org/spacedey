import type { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
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
    const supabase = createAdminClient();
    const { data: sites, error } = await supabase
      .from('sites')
      .select('id, updatedAt')
      .order('updatedAt', { ascending: false });

    if (error) {
      throw error;
    }

    locationRoutes = (sites ?? []).map((site) => ({
      url: `${siteUrl}/locations/${site.id}`,
      lastModified: new Date(site.updatedAt),
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
    ...locationRoutes,
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: ChangeFrequency.MONTHLY,
      priority: SitemapPriority.BLOG_POST,
    })),
  ];
}
