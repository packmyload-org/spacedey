function normalizeUrlCandidate(value: string | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  return withProtocol.replace(/\/$/, '');
}

export function resolveSiteUrl() {
  const explicitUrl = normalizeUrlCandidate(
    process.env.NEXT_PUBLIC_APP_URL
  );

  if (explicitUrl) {
    return explicitUrl;
  }

  return 'http://localhost:3000';
}
