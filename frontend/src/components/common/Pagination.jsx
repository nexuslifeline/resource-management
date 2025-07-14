import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/shared/lib";
import { Button } from "@/components/common/Button";

/**
 * Reusable Pagination Component
 * Handles complete pagination logic and UI with consistent styling
 *
 * @example
 * // Basic usage
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => setPage(page)}
 * />
 *
 * @example
 * // With custom handlers
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onNextPage={() => handleNext()}
 *   onPreviousPage={() => handlePrevious()}
 *   onPageChange={(page) => handlePageChange(page)}
 * />
 *
 * @example
 * // Minimal pagination (no page numbers)
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={handlePageChange}
 *   showPageNumbers={false}
 * />
 *
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current active page number (1-based)
 * @param {number} props.totalPages - Total number of pages available
 * @param {Function} props.onPageChange - Callback when page changes (receives page number)
 * @param {Function} [props.onNextPage] - Optional callback for next page (alternative to onPageChange)
 * @param {Function} [props.onPreviousPage] - Optional callback for previous page (alternative to onPageChange)
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.showPageNumbers=true] - Whether to show page number buttons
 * @param {number} [props.maxVisiblePages=5] - Maximum number of page buttons to show
 * @param {string} [props.size="default"] - Button size ("default", "sm", "lg")
 */
export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onNextPage,
  onPreviousPage,
  className = "",
  showPageNumbers = true,
  maxVisiblePages = 5,
  size = "default"
}) {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onNextPage?.() || onPageChange?.(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPreviousPage?.() || onPageChange?.(currentPage - 1);
    }
  };

  // Generate page numbers to display
  const getVisiblePages = () => {
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex items-center justify-center", className)}
    >
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          variant="outline"
          size={size}
          onClick={handlePreviousPage}
          disabled={isFirstPage}
          className={cn(
            "gap-1",
            isFirstPage && "pointer-events-none opacity-50"
          )}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {visiblePages.map((page, index) => (
              <React.Fragment key={index}>
                {page === "ellipsis" ? (
                  <span className="flex items-center justify-center text-gray-500 h-9 w-9">
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="sr-only">More pages</span>
                  </span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size={size}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "h-9 w-9 p-0",
                      currentPage === page && "pointer-events-none"
                    )}
                    aria-current={currentPage === page ? "page" : undefined}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Next Button */}
        <Button
          variant="outline"
          size={size}
          onClick={handleNextPage}
          disabled={isLastPage}
          className={cn(
            "gap-1",
            isLastPage && "pointer-events-none opacity-50"
          )}
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
}

// Export individual components for backward compatibility
const PaginationWrapper = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
PaginationWrapper.displayName = "Pagination";

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ className, isActive, size = "icon", ...props }) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    variant={isActive ? "outline" : "ghost"}
    size={size}
    className={cn("h-9 w-9 p-0", isActive && "pointer-events-none", className)}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="w-4 h-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="w-4 h-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="w-4 h-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
};
