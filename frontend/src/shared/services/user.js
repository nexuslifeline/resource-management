import { api } from "@/shared/lib";
import { apiUtils } from "@/shared/lib";
import { API_ENDPOINTS } from "@/shared/constants";

/**
 * Get all users with optional filtering and pagination
 * @param {Object} params - Query parameters for filtering (role, status, search, etc.)
 * @returns {Promise<Object>} Users data with pagination info
 */
export const getUsers = async (params = {}) => {
  try {
    const apiParams = apiUtils.prepareForAPI(params);
    const response = await api.get(API_ENDPOINTS.USERS, { params: apiParams });
    // Convert backend response to frontend format
    const convertedResponse = apiUtils.prepareForFrontend(response.data);
    const meta = convertedResponse.meta || {};

    // Process users data to extract role names and add status
    const processedData = (convertedResponse.data || []).map(user => ({
      ...user,
      // Extract role name from roles array
      role:
        user.roles && user.roles.length > 0 ? user.roles[0].name : "No Role",
      // Add status based on email verification
      status: user.emailVerifiedAt ? "Active" : "Invited"
    }));

    return {
      data: processedData,
      page: meta.currentPage || 1,
      limit: meta.perPage || 10,
      total: meta.total || 0,
      totalPages: meta.lastPage || 1
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
