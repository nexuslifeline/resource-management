import { api } from "@/shared/lib";
import { apiUtils } from "@/shared/lib";
import { API_ENDPOINTS } from "@/shared/constants";

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard data with resource stats, user stats, and monthly data
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.DASHBOARD);

    // Convert backend response to frontend format (snake_case to camelCase)
    const convertedData = apiUtils.prepareForFrontend(response.data);

    return convertedData;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};
