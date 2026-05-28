export interface BlogFaq {
  question: string;
  answer: string;
}

export function extractFaqsFromBlogContent(content: string): BlogFaq[] {
  const sectionMatch = content.match(/## Frequently asked questions\s+([\s\S]+)/i);

  if (!sectionMatch) {
    return [];
  }

  const section = sectionMatch[1];
  const faqs: BlogFaq[] = [];
  const pattern = /###\s+(.+?)\n\n([\s\S]*?)(?=\n###\s+|\n##\s+|$)/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(section)) !== null) {
    const question = match[1]?.trim();
    const answer = match[2]?.trim();

    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

export function getBlogActionLinks(title: string, excerpt: string) {
  const normalized = `${title} ${excerpt}`.toLowerCase();
  const locationHref = normalized.includes('lagos')
    ? '/locations/city/lagos'
    : '/locations';

  return [
    {
      href: '/sizing',
      label: 'Use the pricing and size guide',
      description: 'Compare common unit sizes and price before you reserve.',
    },
    {
      href: locationHref,
      label: normalized.includes('lagos') ? 'Browse storage in Lagos' : 'Browse storage locations',
      description: 'See live locations, available units, and current pricing.',
    },
    {
      href: '/locations',
      label: 'Start your booking path',
      description: 'Move from research into a real facility and unit selection.',
    },
  ] as const;
}
