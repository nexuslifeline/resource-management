# Form Components

This directory contains enhanced form components with built-in error handling and consistent styling.

## Structure

```
forms/
├── Input.jsx    # Re-exports enhanced Input component from common directory
└── index.js     # Export all form components
```

## Available Components

### Input

An enhanced input component that provides:
- Built-in error message display
- Error state styling (red border and focus ring)
- Consistent error message formatting
- Backward compatibility with existing input props

**Note**: The Input component is now re-exported from `@/components/common/Input` for enhanced functionality while maintaining backward compatibility.

#### Usage

```javascript
import { Input } from '@/components/forms'

// Basic usage
<Input
  type="email"
  placeholder="Enter your email"
  {...register("email")}
/>

// With error handling
<Input
  type="email"
  placeholder="Enter your email"
  {...register("email")}
  error={errors.email?.message}
/>

// With custom styling
<Input
  type="text"
  className="custom-class"
  error={errors.name?.message}
  showError={true} // Optional: control error display
/>
```

#### Props

- `error` (string) - Error message to display below the input
- `showError` (boolean, default: `true`) - Whether to show error styling and message
- `className` (string) - Additional CSS classes
- All standard HTML input props are supported

#### Error Styling

When an error is present, the input will have:
- Red border (`border-red-500`)
- Red focus ring (`focus-visible:ring-red-500`)
- Error message displayed below in red text

#### Examples

**Login Form:**
```javascript
<Input
  type="email"
  autoComplete="email"
  {...register("email")}
  placeholder="name@example.com"
  error={errors.email?.message}
/>
```

**Registration Form:**
```javascript
<Input
  type="text"
  autoComplete="name"
  {...register("name")}
  placeholder="Enter your full name"
  error={errors.name?.message}
/>
```

**Search Input:**
```javascript
<Input
  type="text"
  placeholder="Search resources..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  // No error prop needed for search inputs
/>
```

## Integration with React Hook Form

The Input component works seamlessly with React Hook Form:

```javascript
import { useForm } from 'react-hook-form'
import { Input } from '@/components/forms'

export default function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email", { 
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        })}
        type="email"
        placeholder="Email"
        error={errors.email?.message}
      />
    </form>
  )
}
```

## Benefits

1. **Consistent Error Handling**: All inputs handle errors the same way
2. **Clean Code**: No need for manual error display logic
3. **Better UX**: Clear visual feedback for errors
4. **Accessibility**: Proper error association with inputs
5. **Maintainable**: Centralized error styling and behavior
6. **Backward Compatible**: Works with existing code without changes
7. **Enhanced Functionality**: Now uses the improved Input component from common directory

## Migration Guide

### Before (Manual Error Handling)
```javascript
<div>
  <input
    type="email"
    {...register("email")}
    className="border-gray-300"
  />
  {errors.email && (
    <p className="mt-1 text-sm text-red-600">
      {errors.email.message}
    </p>
  )}
</div>
```

### After (Enhanced Input Component)
```javascript
<Input
  type="email"
  {...register("email")}
  error={errors.email?.message}
/>
```

## Best Practices

1. **Always pass error messages**: Use `errors.fieldName?.message` for consistent error handling
2. **Use with React Hook Form**: Leverage the built-in validation and error handling
3. **Consistent styling**: The component handles all error styling automatically
4. **Accessibility**: Error messages are properly associated with inputs
5. **Performance**: Error styling is only applied when errors exist

## Future Enhancements

As the application grows, additional form components may be added:

- `Textarea` - Enhanced textarea with error handling
- `Select` - Enhanced select dropdown with error handling
- `Checkbox` - Enhanced checkbox with error handling
- `RadioGroup` - Enhanced radio group with error handling
- `FormField` - Wrapper component for form fields with labels

## Component Location

The Input component is now located in `@/components/common/Input` and re-exported here for backward compatibility. This allows for better organization while maintaining existing import paths. 