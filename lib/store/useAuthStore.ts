import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserResponse } from '@/lib/types/local';

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: UserResponse, accessToken: string) => void;
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
