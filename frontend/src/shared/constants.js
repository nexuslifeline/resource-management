/**
 * Application Constants
 * Centralized constants for consistent usage across the application
 */

export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" }
];

export const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" }
];

export const RESOURCE_TYPE_OPTIONS = [
  { value: "project", label: "Project" },
  { value: "task", label: "Task" },
  { value: "inventory", label: "Inventory" },
  { value: "document", label: "Document" },
  { value: "other", label: "Other" }
];

// Resource status badges styling
export const STATUS_BADGE_CLASSES = {
  pending: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

// Priority badge styling
export const PRIORITY_BADGE_CLASSES = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};

// Default pagination settings
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "desc"
};

// API endpoints
export const API_ENDPOINTS = {
  RESOURCES: "/resources",
  USERS: "/users",
  AUTH: "/auth",
  DASHBOARD: "/dashboard"
};
