import React from "react";
import { cn } from "@/shared/lib";
import { Pagination } from "./Pagination";
import { PaginationInfo } from "./PaginationInfo";

/**
 * PaginationFooter Component
 * Combines PaginationInfo and Pagination components for easy usage
 *
 * @example
 * // Basic usage
 * <PaginationFooter
 *   currentPage={1}
 *   totalPages={4}
 *   pageSize={15}
 *   total={56}
 *   itemName="resources"
 *   onPageChange={handlePageChange}
 * />
 *
 * @example
 * // Custom styling
 * <PaginationFooter
 *   currentPage={2}
 *   totalPages={3}
 *   pageSize={10}
 *   total={25}
 *   itemName="users"
 *   onPageChange={handlePageChange}
 *   className="bg-gray-100"
 * />
 *
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current page number (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.pageSize - Number of items per page
 * @param {number} props.total - Total number of items
 * @param {string} props.itemName - Name of the items being paginated
 * @param {Function} props.onPageChange - Callback when page changes
 * @param {Function} [props.onNextPage] - Optional callback for next page
 * @param {Function} [props.onPreviousPage] - Optional callback for previous page
 * @param {string} [props.className] - Additional CSS classes for the footer container
 * @param {boolean} [props.showItemName=true] - Whether to show the item name in PaginationInfo
 * @param {boolean} [props.showPageNumbers=true] - Whether to show page numbers in Pagination
 * @param {number} [props.maxVisiblePages=5] - Maximum number of page buttons to show
 * @param {string} [props.size="default"] - Button size for pagination
 */
export function PaginationFooter({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  total = 0,
  itemName = "items",
  onPageChange,
  onNextPage,
  onPreviousPage,
  className = "",
  showItemName = true,
  showPageNumbers = true,
  maxVisiblePages = 5,
  size = "default"
}) {
  // Don't render if there are no items
  if (total === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-md",
        className
      )}
    >
      <PaginationInfo
        currentPage={currentPage}
        pageSize={pageSize}
        total={total}
        itemName={itemName}
        showItemName={showItemName}
      />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          showPageNumbers={showPageNumbers}
          maxVisiblePages={maxVisiblePages}
          size={size}
        />
      )}
    </div>
  );
}

export default PaginationFooter;
