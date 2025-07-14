import { api } from "../lib";

/**
 * Centralized authentication service that handles all auth-related API calls
 * This service is used by the auth store and can be reused across modules
 */
export const authAPI = {
  /**
   * Login user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} Response with user data and token
   */
  async login(email, password) {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  /**
   * Register new user
   * @param {string} name - User's full name
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} Response with user data and token
   */
  async register(name, email, password) {
    const response = await api.post("/register", { name, email, password });
    return response.data;
  },

  /**
   * Logout current user
   * @returns {Promise<Object>} Response from logout endpoint
   */
  async logout() {
    const response = await api.post("/logout");
    return response.data;
  },

  /**
   * Get current authenticated user
   * @returns {Promise<Object>} Response with user data
   */
  async getMe() {
    const response = await api.get("/me");
    return response.data;
  },

  /**
   * Check if user is authenticated by verifying token exists
   * @returns {boolean} True if token exists in localStorage
   */
  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  /**
   * Get stored token from localStorage
   * @returns {string|null} The stored token or null
   */
  getToken() {
    return localStorage.getItem("token");
  },

  /**
   * Set token in localStorage
   * @param {string} token - The authentication token
   */
  setToken(token) {
    localStorage.setItem("token", token);
  },

  /**
   * Remove token from localStorage
   */
  removeToken() {
    localStorage.removeItem("token");
  }
};
