import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "@/shared/services";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: user => set({ user }),
      setToken: token => set({ token }),
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),
      clearError: () => set({ error: null }),

      // Clear all auth-related errors and loading states
      clearAuthErrors: () =>
        set({
          error: null,
          isLoading: false
        }),

      // Auth actions using centralized authAPI
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authAPI.login(email, password);
          const { user, token } = response;

          // Store token in localStorage
          authAPI.setToken(token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return response;
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Login failed";
          set({
            isLoading: false,
            error: errorMessage
          });
          throw error;
        }
      },

      register: async (name, email, password) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authAPI.register(name, email, password);
          const { user, token } = response;

          // Store token in localStorage
          authAPI.setToken(token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return response;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Registration failed";
          set({
            isLoading: false,
            error: errorMessage
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });

          // Call logout API
          await authAPI.logout();
        } catch (error) {
          // Continue with logout even if API call fails
          console.error("Logout API error:", error);
        } finally {
          // Remove token from localStorage
          authAPI.removeToken();

          // Clear store state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      // Initialize auth state from localStorage
      initializeAuth: async () => {
        const token = authAPI.getToken();
        if (token && authAPI.isAuthenticated()) {
          try {
            set({ isLoading: true });

            const response = await authAPI.getMe();
            const { user } = response;

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false
            });
          } catch (error) {
            // Token is invalid, clear everything
            authAPI.removeToken();
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false
            });
          }
        }
      },

      // Expose authAPI methods for direct access when needed
      authAPI
    }),
    {
      name: "auth-storage",
      partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
        // Explicitly exclude error and isLoading from persistence
      })
    }
  )
);
