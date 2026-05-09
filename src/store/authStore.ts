import { create } from 'zustand';
import axios from 'axios';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkSession: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Initially true while we check session

  checkSession: async () => {
    try {
      set({ isLoading: true });
      const { data } = await axios.get('/api/auth/me', { withCredentials: true });
      set({ user: data.user ?? null, isAuthenticated: !!data.user, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user: AuthUser | null) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch {
      // ignore network errors on logout
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
