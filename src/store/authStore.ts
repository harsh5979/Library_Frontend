import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'FACULTY' | 'LIBRARIAN' | 'SUPER_ADMIN';
  phone?: string;
  department?: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (accessToken, refreshToken, user) => 
        set({ accessToken, refreshToken, user, isAuthenticated: true }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
