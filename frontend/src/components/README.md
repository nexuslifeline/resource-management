# Components

This directory contains all reusable UI components organized by type and purpose.

## Structure

```
components/
├── common/              # Enhanced common UI components
│   ├── Input.jsx        # Enhanced input with error handling
│   ├── Button.jsx       # Enhanced button with loading state
│   ├── Card/            # Card components directory
│   │   ├── Card.jsx     # All card-related components
│   │   └── index.js     # Export all card components
│   └── index.js         # Export all common components
├── containers/          # Layout container components
│   ├── AuthContainer.jsx # Reusable auth page layout
│   └── index.js         # Export all containers
├── forms/               # Form components (re-exports from common)
│   ├── Input.jsx        # Re-exports Input from common
│   └── index.js         # Export all form components
├── ui/                  # Base UI components (shadcn/ui)
│   ├── dialog.jsx       # Dialog component
│   ├── dropdown-menu.jsx # Dropdown menu component
│   ├── filter-popover.jsx # Filter popover component
│   ├── loading.jsx      # Loading component
│   ├── pagination.jsx   # Pagination component
│   ├── password-input.jsx # Password input with show/hide
│   ├── social-login-buttons.jsx # Social login buttons
│   └── table.jsx        # Table component
└── layout/              # Layout components
    ├── authenticated-layout.jsx # Protected page layout
    ├── header.jsx       # Header component
    ├── navbar.jsx       # Navigation bar
    └── sidebar.jsx      # Sidebar component
```

## Common Components

### Enhanced Input

A form input component with built-in error handling:

```javascript
import { Input } from '@/components/common/Input'
// or for backward compatibility:
import { Input } from '@/components/forms'

<Input
  type="email"
  placeholder="Enter your email"
  {...register("email")}
  error={errors.email?.message}
/>
```

**Features:**
- Automatic error message display
- Error state styling (red border and focus ring)
- Consistent error formatting
- Backward compatibility

### Enhanced Button

A button component with built-in loading state:

```javascript
import { Button } from '@/components/common/Button'

<Button
  type="submit"
  isBusy={isLoading}
  busyText="Saving..."
>
  Save Changes
</Button>
```

**Features:**
- Built-in loading spinner
- Configurable busy text
- Automatic disabled state when busy
- All existing button variants and sizes

### Card Components

Enhanced card components organized in a dedicated directory:

```javascript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content here
  </CardContent>
</Card>
```

**Available Components:**
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title element
- `CardDescription` - Description text
- `CardContent` - Main content area
- `CardFooter` - Footer section

## Form Components

### Input (Re-exported)

The Input component is re-exported from the common directory for backward compatibility:

```javascript
import { Input } from '@/components/forms'

<Input
  type="email"
  placeholder="Enter your email"
  {...register("email")}
  error={errors.email?.message}
/>
```

**Note**: This maintains backward compatibility while using the enhanced version from the common directory.

## Authentication Components

### AuthContainer

A reusable container component for authentication pages that provides:
- Consistent layout and styling
- Card-based design with proper spacing
- Terms and Privacy Policy links
- Footer with About Us and Contact Us links
- Customizable title, description, and content

```javascript
import { AuthContainer } from '@/components/containers'

<AuthContainer
  title="Login"
  description="Enter your credentials to access your account"
  termsText="By clicking login, you agree to our"
  footerContent={<p>Additional content here</p>}
>
  {/* Your form content */}
</AuthContainer>
```

### PasswordInput

A reusable password input component with show/hide functionality:
- Built-in show/hide password toggle
- Proper accessibility attributes
- Error message display
- Customizable autocomplete

```javascript
import PasswordInput from '@/components/ui/password-input'

<PasswordInput
  id="password"
  label="Password"
  autoComplete="current-password"
  register={register("password")}
  error={errors.password?.message}
/>
```

### SocialLoginButtons

A reusable component for social login options:
- GitHub and Facebook buttons
- Consistent styling with dividers
- Easy to extend for additional providers

```javascript
import SocialLoginButtons from '@/components/ui/social-login-buttons'

<SocialLoginButtons />
```

## Error Handling

### useAuthErrorCleanup Hook

A custom hook that automatically clears authentication errors when components mount and unmount, preventing error persistence between page navigations:

```javascript
import { useAuthErrorCleanup } from '@/hooks'

export default function LoginPage() {
  // Clear auth errors on mount and unmount
  useAuthErrorCleanup()
  
  // ... rest of component
}
```

**Features:**
- Automatically clears errors when component mounts
- Clears errors when component unmounts
- Configurable behavior with optional parameters
- Prevents error persistence between page navigations

## Usage Examples

### Login Page with Enhanced Components

```javascript
import { AuthContainer } from '@/components/containers'
import { Input } from '@/components/forms'
import { Button } from '@/components/common/Button'
import PasswordInput from '@/components/ui/password-input'
import SocialLoginButtons from '@/components/ui/social-login-buttons'
import { useAuthErrorCleanup } from '@/hooks'

export default function LoginPage() {
  // Clear auth errors on mount and unmount
  useAuthErrorCleanup()
  
  return (
    <AuthContainer
      title="Login"
      description="Enter your email and password below to log into your account"
      termsText="By clicking login, you agree to our"
    >
      {/* Error display */}
      {error && <ErrorDisplay error={error} />}
      
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          {...register("email")}
          placeholder="name@example.com"
          error={errors.email?.message}
        />
        <PasswordInput
          register={register("password")}
          error={errors.password?.message}
        />
        <Button
          type="submit"
          isBusy={isLoading}
          busyText="Signing in..."
        >
          Login
        </Button>
      </form>
      
      {/* Social login */}
      <SocialLoginButtons />
      
      {/* Sign up link */}
      <SignUpLink />
    </AuthContainer>
  )
}
```

### Register Page with Enhanced Components

```javascript
import { AuthContainer } from '@/components/containers'
import { Input } from '@/components/forms'
import { Button } from '@/components/common/Button'
import PasswordInput from '@/components/ui/password-input'
import SocialLoginButtons from '@/components/ui/social-login-buttons'
import { useAuthErrorCleanup } from '@/hooks'

export default function RegisterPage() {
  // Clear auth errors on mount and unmount
  useAuthErrorCleanup()
  
  return (
    <AuthContainer
      title="Register"
      description="Create your account to get started"
      termsText="By clicking register, you agree to our"
      footerContent={<SignInLink />}
    >
      {/* Error display */}
      {error && <ErrorDisplay error={error} />}
      
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          {...register("name")}
          placeholder="Enter your full name"
          error={errors.name?.message}
        />
        <Input
          type="email"
          {...register("email")}
          placeholder="name@example.com"
          error={errors.email?.message}
        />
        <PasswordInput
          register={register("password")}
          error={errors.password?.message}
        />
        <PasswordInput 
          id="confirmPassword"
          label="Confirm Password"
          register={register("confirmPassword")} 
          error={errors.confirmPassword?.message} 
        />
        <Button
          type="submit"
          isBusy={isLoading}
          busyText="Creating account..."
        >
          Create account
        </Button>
      </form>
      
      {/* Social login */}
      <SocialLoginButtons />
    </AuthContainer>
  )
}
```

## Benefits

1. **DRY Principle**: Eliminates code duplication between login and register pages
2. **Consistency**: Ensures uniform styling and behavior across auth pages
3. **Maintainability**: Changes to layout or styling only need to be made in one place
4. **Reusability**: Components can be easily reused in other parts of the application
5. **Accessibility**: Built-in accessibility features in all components
6. **Type Safety**: Proper JSDoc documentation for better IDE support
7. **Error Handling**: Automatic error cleanup prevents persistence between navigations
8. **Form Validation**: Enhanced form components with built-in error handling
9. **Loading States**: Built-in loading states for better UX
10. **Better Organization**: Common components are properly organized in dedicated directories

## Migration Notes

- Old login/register pages had duplicated layout code
- New structure uses `AuthContainer` for consistent layout
- `PasswordInput` component eliminates password field duplication
- `SocialLoginButtons` component centralizes social login options
- `useAuthErrorCleanup` hook prevents error persistence between pages
- Enhanced `Input` component provides consistent error handling
- Enhanced `Button` component provides built-in loading states
- Card components are now organized in a dedicated directory
- All components are properly documented with JSDoc comments
- Backward compatibility is maintained for existing imports 