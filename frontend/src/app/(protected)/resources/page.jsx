'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Loading from '@/components/ui/loading'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { api, toCamelCase } from '@/shared/lib'
import { Plus, Pencil, UserPlus, Trash, X, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { FilterPopover } from '@/components/ui/filter-popover'

export default function ResourcesPage() {
  const [resources, setResources] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0
  })
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    resource: null,
    isDeleting: false
  })
  const router = useRouter()

  const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]
  const PRIORITY_OPTIONS = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ]

  const [statusFilter, setStatusFilter] = useState([])
  const [priorityFilter, setPriorityFilter] = useState([])
  const [sortBy, setSortBy] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchResources()
  }, [currentPage, debouncedSearchTerm, statusFilter, priorityFilter, sortBy, sortOrder])

  const fetchResources = async () => {
    try {
      setIsLoading(true)
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(statusFilter.length > 0 && { status: statusFilter }),
        ...(priorityFilter.length > 0 && { priority: priorityFilter }),
        ...(sortBy && sortOrder ? { sort_by: sortBy, sort_order: sortOrder } : {}),
      }
      const response = await api.get('/resources', { params })
      const convertedData = toCamelCase(response.data.data || [])
      const convertedPagination = toCamelCase(response.data.pagination || {})
      setResources(convertedData)
      setPagination({
        currentPage: convertedPagination.currentPage || 1,
        lastPage: convertedPagination.lastPage || 1,
        perPage: convertedPagination.perPage || itemsPerPage,
        total: convertedPagination.total || 0
      })
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (resourceId) => {
    router.push(`/resources/${resourceId}/edit`)
  }

  const handleAssign = (resourceId) => {
    router.push(`/resources/${resourceId}/assign`)
  }

  const handleDelete = (resource) => {
    setDeleteDialog({
      isOpen: true,
      resource,
      isDeleting: false
    })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.resource) return
    try {
      setDeleteDialog(prev => ({ ...prev, isDeleting: true }))
      const resourceId = deleteDialog.resource.uuid || deleteDialog.resource.id
      await api.delete(`/resources/${resourceId}`)
      setDeleteDialog({
        isOpen: false,
        resource: null,
        isDeleting: false
      })
      await fetchResources()
    } catch (error) {
      console.error('Error deleting resource:', error)
      setDeleteDialog(prev => ({ ...prev, isDeleting: false }))
    }
  }

  const cancelDelete = () => {
    setDeleteDialog({
      isOpen: false,
      resource: null,
      isDeleting: false
    })
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }
    const statusClasses = {
      pending: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusMap[status] || status}
      </span>
    )
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const clearAllFilters = () => {
    setStatusFilter([])
    setPriorityFilter([])
    setCurrentPage(1)
  }

  const removeFilter = (type, value) => {
    if (type === 'status') {
      setStatusFilter(prev => prev.filter(v => v !== value))
    } else if (type === 'priority') {
      setPriorityFilter(prev => prev.filter(v => v !== value))
    }
    setCurrentPage(1)
  }

  const getFilterLabel = (type, value) => {
    if (type === 'status') {
      return STATUS_OPTIONS.find(opt => opt.value === value)?.label || value
    } else if (type === 'priority') {
      return PRIORITY_OPTIONS.find(opt => opt.value === value)?.label || value
    }
    return value
  }

  const hasActiveFilters = statusFilter.length > 0 || priorityFilter.length > 0

  const handleSort = (column) => {
    if (sortBy !== column) {
      setSortBy(column)
      setSortOrder('asc')
    } else if (sortOrder === 'asc') {
      setSortOrder('desc')
    } else if (sortOrder === 'desc') {
      setSortBy(null)
      setSortOrder(null)
    } else {
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  const renderPagination = () => {
    if (pagination.lastPage <= 1) return null
    const pages = []
    const maxVisiblePages = 5
    if (pagination.lastPage <= maxVisiblePages) {
      for (let i = 1; i <= pagination.lastPage; i++) {
        pages.push(i)
      }
    } else {
      if (pagination.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(pagination.lastPage)
      } else if (pagination.currentPage >= pagination.lastPage - 2) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = pagination.lastPage - 3; i <= pagination.lastPage; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = pagination.currentPage - 1; i <= pagination.currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(pagination.lastPage)
      }
    }
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
              className={pagination.currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          {pages.map((page, index) => (
            <PaginationItem key={index}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={pagination.currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(pagination.lastPage, pagination.currentPage + 1))}
              className={pagination.currentPage === pagination.lastPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
      </div>
      <Card className="mb-8">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
          <div className="flex-1 flex items-center gap-2 flex-wrap">
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-xs"
            />
            <FilterPopover
              label="Status"
              options={STATUS_OPTIONS}
              selected={statusFilter}
              onChange={setStatusFilter}
              searchPlaceholder="Status"
              className="ml-2"
            />
            <FilterPopover
              label="Priority"
              options={PRIORITY_OPTIONS}
              selected={priorityFilter}
              onChange={setPriorityFilter}
              searchPlaceholder="Priority"
              className="ml-2"
            />
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="ml-2 text-gray-600 hover:text-gray-800"
              >
                Clear all filters
              </Button>
            )}
          </div>
          <Button onClick={() => router.push('/resources/add')} className="w-full md:w-auto mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" /> Add Resource
          </Button>
        </CardHeader>
        {hasActiveFilters && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              {statusFilter.map((value) => (
                <div
                  key={`status-${value}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <span>Status: {getFilterLabel('status', value)}</span>
                  <button
                    onClick={() => removeFilter('status', value)}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {priorityFilter.map((value) => (
                <div
                  key={`priority-${value}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  <span>Priority: {getFilterLabel('priority', value)}</span>
                  <button
                    onClick={() => removeFilter('priority', value)}
                    className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12">
              <Loading size="lg" text="Loading resources..." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('name')} className="cursor-pointer select-none">
                      <span className="inline-flex items-center gap-1">
                        Name
                        {sortBy === 'name' ? (
                          sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </span>
                    </TableHead>
                    <TableHead onClick={() => handleSort('type')} className="cursor-pointer select-none">
                      <span className="inline-flex items-center gap-1">
                        Type
                        {sortBy === 'type' ? (
                          sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </span>
                    </TableHead>
                    <TableHead onClick={() => handleSort('status')} className="cursor-pointer select-none">
                      <span className="inline-flex items-center gap-1">
                        Status
                        {sortBy === 'status' ? (
                          sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </span>
                    </TableHead>
                    <TableHead onClick={() => handleSort('priority')} className="cursor-pointer select-none">
                      <span className="inline-flex items-center gap-1">
                        Priority
                        {sortBy === 'priority' ? (
                          sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </span>
                    </TableHead>
                    <TableHead onClick={() => handleSort('assigned_to')} className="cursor-pointer select-none">
                      <span className="inline-flex items-center gap-1">
                        Assigned To
                        {sortBy === 'assigned_to' ? (
                          sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </span>
                    </TableHead>
                    <TableHead onClick={() => handleSort('due_date')} className="cursor-pointer select-none">
                      <span className="inline-flex items-center gap-1">
                        Due Date
                        {sortBy === 'due_date' ? (
                          sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </span>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{resource.name}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {resource.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{resource.type}</TableCell>
                      <TableCell>{getStatusBadge(resource.status)}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          resource.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          resource.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          resource.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {resource.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        {resource.assignedUser ? resource.assignedUser.name : 'Unassigned'}
                      </TableCell>
                      <TableCell>
                        {resource.dueDate ? new Date(resource.dueDate).toLocaleDateString() : 'No due date'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" aria-label="Actions">
                              <span className="sr-only">Actions</span>
                              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="4" r="1.5" fill="currentColor"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="10" cy="16" r="1.5" fill="currentColor"/></svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleEdit(resource.uuid || resource.id)}>
                              <Pencil className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleAssign(resource.uuid || resource.id)}>
                              <UserPlus className="w-4 h-4 mr-2" /> Assign
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => handleDelete(resource)} className="text-red-600">
                              <Trash className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {resources.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No resources found.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        {pagination.total > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-md">
            <div className="text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * pagination.perPage) + 1} to {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of {pagination.total} resources
            </div>
            {renderPagination()}
          </div>
        )}
      </Card>
      <Dialog open={deleteDialog.isOpen} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.resource?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={deleteDialog.isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteDialog.isDeleting}
            >
              {deleteDialog.isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 