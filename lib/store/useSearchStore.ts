import { create } from 'zustand';

interface SearchState {
  searchQuery: string;
  selectedState: string;
  selectedCity: string;
  setSearchQuery: (query: string) => void;
  setSelectedState: (state: string) => void;
  setSelectedCity: (city: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  selectedState: '',
  selectedCity: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedState: (state) => set({ selectedState: state }),
  setSelectedCity: (city) => set({ selectedCity: city }),
}));
