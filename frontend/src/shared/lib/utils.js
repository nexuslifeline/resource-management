import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Convert camelCase to snake_case
export function toSnakeCase(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => toSnakeCase(item))
  }

  const snakeCaseObj = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    snakeCaseObj[snakeKey] = toSnakeCase(value)
  }
  return snakeCaseObj
}

// Convert snake_case to camelCase
export function toCamelCase(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item))
  }

  const camelCaseObj = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    camelCaseObj[camelKey] = toCamelCase(value)
  }
  return camelCaseObj
}

// API wrapper functions
export const apiUtils = {
  // Convert frontend data to backend format before sending
  prepareForAPI: (data) => {
    return toSnakeCase(data)
  },

  // Convert backend response to frontend format
  prepareForFrontend: (data) => {
    return toCamelCase(data)
  }
}

// Test cases (for reference):
// toSnakeCase({ dueDate: '2024-01-01', assignedTo: 'user123' }) 
// => { due_date: '2024-01-01', assigned_to: 'user123' }
//
// toCamelCase({ due_date: '2024-01-01', assigned_to: 'user123' }) 
// => { dueDate: '2024-01-01', assignedTo: 'user123' } 