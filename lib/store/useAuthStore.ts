import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { UserResponse } from '@/lib/types/local';
import { UserRole } from '@/lib/types/roles';

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;

  // Actions
  setAuth: (user: UserResponse, accessToken: string, rememberMe: boolean) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const authStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(name) ?? window.sessionStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') {
      return;
    }

    const parsed = JSON.parse(value) as { state?: { rememberMe?: boolean } };
    const shouldRemember = parsed.state?.rememberMe === true;

    if (shouldRemember) {
      window.localStorage.setItem(name, value);
      window.sessionStorage.removeItem(name);
      return;
    }

    window.sessionStorage.setItem(name, value);
    window.localStorage.removeItem(name);
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(name);
    window.sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      rememberMe: false,

      setAuth: (user, accessToken, rememberMe) => set({ 
        user, 
        accessToken, 
        isAuthenticated: true,
        rememberMe,
      }),

      logout: () => set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false,
        rememberMe: false,
      }),

      isAdmin: () => {
        const { user } = get();
        return (user?.role === UserRole.ADMIN) || false;
      },
    }),
    {
      name: 'spacedey-auth-storage',
      storage: createJSONStorage(() => authStorage),
    }
  )
);
