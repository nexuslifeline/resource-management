import React from "react";
import { cn } from "@/shared/lib";
import Loading from "./Loading";

/**
 * TableV2 Component
 * A flexible, horizontally-scrollable table with fixed column widths and custom render props for footer, pagination, etc.
 *
 * @param {Object} props
 * @param {Array} props.columns - Array of { key, title, width, render? }
 * @param {Array} props.data - Array of row objects
 * @param {React.ReactNode} [props.footer] - Footer content (e.g., pagination)
 * @param {React.ReactNode} [props.empty] - Empty state content
 * @param {React.ReactNode} [props.headerExtras] - Extra content in the header row (e.g., filter, sort)
 * @param {string} [props.className] - Additional classes
 * @param {boolean} [props.loading] - Whether the table is in loading state
 * @param {string} [props.loadingText] - Text to display during loading
 * @param {object} [props.rest] - Other props
 *
 * @example
 * <TableV2
 *   columns=[{ key: 'name', title: 'Name', width: 200 }, ...]
 *   data=[{ name: 'Alice', ... }, ...]
 *   footer={<Pagination ... />}
 *   empty={<div>No data</div>}
 *   loading={true}
 *   loadingText="Loading users..."
 * />
 */
export function TableV2({
  columns = [],
  data = [],
  footer,
  empty,
  headerExtras,
  className = "",
  loading = false,
  loadingText = "Loading...",
  ...rest
}) {
  return (
    <div className={cn("w-full", className)} {...rest}>
      {/* Table content is horizontally scrollable */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{
                    width: col.width,
                    minWidth: col.width,
                    maxWidth: col.width
                  }}
                  className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border-b border-gray-200 bg-gray-50 whitespace-nowrap"
                >
                  {col.title}
                </th>
              ))}
              {headerExtras && (
                <th className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  {headerExtras}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (headerExtras ? 1 : 0)}
                  className="py-12 text-center"
                >
                  <Loading size="lg" text={loadingText} />
                </td>
              </tr>
            ) : data.length === 0 && empty ? (
              <tr>
                <td
                  colSpan={columns.length + (headerExtras ? 1 : 0)}
                  className="py-12 text-center text-gray-500"
                >
                  {empty}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="even:bg-gray-50">
                  {columns.map(col => (
                    <td
                      key={col.key}
                      style={{
                        width: col.width,
                        minWidth: col.width,
                        maxWidth: col.width
                      }}
                      className="px-4 py-3 align-middle border-b border-gray-100"
                    >
                      <div className="w-full overflow-hidden truncate whitespace-nowrap">
                        {col.render ? col.render(row, rowIdx) : row[col.key]}
                      </div>
                    </td>
                  ))}
                  {headerExtras && <td />}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Footer (not scrollable) */}
      {footer && (
        <div className="w-full bg-white border-t border-gray-200">{footer}</div>
      )}
    </div>
  );
}

export default TableV2;
