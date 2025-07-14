import React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

import { LuChevronsUpDown, LuChevronDown, LuChevronUp } from "react-icons/lu";

import { cn } from "@/shared/lib";

/**
 * Sorter Component
 * A reusable component for sortable table headers with visual indicators
 *
 * @example
 * // Basic usage
 * <Sorter
 *   column="name"
 *   currentSortBy="name"
 *   currentSortOrder="asc"
 *   onSort={handleSort}
 * >
 *   Name
 * </Sorter>
 *
 * @example
 * // With custom styling
 * <Sorter
 *   column="status"
 *   currentSortBy="status"
 *   currentSortOrder="desc"
 *   onSort={handleSort}
 *   className="font-semibold text-gray-900"
 * >
 *   Status
 * </Sorter>
 *
 * @param {Object} props - Component props
 * @param {string} props.column - The column identifier for sorting
 * @param {string} props.currentSortBy - Currently active sort column
 * @param {string} props.currentSortOrder - Current sort order ('asc' or 'desc')
 * @param {Function} props.onSort - Callback function when header is clicked
 * @param {React.ReactNode} props.children - The header text/content
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.disabled=false] - Whether the header is disabled
 */
export function Sorter({
  column,
  currentSortBy,
  currentSortOrder,
  onSort,
  children,
  className = "",
  disabled = false
}) {
  const isActive = currentSortBy === column;
  const isAscending = currentSortOrder === "asc";
  const isDescending = currentSortOrder === "desc";

  const handleClick = () => {
    if (!disabled && onSort) {
      onSort(column);
    }
  };

  const getSortIcon = () => {
    if (!isActive) {
      return <LuChevronsUpDown className="w-3.5 h-3.5 text-gray-300" />;
    }

    if (isAscending) {
      return <LuChevronUp className="w-3.5 h-3.5" />;
    }

    if (isDescending) {
      return <LuChevronDown className="w-3.5 h-3.5" />;
    }

    return <LuChevronsUpDown className="w-3.5 h-3.5 text-gray-300" />;
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        !disabled && "cursor-pointer select-none hover:text-gray-700",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={handleClick}
      role={!disabled ? "button" : undefined}
      tabIndex={!disabled ? 0 : undefined}
      onKeyDown={
        !disabled
          ? e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
    >
      {children}
      {getSortIcon()}
    </span>
  );
}

export default Sorter;
