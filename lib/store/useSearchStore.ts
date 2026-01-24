// lib/store/useSearchStore.ts
import { create } from 'zustand';
import { ApiSite, ApiSitesResponse } from '@/lib/types/storeganise';

interface SearchState {
  searchQuery: string;
  selectedCity: string;
  sites: ApiSite[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCity: (city: string) => void;
  setSites: (sites: ApiSite[]) => void;
  fetchSites: () => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  selectedCity: '',
  sites: [],
  isLoading: false,
  error: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedCity: (city) => set({ selectedCity: city }),
  
  setSites: (sites) => set({ sites }),

  fetchSites: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/sites');
      if (!response.ok) {
        throw new Error('Failed to fetch storage locations');
      }
      const data: ApiSitesResponse = await response.json();
      set({ sites: data.sites, isLoading: false });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      set({ error: errorMessage, isLoading: false });
    }
  },
}));
