import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/common/Card";

/**
 * AuthContainer - A reusable container component for authentication pages
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display in the card header
 * @param {string} props.description - The description to display in the card header
 * @param {React.ReactNode} props.children - The form content to render inside the card
 * @param {string} props.termsText - Custom text for the terms agreement (optional)
 * @param {React.ReactNode} props.footerContent - Additional content to render before the footer links (optional)
 */
export default function AuthContainer({
  title,
  description,
  children,
  termsText = "By clicking continue, you agree to our",
  footerContent
}) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f7fafd] py-12 px-4">
      <Card className="w-full max-w-md border border-gray-200 shadow-md rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}

          {/* Terms and Privacy Policy */}
          <p className="mt-2 text-xs text-center text-gray-500">
            {termsText}{" "}
            <Link href="#" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Additional footer content (e.g., "Already have an account?" link) */}
          {footerContent}
        </CardContent>
      </Card>

      {/* Footer with About Us and Contact Us links */}
      <footer className="flex flex-col items-center w-full mt-6 mb-2 text-sm text-gray-500">
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
          <span className="hidden sm:inline">|</span>
          <Link href="/contact" className="hover:underline">
            Contact Us
          </Link>
        </div>
      </footer>
    </div>
  );
}
