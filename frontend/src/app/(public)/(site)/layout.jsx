import Link from "next/link";
import ResourceXLogo from "@/components/common/ResourceXLogo";

export default function SiteLayout({ children }) {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <ResourceXLogo />
        <nav className="flex items-center gap-6">
          <Link
            href="/about"
            className="font-medium text-gray-700 hover:text-primary"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="font-medium text-gray-700 hover:text-primary"
          >
            Contact Us
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 ml-4 font-semibold text-white transition rounded shadow bg-primary hover:bg-primary-dark"
          >
            Login
          </Link>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 py-8">
        {children}
      </main>
    </div>
  );
}
