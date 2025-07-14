import React from "react";
import { cn } from "@/shared/lib";

/**
 * Badge Component
 * A pill-shaped badge for status/priority display with color and size props
 *
 * @param {Object} props
 * @param {string} props.color - One of 'red', 'blue', 'green', or any Tailwind color
 * @param {string} [props.size] - 'md' (default, for status) or 'sm' (for priority)
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} [props.className] - Additional classes
 * @param {object} [props.rest] - Other props
 *
 * @example
 * <Badge color="red" size="md">Suspended</Badge>
 * <Badge color="blue" size="md">In<br/>Progress</Badge>
 * <Badge color="green" size="sm">medium</Badge>
 */
const colorStyles = {
  red: "bg-red-50 text-red-500 border border-red-200",
  orange: "bg-orange-50 text-orange-500 border border-orange-200",
  yellow: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  green: "bg-green-50 text-green-600 border border-green-200",
  gray: "bg-gray-50 text-gray-700 border border-gray-200",
  purple: "bg-purple-50 text-purple-600 border border-purple-200",
  default: "bg-gray-50 text-gray-700 border border-gray-200"
};

const sizeStyles = {
  md: "px-1.5 py-1 text-xs font-semibold leading-tight text-center whitespace-pre-line rounded-2xl inline-flex items-center",
  sm: "px-1 py-1 text-xs font-medium text-center rounded-2xl inline-flex items-center"
};

export function Badge({
  color = "default",
  size = "md",
  children,
  className = "",
  ...rest
}) {
  return (
    <span
      className={cn(
        sizeStyles[size] || sizeStyles.md,
        colorStyles[color] || colorStyles.default,
        "lowercase",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

export default Badge;
