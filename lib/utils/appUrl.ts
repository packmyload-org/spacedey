import { env } from '@/config/env';

export function getFallbackAppUrl() {
  return env.app.url;
}

export function resolveAppUrl(input?: string | null) {
  if (!input) {
    return getFallbackAppUrl();
  }

  try {
    return new URL(input).origin;
  } catch {
    return getFallbackAppUrl();
  }
}
