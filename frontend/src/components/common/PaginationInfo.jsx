import React from "react";
import { cn } from "@/shared/lib";

/**
 * PaginationInfo Component
 * Displays pagination details like "Showing X to Y of Z items"
 *
 * @example
 * // Basic usage
 * <PaginationInfo
 *   currentPage={1}
 *   pageSize={15}
 *   total={56}
 *   itemName="resources"
 * />
 *
 * @example
 * // Custom styling
 * <PaginationInfo
 *   currentPage={2}
 *   pageSize={10}
 *   total={25}
 *   itemName="users"
 *   className="text-sm text-gray-600"
 * />
 *
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current page number (1-based)
 * @param {number} props.pageSize - Number of items per page
 * @param {number} props.total - Total number of items
 * @param {string} props.itemName - Name of the items being paginated (e.g., "resources", "users")
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.showItemName=true] - Whether to show the item name
 */
export function PaginationInfo({
  currentPage = 1,
  pageSize = 10,
  total = 0,
  itemName = "items",
  className = "",
  showItemName = true
}) {
  // Don't render if there are no items
  if (total === 0) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);
  const itemNameText = showItemName ? ` ${itemName}` : "";

  return (
    <div className={cn("text-sm text-gray-700", className)}>
      Showing {startItem} to {endItem} of {total}
      {itemNameText}
    </div>
  );
}

export default PaginationInfo;
