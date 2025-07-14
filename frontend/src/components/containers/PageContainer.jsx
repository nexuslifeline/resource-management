import { Button } from "@/components/common/Button";
import { Plus } from "lucide-react";
import { cn } from "@/shared/lib";

/**
 * PageContainer Component
 * A container component for page layouts with title, description, and optional action button
 *
 * @example
 * // Basic usage
 * <PageContainer title="Resources">
 *   <div>Page content</div>
 * </PageContainer>
 *
 * @example
 * // With description and add button
 * <PageContainer
 *   title="Resources"
 *   description="Manage and organize your project resources"
 *   addText="Add Resource"
 *   onAdd={() => router.push('/resources/add')}
 * >
 *   <div>Page content</div>
 * </PageContainer>
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The page title
 * @param {string} [props.description] - Optional description below the title
 * @param {string} [props.addText] - Text for the add button (e.g., "Add Resource", "Add User")
 * @param {Function} [props.onAdd] - Callback function when add button is clicked
 * @param {React.ReactNode} props.children - The page content
 * @param {string} [props.className] - Additional CSS classes for the container
 */
const PageContainer = ({
  title,
  description,
  addText,
  onAdd,
  children,
  className = ""
}) => {
  const hasAddButton = addText && onAdd;
  const hasDescription = description;

  return (
    <div className={cn("mx-auto max-w-7xl", className)}>
      <div
        className={cn(
          "mb-8",
          hasAddButton ? "flex items-start justify-between gap-4" : ""
        )}
      >
        {/* Title and Description Section */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {hasDescription && (
            <p className="mt-2 text-lg leading-relaxed text-gray-600">
              {description}
            </p>
          )}
        </div>

        {/* Add Button Section */}
        {hasAddButton && (
          <div className="flex-shrink-0">
            <Button onClick={onAdd} className="whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              {addText}
            </Button>
          </div>
        )}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
};

export default PageContainer;
