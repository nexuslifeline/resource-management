"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  LogOut,
  Settings,
  Users,
  LayoutDashboard,
  Folder
} from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

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
  { label: "Users", href: "/users", icon: <Users className="w-5 h-5 mr-2" /> },
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
    <aside className="flex flex-col h-screen w-64 bg-white border-r shadow-sm">
      <div className="flex items-center h-16 px-6 border-b">
        <span className="font-bold text-lg tracking-tight">Resource Management</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium transition"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-4 py-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold mr-3">
                {user?.name?.[0] || '?'}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900 text-sm">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top">
            <DropdownMenuItem onSelect={() => router.push('/settings')}>
              <Settings className="w-4 h-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push('/users')}>
              <Users className="w-4 h-4 mr-2" /> Users
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
