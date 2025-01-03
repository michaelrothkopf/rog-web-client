import { create } from 'zustand';
import { AuthData, resetAuthData } from '../core/auth';

interface AuthState extends AuthData {
  isAuthenticated: boolean;
  authenticate(authData: AuthData): void;
  logout(): void;
}

// Global authentication Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  // AuthData
  token: '',
  tokenExpires: new Date(),
  user: {
    _id: '',
    username: '',
    email: '',
    locked: false,
    lastLogin: new Date(),
    lastLogout: new Date(),
  },

  // AuthState
  isAuthenticated: false,
  // Callback for authentication
  authenticate: (authData: AuthData) => set({
    token: authData.token, tokenExpires: authData.tokenExpires, user: authData.user, isAuthenticated: true,
  }),
  // Callback for logout
  logout: () => {
    // Clear the localStorage data
    resetAuthData();

    // Set the authentication to false
    set({ isAuthenticated: false });
  }
}));