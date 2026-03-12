'use client';

import {
  useCallback,
  createContext,
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ApiSite, ApiSitesResponse } from '@/lib/types/local';

interface SitesContextValue {
  sites: ApiSite[];
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;
  ensureSitesLoaded: (force?: boolean) => Promise<ApiSite[]>;
  refreshSites: () => Promise<ApiSite[]>;
}

const SitesContext = createContext<SitesContextValue | null>(null);

async function requestSites(): Promise<ApiSite[]> {
  const response = await fetch('/api/sites');

  if (!response.ok) {
    throw new Error(`Failed to fetch storage sites: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as Partial<ApiSitesResponse & { ok: boolean; error?: string }>;

  if (!data.ok || !Array.isArray(data.sites)) {
    throw new Error(data.error || 'Invalid storage sites response');
  }

  return data.sites;
}

export function SitesProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sites, setSites] = useState<ApiSite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sitesRef = useRef<ApiSite[]>([]);
  const hasLoadedRef = useRef(false);
  const inFlightRef = useRef<Promise<ApiSite[]> | null>(null);

  useEffect(() => {
    sitesRef.current = sites;
  }, [sites]);

  useEffect(() => {
    hasLoadedRef.current = hasLoaded;
  }, [hasLoaded]);

  const loadSites = useCallback(async (force = false) => {
    if (inFlightRef.current) {
      return inFlightRef.current;
    }

    if (hasLoadedRef.current && !force) {
      return sitesRef.current;
    }

    setIsLoading(true);
    setError(null);

    const request = requestSites()
      .then((nextSites) => {
        startTransition(() => {
          setSites(nextSites);
          setHasLoaded(true);
          setError(null);
        });

        return nextSites;
      })
      .catch((err: unknown) => {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load storage sites';

        startTransition(() => {
          setError(errorMessage);
          setHasLoaded(true);
        });

        throw err;
      })
      .finally(() => {
        inFlightRef.current = null;
        startTransition(() => {
          setIsLoading(false);
        });
      });

    inFlightRef.current = request;
    return request;
  }, []);

  return (
    <SitesContext.Provider
      value={{
        sites,
        isLoading,
        error,
        hasLoaded,
        ensureSitesLoaded: loadSites,
        refreshSites: () => loadSites(true),
      }}
    >
      {children}
    </SitesContext.Provider>
  );
}

export function useSitesData() {
  const context = useContext(SitesContext);

  if (!context) {
    throw new Error('useSitesData must be used within a SitesProvider');
  }

  const { ensureSitesLoaded, hasLoaded, isLoading } = context;

  useEffect(() => {
    if (!hasLoaded && !isLoading) {
      void ensureSitesLoaded().catch(() => {
        // Error state is stored in context for consumers to render.
      });
    }
  }, [ensureSitesLoaded, hasLoaded, isLoading]);

  return context;
}
