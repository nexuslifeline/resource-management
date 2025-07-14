# Common Components

This directory contains enhanced common UI components that provide improved functionality and better user experience.

## Structure

```
common/
├── Input.jsx        # Enhanced input with error handling
├── Button.jsx       # Enhanced button with loading state
├── Card/            # Card components directory
│   ├── Card.jsx     # All card-related components
│   └── index.js     # Export all card components
├── Sorter.jsx # Sortable table headers
└── index.js         # Export all common components
```

## Available Components

### Input

An enhanced input component with built-in error handling and validation display.

#### Features

- **Error Display**: Automatically shows error messages below the input
- **Error Styling**: Red border and focus ring when errors exist
- **Accessibility**: Proper error association with inputs
- **Flexible**: Works with or without error states

#### Usage

```javascript
import { Input } from '@/components/common/Input'

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

### Button

An enhanced button component with built-in loading state and improved UX.

#### Features

- **Loading State**: Built-in spinner and busy text
- **Automatic Disable**: Button is disabled when in busy state
- **Flexible Text**: Configurable busy text or uses original text
- **All Variants**: Supports all existing button variants and sizes

#### Usage

```javascript
import { Button } from '@/components/common/Button'

// Basic usage
<Button type="submit">
  Save Changes
</Button>

// With loading state
<Button
  type="submit"
  isBusy={isLoading}
  busyText="Saving..."
>
  Save Changes
</Button>

// With variants and sizes
<Button
  variant="destructive"
  size="sm"
  isBusy={isDeleting}
  busyText="Deleting..."
>
  Delete Item
</Button>
```

#### Props

- `isBusy` (boolean) - Whether button is in loading state
- `busyText` (string) - Text to show when button is busy (optional)
- `variant` (string) - Button variant (default, destructive, outline, secondary, ghost, link)
- `size` (string) - Button size (default, sm, lg, icon)
- `asChild` (boolean) - Whether to render as child component
- `disabled` (boolean) - Whether button is disabled
- All standard HTML button props are supported

### Sorter

A reusable component for sortable table headers with visual indicators and accessibility features.

#### Features

- **Visual Indicators**: Shows appropriate sort icons (up, down, neutral)
- **Click Handling**: Built-in click and keyboard navigation
- **Accessibility**: Proper ARIA attributes and keyboard support
- **Flexible**: Works with any column identifier and sort logic
- **Disabled State**: Can be disabled when sorting is not available

#### Usage

```javascript
import { Sorter } from '@/components/common'

// Basic usage
<Sorter
  column="name"
  currentSortBy="name"
  currentSortOrder="asc"
  onSort={handleSort}
>
  Name
</Sorter>

// With custom styling
<Sorter
  column="status"
  currentSortBy="status"
  currentSortOrder="desc"
  onSort={handleSort}
  className="font-semibold text-gray-900"
>
  Status
</Sorter>

// Disabled state
<Sorter
  column="actions"
  currentSortBy="name"
  currentSortOrder="asc"
  onSort={handleSort}
  disabled={true}
>
  Actions
</Sorter>
```

#### Props

- `column` (string) - The column identifier for sorting
- `currentSortBy` (string) - Currently active sort column
- `currentSortOrder` (string) - Current sort order ('asc' or 'desc')
- `onSort` (function) - Callback function when header is clicked
- `children` (React.ReactNode) - The header text/content
- `className` (string) - Additional CSS classes
- `disabled` (boolean, default: false) - Whether the header is disabled

### Card Components

Enhanced card components organized in a dedicated directory for better maintainability.

#### Available Components

- `Card` - Main container for card layouts
- `CardHeader` - Header section of a card
- `CardTitle` - Title element within a card header
- `CardDescription` - Description text within a card header
- `CardContent` - Main content area of a card
- `CardFooter` - Footer section of a card

#### Usage

```javascript
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/common/Card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

### Pagination Components

Comprehensive pagination components for consistent data table navigation across the application.

#### Available Components

- `Pagination` - Complete pagination with page numbers and navigation
- `PaginationInfo` - Shows "Showing X to Y of Z items" information
- `PaginationFooter` - Combines PaginationInfo and Pagination for easy usage

#### Pagination

Complete pagination component with smart page number display and navigation.

```javascript
import { Pagination } from '@/components/common'

// Basic usage
<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => setPage(page)}
/>

// With custom handlers
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onNextPage={() => handleNext()}
  onPreviousPage={() => handlePrevious()}
  onPageChange={(page) => handlePageChange(page)}
/>

// Minimal pagination (no page numbers)
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  showPageNumbers={false}
/>
```

#### PaginationInfo

Displays pagination details like "Showing 1 to 15 of 56 resources".

```javascript
import { PaginationInfo } from '@/components/common'

// Basic usage
<PaginationInfo
  currentPage={1}
  pageSize={15}
  total={56}
  itemName="resources"
/>

// Custom styling
<PaginationInfo
  currentPage={2}
  pageSize={10}
  total={25}
  itemName="users"
  className="text-sm text-gray-600"
  showItemName={false} // Shows "Showing 11 to 20 of 25"
/>
```

#### PaginationFooter

Combines PaginationInfo and Pagination for complete pagination footer.

```javascript
import { PaginationFooter } from '@/components/common'

// Basic usage
<PaginationFooter
  currentPage={1}
  totalPages={4}
  pageSize={15}
  total={56}
  itemName="resources"
  onPageChange={handlePageChange}
/>

// Custom styling
<PaginationFooter
  currentPage={2}
  totalPages={3}
  pageSize={10}
  total={25}
  itemName="users"
  onPageChange={handlePageChange}
  className="bg-gray-100"
  showPageNumbers={false}
/>
```

#### Pagination Props

**Pagination:**

- `currentPage` (number) - Current active page number (1-based)
- `totalPages` (number) - Total number of pages available
- `onPageChange` (function) - Callback when page changes
- `onNextPage` (function, optional) - Callback for next page
- `onPreviousPage` (function, optional) - Callback for previous page
- `showPageNumbers` (boolean, default: true) - Whether to show page number buttons
- `maxVisiblePages` (number, default: 5) - Maximum number of page buttons to show
- `size` (string, default: "default") - Button size

**PaginationInfo:**

- `currentPage` (number) - Current page number (1-based)
- `pageSize` (number) - Number of items per page
- `total` (number) - Total number of items
- `itemName` (string) - Name of the items being paginated
- `showItemName` (boolean, default: true) - Whether to show the item name
- `className` (string) - Additional CSS classes

**PaginationFooter:**

- All props from both Pagination and PaginationInfo
- `className` (string) - Additional CSS classes for the footer container

## Benefits

1. **Enhanced UX**: Better error handling and loading states
2. **Consistency**: Uniform behavior across all components
3. **Accessibility**: Built-in accessibility features
4. **Maintainability**: Centralized component logic
5. **Reusability**: Easy to use across the application
6. **Type Safety**: Proper JSDoc documentation
7. **Performance**: Optimized rendering and state management
8. **Backward Compatibility**: Maintains existing API while adding features

## Migration from UI Components

### Before (Old UI Components)

```javascript
// Old input with manual error handling
<div>
  <input
    type="email"
    className="border-gray-300"
    {...register("email")}
  />
  {errors.email && (
    <p className="mt-1 text-sm text-red-600">
      {errors.email.message}
    </p>
  )}
</div>

// Old button with manual loading state
<button
  type="submit"
  disabled={isLoading}
  className="btn"
>
  {isLoading ? "Loading..." : "Submit"}
</button>

// Old sortable header with inline logic
<span className="inline-flex items-center gap-1">
  Status
  {pagination.sortBy === "status" ? (
    pagination.sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    )
  ) : (
    <ArrowUpDown className="w-4 h-4 text-gray-400" />
  )}
</span>
```

### After (Enhanced Common Components)

```javascript
// Enhanced input with built-in error handling
<Input
  type="email"
  {...register("email")}
  error={errors.email?.message}
/>

// Enhanced button with built-in loading state
<Button
  type="submit"
  isBusy={isLoading}
  busyText="Loading..."
>
  Submit
</Button>

// Enhanced sortable header with built-in logic
<Sorter
  column="status"
  currentSortBy={pagination.sortBy}
  currentSortOrder={pagination.sortOrder}
  onSort={handleSort}
>
  Status
</Sorter>
```

## Best Practices

1. **Always use error props**: Pass error messages to Input components for consistent UX
2. **Use loading states**: Utilize isBusy and busyText for better user feedback
3. **Consistent styling**: Let components handle their own styling states
4. **Accessibility**: Components include proper ARIA attributes
5. **Performance**: Only apply error styling when errors exist
6. **Documentation**: All components include JSDoc comments for better IDE support
7. **Reusable headers**: Use Sorter for all sortable table columns

## Future Enhancements

As the application grows, additional common components may be added:

- `Textarea` - Enhanced textarea with error handling
- `Select` - Enhanced select dropdown with error handling
- `Checkbox` - Enhanced checkbox with error handling
- `RadioGroup` - Enhanced radio group with error handling
- `Modal` - Enhanced modal component
- `Toast` - Enhanced toast notification component
