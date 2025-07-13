'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Loading from '@/components/ui/loading'
import AuthenticatedLayout from '@/components/layout/authenticated-layout'
import { api } from '@/shared/lib'

const assignSchema = z.object({
  assigned_to: z.string().min(1, 'Please select a user'),
})

export default function AssignResourcePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [resource, setResource] = useState(null)
  const [users, setUsers] = useState([])
  const router = useRouter()
  const params = useParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(assignSchema),
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch resource and users in parallel
      const [resourceResponse, usersResponse] = await Promise.all([
        api.get(`/resources/${params.id}`),
        api.get('/users/assignment')
      ])
      
      setResource(resourceResponse.data.data)
      setUsers(usersResponse.data.data || [])
      reset({ assigned_to: resourceResponse.data.data.assigned_to || '' })
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsSaving(true)
      setError('')

      await api.put(`/resources/${params.id}`, {
        ...resource,
        assigned_to: data.assigned_to,
        status: data.assigned_to ? 'in_progress' : 'pending'
      })
      
      // Redirect back to resources page
      router.push('/resources')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to assign resource'
      setError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUnassign = async () => {
    try {
      setIsSaving(true)
      setError('')

      await api.put(`/resources/${params.id}`, {
        ...resource,
        assigned_to: null,
        status: 'pending'
      })
      
      // Redirect back to resources page
      router.push('/resources')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to unassign resource'
      setError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="lg" text="Loading..." />
        </div>
      </AuthenticatedLayout>
    )
  }

  if (error && !resource) {
    return (
      <AuthenticatedLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => router.push('/resources')} className="mt-4">
              Back to Resources
            </Button>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Assign Resource</h1>
          <p className="text-gray-600 mt-2">Assign or unassign the resource to a user</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{resource?.name}</CardTitle>
            <CardDescription>
              {resource?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {resource?.type}
                </div>
                <div>
                  <span className="font-medium">Status:</span> 
                  {getStatusBadge(resource?.status)}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to User
                </label>
                <select
                  id="assigned_to"
                  {...register('assigned_to')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {errors.assigned_to && (
                  <p className="mt-1 text-sm text-red-600">{errors.assigned_to.message}</p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={isSaving} className="flex-1">
                  {isSaving ? 'Assigning...' : 'Assign Resource'}
                </Button>
                {resource?.assigned_to && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleUnassign}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? 'Unassigning...' : 'Unassign'}
                  </Button>
                )}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/resources')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
} 