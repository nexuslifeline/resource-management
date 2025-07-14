import { Button } from "@/components/common/Button";
import { Github, Facebook } from "lucide-react";

/**
 * SocialLoginButtons - A reusable component for social login options
 *
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes (optional)
 */
export default function SocialLoginButtons({ className = "" }) {
  return (
    <>
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-3 text-xs font-medium text-gray-400">
          OR CONTINUE WITH
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className={`flex gap-3 mb-4 ${className}`}>
        <Button
          variant="outline"
          className="flex items-center justify-center flex-1 gap-2"
        >
          <Github className="w-4 h-4" /> GitHub
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-center flex-1 gap-2"
        >
          <Facebook className="w-4 h-4" /> Facebook
        </Button>
      </div>
    </>
  );
}
