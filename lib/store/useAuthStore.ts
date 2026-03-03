import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserResponse } from '@/lib/types/local';
import { UserRole } from '@/lib/types/roles';

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: UserResponse, accessToken: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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

      isAdmin: () => {
        const { user } = get();
        return user?.role === UserRole.ADMIN ?? false;
      },
    }),
    {
      name: 'spacedey-auth-storage',
    }
  )
);
