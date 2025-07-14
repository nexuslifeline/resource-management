import axios from "axios";
import { toSnakeCase, toCamelCase } from "./utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
  // Removed withCredentials for bearer token authentication
});

// Add request interceptor to include token and convert to snake_case
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Convert request data to snake_case for backend
  if (config.data) {
    config.data = toSnakeCase(config.data);
  }

  return config;
});

// Add response interceptor to handle errors and convert to camelCase
api.interceptors.response.use(
  response => {
    // Convert response data to camelCase for frontend
    if (response.data) {
      response.data = toCamelCase(response.data);
    }
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
