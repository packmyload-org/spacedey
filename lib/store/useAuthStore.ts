import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreganiseUser } from '@/lib/types/storeganise';

interface AuthState {
  user: StoreganiseUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: StoreganiseUser, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => set({ 
        user, 
        accessToken, 
        isAuthenticated: true 
      }),

      logout: () => set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'spacedey-auth-storage',
    }
  )
);
