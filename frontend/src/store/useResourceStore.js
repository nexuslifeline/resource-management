/**
 * Resource Store
 * Zustand store for managing resource state and actions
 */

import { create } from "zustand";
import {
  getResources,
  getResource,
  addResource,
  updateResource,
  deleteResource,
  assignResource,
  getUsersForAssignment
} from "@/shared/services/resource";
import { DEFAULT_PAGINATION } from "@/shared/constants";

export const useResourceStore = create((set, get) => ({
  // State
  resources: [],
  currentResource: null,
  users: [],
  loading: false,
  error: null,
  pagination: {
    ...DEFAULT_PAGINATION,
    total: 0,
    totalPages: 1
  },
  filters: {
    search: "",
    status: [],
    priority: [],
    type: []
  },

  // Actions
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all resources
  fetchResources: async (params = {}) => {
    try {
      set({ loading: true, error: null });

      const currentFilters = get().filters;
      const currentPagination = get().pagination;

      // Merge params with current state
      const queryParams = {
        ...currentPagination,
        ...currentFilters,
        ...params
      };

      const response = await getResources(queryParams);

      set({
        resources: response.data || [],
        pagination: {
          page: response.page || 1,
          limit: response.limit || 10,
          total: response.total || 0,
          totalPages: response.totalPages || 1,
          sortBy: queryParams.sortBy || "created_at",
          sortOrder: queryParams.sortOrder || "desc"
        },
        loading: false
      });

      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch resources",
        loading: false
      });
      throw error;
    }
  },

  // Fetch single resource
  fetchResource: async id => {
    try {
      set({ loading: true, error: null });

      const response = await getResource(id);

      set({
        currentResource: response.data,
        loading: false
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch resource",
        loading: false
      });
      throw error;
    }
  },

  // Create new resource
  createResource: async data => {
    try {
      set({ loading: true, error: null });

      const response = await addResource(data);

      // Add new resource to the list
      const currentResources = get().resources;
      set({
        resources: [response.data, ...currentResources],
        loading: false
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create resource",
        loading: false
      });
      throw error;
    }
  },

  // Update resource
  updateResource: async (id, data) => {
    try {
      set({ loading: true, error: null });

      const response = await updateResource(id, data);

      // Update resource in the list
      const currentResources = get().resources;
      const updatedResources = currentResources.map(resource =>
        resource.id === id ? response.data : resource
      );

      set({
        resources: updatedResources,
        currentResource: response.data,
        loading: false
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update resource",
        loading: false
      });
      throw error;
    }
  },

  // Delete resource
  deleteResource: async id => {
    try {
      set({ loading: true, error: null });

      await deleteResource(id);

      // Remove resource from the list - check both id and uuid
      const currentResources = get().resources;
      const filteredResources = currentResources.filter(
        resource => resource.id !== id && resource.uuid !== id
      );

      set({
        resources: filteredResources,
        currentResource: null,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete resource",
        loading: false
      });
      throw error;
    }
  },

  // Assign resource to user
  assignResource: async (id, userId) => {
    try {
      set({ loading: true, error: null });

      const response = await assignResource(id, userId);

      // Update resource in the list
      const currentResources = get().resources;
      const updatedResources = currentResources.map(resource =>
        resource.id === id ? response.data : resource
      );

      set({
        resources: updatedResources,
        currentResource: response.data,
        loading: false
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to assign resource",
        loading: false
      });
      throw error;
    }
  },

  // Fetch users for assignment
  fetchUsers: async () => {
    try {
      set({ loading: true, error: null });

      const response = await getUsersForAssignment();

      set({
        users: response.data || [],
        loading: false
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch users",
        loading: false
      });
      throw error;
    }
  },

  // Update filters
  updateFilters: newFilters => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 } // Reset to first page when filters change
    }));
  },

  // Update pagination
  updatePagination: newPagination => {
    set(state => ({
      pagination: { ...state.pagination, ...newPagination }
    }));
  },

  // Clear current resource
  clearCurrentResource: () => set({ currentResource: null }),

  // Reset store
  reset: () =>
    set({
      resources: [],
      currentResource: null,
      users: [],
      loading: false,
      error: null,
      pagination: {
        ...DEFAULT_PAGINATION,
        total: 0,
        totalPages: 1
      },
      filters: {
        search: "",
        status: [],
        priority: [],
        type: []
      }
    })
}));
