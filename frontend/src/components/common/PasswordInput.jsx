import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/forms";

/**
 * PasswordInput - A reusable password input component with show/hide functionality
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID
 * @param {string} props.label - Label text
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.autoComplete - Autocomplete attribute
 * @param {Object} props.register - React Hook Form register function
 * @param {string} props.error - Error message to display
 * @param {string} props.className - Additional CSS classes
 */
export default function PasswordInput({
  id,
  label,
  placeholder = "********",
  autoComplete = "current-password",
  register,
  error,
  className = ""
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          {...register}
          placeholder={placeholder}
          className="pr-10"
          error={error}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute text-gray-400 -translate-y-1/2 right-2 top-1/2 hover:text-gray-600"
          onClick={() => setShowPassword(v => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
