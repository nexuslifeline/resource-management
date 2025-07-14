/**
 * Resource Service
 * Handles all resource-related API interactions with automatic case conversion
 */

import { api } from "@/shared/lib";
import { apiUtils } from "@/shared/lib";
import { API_ENDPOINTS } from "@/shared/constants";

/**
 * Get all resources with optional filtering and pagination
 * @param {Object} params - Query parameters for filtering and pagination
 * @returns {Promise<Object>} Resources data with pagination info
 */
export const getResources = async (params = {}) => {
  try {
    // Convert frontend params to backend format
    const apiParams = apiUtils.prepareForAPI(params);

    // Map limit to per_page for backend compatibility
    if (apiParams.limit) {
      apiParams.per_page = apiParams.limit;
      delete apiParams.limit;
    }

    // Handle array parameters - only send non-empty arrays
    if (
      apiParams.status &&
      Array.isArray(apiParams.status) &&
      apiParams.status.length === 0
    ) {
      delete apiParams.status;
    }
    if (
      apiParams.priority &&
      Array.isArray(apiParams.priority) &&
      apiParams.priority.length === 0
    ) {
      delete apiParams.priority;
    }
    if (
      apiParams.type &&
      Array.isArray(apiParams.type) &&
      apiParams.type.length === 0
    ) {
      delete apiParams.type;
    }

    const response = await api.get(API_ENDPOINTS.RESOURCES, {
      params: apiParams
    });

    // Convert backend response to frontend format
    const convertedResponse = apiUtils.prepareForFrontend(response.data);

    // Extract pagination data from meta object and map to expected format
    const meta = convertedResponse.meta || {};
    return {
      data: convertedResponse.data || [],
      page: meta.currentPage || 1,
      limit: meta.perPage || 10,
      total: meta.total || 0,
      totalPages: meta.lastPage || 1,
      sortBy: params.sortBy || "created_at",
      sortOrder: params.sortOrder || "desc"
    };
  } catch (error) {
    console.error("Error fetching resources:", error);
    throw error;
  }
};

/**
 * Get a single resource by ID
 * @param {string} id - Resource ID
 * @returns {Promise<Object>} Resource data
 */
export const getResource = async id => {
  try {
    const response = await api.get(`${API_ENDPOINTS.RESOURCES}/${id}`);

    // Convert backend response to frontend format
    return apiUtils.prepareForFrontend(response.data);
  } catch (error) {
    console.error("Error fetching resource:", error);
    throw error;
  }
};

/**
 * Create a new resource
 * @param {Object} data - Resource data
 * @returns {Promise<Object>} Created resource data
 */
export const addResource = async data => {
  try {
    // Convert frontend data to backend format
    const apiData = apiUtils.prepareForAPI(data);

    const response = await api.post(API_ENDPOINTS.RESOURCES, apiData);

    // Convert backend response to frontend format
    return apiUtils.prepareForFrontend(response.data);
  } catch (error) {
    console.error("Error creating resource:", error);
    throw error;
  }
};

/**
 * Update an existing resource
 * @param {string} id - Resource ID
 * @param {Object} data - Updated resource data
 * @returns {Promise<Object>} Updated resource data
 */
export const updateResource = async (id, data) => {
  try {
    // Convert frontend data to backend format
    const apiData = apiUtils.prepareForAPI(data);

    const response = await api.put(`${API_ENDPOINTS.RESOURCES}/${id}`, apiData);

    // Convert backend response to frontend format
    return apiUtils.prepareForFrontend(response.data);
  } catch (error) {
    console.error("Error updating resource:", error);
    throw error;
  }
};

/**
 * Delete a resource
 * @param {string} id - Resource ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteResource = async id => {
  try {
    const response = await api.delete(`${API_ENDPOINTS.RESOURCES}/${id}`);

    // Convert backend response to frontend format
    return apiUtils.prepareForFrontend(response.data);
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw error;
  }
};

/**
 * Assign a resource to a user
 * @param {string} id - Resource ID
 * @param {string} userId - User ID to assign to
 * @returns {Promise<Object>} Updated resource data
 */
export const assignResource = async (id, userId) => {
  try {
    const apiData = apiUtils.prepareForAPI({
      assignedTo: userId,
      status: userId ? "in_progress" : "pending"
    });

    const response = await api.put(`${API_ENDPOINTS.RESOURCES}/${id}`, apiData);

    // Convert backend response to frontend format
    return apiUtils.prepareForFrontend(response.data);
  } catch (error) {
    console.error("Error assigning resource:", error);
    throw error;
  }
};

/**
 * Get users available for assignment
 * @returns {Promise<Array>} List of users
 */
export const getUsersForAssignment = async () => {
  try {
    const response = await api.get(`${API_ENDPOINTS.USERS}/assignment`);

    // Convert backend response to frontend format
    return apiUtils.prepareForFrontend(response.data);
  } catch (error) {
    console.error("Error fetching users for assignment:", error);
    throw error;
  }
};
