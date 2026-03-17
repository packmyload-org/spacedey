import type { Metadata } from 'next';

export const SITE_NAME = 'Spacedey';
export const SITE_DESCRIPTION =
  'Spacedey helps people and businesses find, compare, and reserve secure self storage units across Nigeria.';
export const DEFAULT_OG_IMAGE_PATH = '/images/hero1.jpg';

export const DEFAULT_KEYWORDS = [
  'self storage nigeria',
  'storage units lagos',
  'secure storage nigeria',
  'self storage lagos',
  'business storage nigeria',
  'personal storage lagos',
  'storage facility nigeria',
  'warehouse and self storage nigeria',
];

export function getSiteUrl() {
  return (
    process.env.PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3000'
  );
}

export function toAbsoluteUrl(pathname: string) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(normalizedPath, getSiteUrl()).toString();
}

export function getDefaultSeoImage() {
  return toAbsoluteUrl(DEFAULT_OG_IMAGE_PATH);
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
    'self storage tips',
    'storage organization',
    'moving storage guide',
    'storage unit advice',
  ];

  if (normalizedTitle.includes('business') || normalizedExcerpt.includes('business')) {
    topicKeywords.push('business storage nigeria');
  }

  if (normalizedTitle.includes('lagos') || normalizedExcerpt.includes('lagos')) {
    topicKeywords.push('lagos self storage');
  }

  return [...DEFAULT_KEYWORDS, ...topicKeywords];
}
