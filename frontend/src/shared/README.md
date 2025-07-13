# Shared Module

This directory contains shared utilities, services, and libraries that can be reused across the application.

## Structure

```
shared/
├── lib/           # Shared library utilities
│   ├── http.js    # HTTP client with interceptors
│   ├── utils.js   # Utility functions (cn, toSnakeCase, toCamelCase)
│   └── index.js   # Export all lib utilities
├── services/      # Shared services
│   ├── auth.js    # Authentication API service
│   └── index.js   # Export all services
└── README.md      # This file
```

## Usage

### HTTP Client

The shared HTTP client provides:
- Automatic token management
- Request/response data transformation (snake_case ↔ camelCase)
- Error handling with 401 redirects
- CORS support for Laravel Sanctum

```javascript
import { api } from '@/shared/lib'

// Make API calls
const response = await api.get('/resources')
const data = await api.post('/resources', resourceData)
```

### Utility Functions

The shared utilities provide common helper functions:

```javascript
import { cn, toSnakeCase, toCamelCase, apiUtils } from '@/shared/lib'

// CSS class merging utility
const className = cn('base-class', condition && 'conditional-class')

// Data transformation utilities
const snakeData = toSnakeCase({ dueDate: '2024-01-01', assignedTo: 'user123' })
// => { due_date: '2024-01-01', assigned_to: 'user123' }

const camelData = toCamelCase({ due_date: '2024-01-01', assigned_to: 'user123' })
// => { dueDate: '2024-01-01', assignedTo: 'user123' }

// API wrapper utilities
const apiData = apiUtils.prepareForAPI(frontendData)
const frontendData = apiUtils.prepareForFrontend(apiResponse)
```

### Authentication Service

The centralized auth service provides all authentication-related API calls:

```javascript
import { authAPI } from '@/shared/services'

// Login
const response = await authAPI.login(email, password)

// Register
const response = await authAPI.register(name, email, password)

// Get current user
const user = await authAPI.getMe()

// Token management
authAPI.setToken(token)
const token = authAPI.getToken()
authAPI.removeToken()
```

### Auth Store

The auth store manages authentication state and provides auth actions:

```javascript
import { useAuthStore } from '@/store/useAuthStore'

const { 
  user, 
  isAuthenticated, 
  login, 
  logout, 
  register,
  authAPI 
} = useAuthStore()

// Use auth actions
await login(email, password)
await register(name, email, password)
await logout()

// Access authAPI directly if needed
const user = await authAPI.getMe()
```

## Benefits

1. **Centralized Logic**: All auth API calls are in one place
2. **Reusability**: Services can be used across different components
3. **Consistency**: Standardized HTTP client with interceptors
4. **Maintainability**: Clear separation of concerns
5. **Type Safety**: Proper JSDoc documentation for better IDE support

## Migration Notes

- Old `lib/auth.js` → `shared/lib/http.js`
- Old `lib/utils.js` → `shared/lib/utils.js`
- Old `services/auth.js` → `shared/services/auth.js`
- All auth logic is now centralized in the auth store
- No more separate `authService` - use `authAPI` from shared services
- All utility functions are now available from `@/shared/lib` 