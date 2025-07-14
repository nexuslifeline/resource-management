import * as React from "react";
import { cn } from "@/shared/lib";

/**
 * Enhanced Input component with error handling
 *
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.type - Input type
 * @param {string} props.error - Error message to display
 * @param {boolean} props.showError - Whether to show error styling (defaults to true if error exists)
 * @param {React.Ref} ref - Forwarded ref
 */
const Input = React.forwardRef(
  (
    { className, containerClass, type, error, showError = true, ...props },
    ref
  ) => {
    const hasError = error && showError;

    return (
      <div className={containerClass}>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
            // Default border styling
            "border-input focus-visible:ring-ring",
            // Error state styling
            hasError &&
              "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {hasError && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
