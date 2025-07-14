"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Loading } from "@/components/common";
import { authAPI } from "@/shared/services";

export default function MainLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if token exists first
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch current user
        const response = await authAPI.getMe();
        setUser(response.user);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setError(err.message || "Authentication failed");

        // Clear any invalid token
        localStorage.removeItem("token");

        // Redirect to login page
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [router]);

  // Show loading screen while fetching user data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  // Don't render layout or children if there's an error (redirecting to login)
  if (error) {
    return null;
  }

  // Only render layout and children if user is successfully loaded
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen ml-64">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
