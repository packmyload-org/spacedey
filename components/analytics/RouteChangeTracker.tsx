'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

type RouteChangeTrackerProps = {
  enabled: boolean;
};

export default function RouteChangeTracker({ enabled }: RouteChangeTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !pathname) {
      return;
    }

    const queryString = searchParams.toString();
    const currentUrl = queryString ? `${pathname}?${queryString}` : pathname;

    if (previousUrlRef.current === null) {
      previousUrlRef.current = currentUrl;
      return;
    }

    if (previousUrlRef.current === currentUrl) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'virtual_page_view',
      page_path: currentUrl,
      page_location: window.location.href,
      page_title: document.title,
    });

    previousUrlRef.current = currentUrl;
  }, [enabled, pathname, searchParams]);

  return null;
}
