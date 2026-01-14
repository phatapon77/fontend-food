import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (username, password) => {
        // Mock Login
        const mockUser = {
          id: 1,
          username,
          fullname: 'Demo User',
          role: username === 'admin' ? 'admin' : 'customer'
        };
        const mockToken = "mock-jwt-token";
        set({ user: mockUser, token: mockToken, isAuthenticated: true });
        localStorage.setItem('token', mockToken);
        return { success: true, role: mockUser.role };
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      }
    }),
    { name: 'auth-storage' }
  )
);
export default useAuthStore;