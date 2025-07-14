"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  LogOut,
  Settings,
  Users,
  LayoutDashboard,
  Folder
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/common/DropdownMenu";
import ResourceXLogo from "@/components/common/ResourceXLogo";

const menu = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5 mr-2" />
  },
  {
    label: "Resources",
    href: "/resources",
    icon: <Folder className="w-5 h-5 mr-2" />
  },
  {
    label: "Users",
    href: "/users",
    icon: <Users className="w-5 h-5 mr-2" />,
    adminOnly: true
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="w-5 h-5 mr-2" />
  }
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Admin check - handle both role formats
  const isAdmin =
    user &&
    (user.role === "Administrator" ||
      (user.roles &&
        user.roles.some(
          r =>
            r.name === "Administrator" ||
            (typeof r === "string" && r === "Administrator")
        )));

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdown(false);
      }
    }
    if (userDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdown]);

  return (
    <aside className="fixed flex flex-col w-64 h-screen bg-white border-r shadow-sm">
      <div className="flex items-center h-16 px-6 border-b">
        <ResourceXLogo />
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map(item => {
          // Skip admin-only items for non-administrators
          if (item.adminOnly && !isAdmin) {
            return null;
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center px-3 py-2 font-medium text-gray-700 transition rounded-md hover:bg-gray-100"
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 mt-auto border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-3 font-bold text-gray-600 bg-gray-200 rounded-full">
                {user?.name?.[0] || "?"}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-900">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top">
            <DropdownMenuItem onSelect={() => router.push("/settings")}>
              <Settings className="w-4 h-4 mr-2" /> Settings
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem onSelect={() => router.push("/users")}>
                <Users className="w-4 h-4 mr-2" /> Users
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
