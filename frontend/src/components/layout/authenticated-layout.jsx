'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from './header'
import { useAuthStore } from '@/store/useAuthStore'

export default function AuthenticatedLayout({ children }) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-8">
        {children}
      </main>
    </div>
  )
} 