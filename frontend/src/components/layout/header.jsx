"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, Users, ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

export default function Header({ onSearch }) {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [userDropdown, setUserDropdown] = useState(false)
  const [search, setSearch] = useState('')

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    if (onSearch) onSearch(e.target.value)
  }

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b shadow-sm">
      <div className="flex-1 flex items-center">
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="max-w-xs mr-4"
        />
      </div>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold mr-2">
                {user?.name?.[0] || '?'}
              </div>
              <span className="font-medium text-gray-900 text-sm mr-1">{user?.name}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
    </header>
  )
} 