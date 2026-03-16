export const SITE_NAME = 'Spacedey';
export const SITE_DESCRIPTION =
  'Spacedey helps people and businesses find, compare, and reserve secure self storage units across Nigeria.';

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
