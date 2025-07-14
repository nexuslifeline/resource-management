# Custom Hooks

This directory contains custom React hooks that provide reusable logic across the application.

## Structure

```
hooks/
├── useAuthErrorCleanup.js # Auth error cleanup hook
└── index.js               # Export all hooks
```

## Available Hooks

### useAuthErrorCleanup

A hook that automatically clears authentication errors when components mount and unmount, preventing error persistence between page navigations.

#### Usage

```javascript
import { useAuthErrorCleanup } from '@/hooks'

export default function AuthPage() {
  // Clear auth errors on mount and unmount (default behavior)
  useAuthErrorCleanup()
  
  // Or customize the behavior
  useAuthErrorCleanup(true, false) // Clear on mount, don't clear on unmount
  
  return (
    // Your component JSX
  )
}
```

#### Parameters

- `clearOnMount` (boolean, default: `true`) - Whether to clear errors when component mounts
- `clearOnUnmount` (boolean, default: `true`) - Whether to clear errors when component unmounts

#### Use Cases

- **Authentication Pages**: Automatically clear errors when navigating between login/register
- **Form Components**: Clear errors when component mounts to ensure clean state
- **Modal Dialogs**: Clear errors when modal opens/closes

#### Benefits

1. **Prevents Error Persistence**: Errors don't carry over between page navigations
2. **Clean State Management**: Ensures components start with a clean error state
3. **Reusable Logic**: Can be used across multiple components
4. **Configurable**: Flexible behavior for different use cases

## Best Practices

1. **Use in Auth Pages**: Always use `useAuthErrorCleanup` in authentication pages
2. **Consistent Naming**: Follow the `use` prefix convention for custom hooks
3. **Documentation**: Include JSDoc comments for all hooks
4. **Testing**: Test hooks in isolation when possible

## Future Hooks

As the application grows, additional hooks may be added:

- `useLocalStorage` - Local storage management
- `useDebounce` - Debounced value hook
- `useMediaQuery` - Media query hook
- `useClickOutside` - Click outside detection 