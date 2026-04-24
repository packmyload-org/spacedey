import type { Metadata } from 'next';
import { resolveSiteUrl } from '@/lib/siteUrl';

export const SITE_NAME = 'Spacedey';
export const SITE_DESCRIPTION =
  'Spacedey helps people and businesses find, compare, and reserve secure self storage units across Lagos and the rest of Nigeria with flexible payment plans.';
export const DEFAULT_OG_IMAGE_PATH = '/images/hero1.jpg';

export const DEFAULT_KEYWORDS = [];

export function getSiteUrl() {
  return resolveSiteUrl();
}

export function toAbsoluteUrl(pathname: string) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(normalizedPath, getSiteUrl()).toString();
}

export function getDefaultSeoImage() {
  return toAbsoluteUrl(DEFAULT_OG_IMAGE_PATH);
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

interface BuildPageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string | null;
  type?: 'website' | 'article';
  publishedTime?: string | null;
  authors?: string[];
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
  type = 'website',
  publishedTime,
  authors,
  noIndex = false,
}: BuildPageMetadataOptions): Metadata {
  const canonical = path.startsWith('/') ? path : `/${path}`;
  const resolvedImage = image || getDefaultSeoImage();
  const mergedKeywords = Array.from(new Set([...DEFAULT_KEYWORDS, ...keywords]));
  const robots = noIndex
    ? {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
          'max-image-preview': 'none' as const,
          'max-snippet': 0,
          'max-video-preview': 0,
        },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large' as const,
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      };

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      locale: 'en_NG',
      publishedTime: type === 'article' ? publishedTime || undefined : undefined,
      authors: type === 'article' ? authors : undefined,
      images: resolvedImage
        ? [
            {
              url: resolvedImage,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: resolvedImage ? [resolvedImage] : undefined,
    },
    robots,
  };
}

export function buildNoIndexMetadata(title: string, description: string): Metadata {
  return buildPageMetadata({
    title,
    description,
    path: '/',
    noIndex: true,
  });
}

export function getBlogKeywords(title: string, excerpt: string) {
  const normalizedTitle = title.toLowerCase();
  const normalizedExcerpt = excerpt.toLowerCase();
  const topicKeywords = [
    'storage companies in nigeria and prices',
    'self storage tips',
    'storage organization',
    'moving storage guide',
    'storage unit advice',
  ];

  if (normalizedTitle.includes('business') || normalizedExcerpt.includes('business')) {
    topicKeywords.push('Best storage companies in nigeria');
  }

  if (normalizedTitle.includes('lagos') || normalizedExcerpt.includes('lagos')) {
    topicKeywords.push('storage facilities in Lagos', 'storage facilities in Lekki');
  }

  if (normalizedTitle.includes('security') || normalizedExcerpt.includes('security')) {
    topicKeywords.push('secure self storage nigeria', 'storage security tips');
  }

  if (normalizedTitle.includes('price') || normalizedTitle.includes('cost') || normalizedExcerpt.includes('price')) {
    topicKeywords.push('storage companies in nigeria and prices','storage pricing nigeria', 'self storage cost lagos');
  }

  if (normalizedTitle.includes('size') || normalizedExcerpt.includes('size')) {
    topicKeywords.push('storage unit sizes nigeria', 'what size storage unit do i need');
  }

  if (normalizedTitle.includes('not to store') || normalizedExcerpt.includes('not to store')) {
    topicKeywords.push('what not to store in self storage', 'storage safety rules');
  }

  return [...DEFAULT_KEYWORDS, ...topicKeywords];
}
