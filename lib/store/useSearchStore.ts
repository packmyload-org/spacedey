import { create } from 'zustand';
import { ApiSite, ApiSitesResponse } from '@/lib/types/local';

interface SearchState {
  searchQuery: string;
  selectedState: string;
  selectedCity: string;
  sites: ApiSite[];
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedState: (state: string) => void;
  setSelectedCity: (city: string) => void;
  setSites: (sites: ApiSite[]) => void;
  fetchSites: () => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  selectedState: '',
  selectedCity: '',
  sites: [],
  isLoading: false,
  error: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedState: (state) => set({ selectedState: state }),
  setSelectedCity: (city) => set({ selectedCity: city }),
  setSites: (sites) => set({ sites }),
  fetchSites: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/sites');

      if (!response.ok) {
        throw new Error(`Failed to fetch storage sites: ${response.statusText}`);
      }

      const data: ApiSitesResponse = await response.json();

      if (!data.sites) {
        throw new Error('Invalid response format');
      }

      set({ sites: data.sites, isLoading: false });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      set({ error: errorMessage, isLoading: false });
    }
  },
}));
