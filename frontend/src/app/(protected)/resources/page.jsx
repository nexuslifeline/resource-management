"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Plus, Pencil, UserPlus, Trash, X } from "lucide-react";

import { Button, Badge } from "@/components/common";
import { Input } from "@/components/forms";
import { Loading, PaginationFooter, Sorter } from "@/components/common";
import { Card, CardContent, CardHeader } from "@/components/common/Card";
import { TableV2 } from "@/components/common/TableV2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/common/Dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/common/DropdownMenu";
import { FilterPopover } from "@/components/common/FilterPopover";
import { useResourceStore } from "@/store/useResourceStore";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/shared/constants";
import PageContainer from "@/components/containers/PageContainer";

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    resource: null,
    isDeleting: false
  });
  const router = useRouter();

  // Get state and actions from the store
  const {
    resources,
    loading,
    error,
    pagination,
    filters,
    fetchResources,
    deleteResource,
    updateFilters,
    updatePagination
  } = useResourceStore();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch resources when filters or pagination change
  useEffect(() => {
    fetchResources({
      search: debouncedSearchTerm,
      page: pagination.page
    });
  }, [
    debouncedSearchTerm,
    filters,
    pagination.page,
    pagination.sortBy,
    pagination.sortOrder,
    fetchResources
  ]);

  const handleEdit = resourceId => {
    router.push(`/resources/${resourceId}/edit`);
  };

  const handleAssign = resourceId => {
    router.push(`/resources/${resourceId}/assign`);
  };

  const handleDelete = resource => {
    setDeleteDialog({
      isOpen: true,
      resource,
      isDeleting: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.resource) return;
    try {
      setDeleteDialog(prev => ({ ...prev, isDeleting: true }));
      const resourceId = deleteDialog.resource.uuid || deleteDialog.resource.id;
      await deleteResource(resourceId);
      setDeleteDialog({
        isOpen: false,
        resource: null,
        isDeleting: false
      });
    } catch (error) {
      console.error("Error deleting resource:", error);
      setDeleteDialog(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({
      isOpen: false,
      resource: null,
      isDeleting: false
    });
  };

  const getStatusBadge = status => {
    const statusMap = {
      pending: { label: "Pending", color: "gray" },
      in_progress: { label: "In Progress", color: "orange" },
      completed: { label: "Completed", color: "green" },
      cancelled: { label: "Cancelled", color: "purple" },
      suspended: { label: "Suspended", color: "red" },
      invited: { label: "Invited", color: "blue" },
      active: { label: "Active", color: "green" }
    };
    const { label, color } = statusMap[status] || {
      label: status,
      color: "default"
    };
    return <Badge color={color}>{label}</Badge>;
  };

  const handleSearch = value => {
    setSearchTerm(value);
    updatePagination({ page: 1 });
  };

  const handlePageChange = page => {
    updatePagination({ page });
  };

  const clearAllFilters = () => {
    updateFilters({
      status: [],
      priority: []
    });
    updatePagination({ page: 1 });
  };

  const removeFilter = (type, value) => {
    if (type === "status") {
      updateFilters({
        status: filters.status.filter(v => v !== value)
      });
    } else if (type === "priority") {
      updateFilters({
        priority: filters.priority.filter(v => v !== value)
      });
    }
    updatePagination({ page: 1 });
  };

  const getFilterLabel = (type, value) => {
    if (type === "status") {
      return STATUS_OPTIONS.find(opt => opt.value === value)?.label || value;
    } else if (type === "priority") {
      return PRIORITY_OPTIONS.find(opt => opt.value === value)?.label || value;
    }
    return value;
  };

  const handleSort = column => {
    const { sortBy, sortOrder } = pagination;

    const isSameColumn = sortBy === column;
    const isAsc = sortOrder === "asc";

    const newSortBy = isSameColumn && !isAsc ? "created_at" : column;
    const newSortOrder = isSameColumn ? (isAsc ? "desc" : "desc") : "asc";

    updatePagination({
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      page: 1
    });
  };

  // Table columns definition for TableV2
  const columns = [
    {
      key: "name",
      title: (
        <Sorter
          column="name"
          currentSortBy={pagination.sortBy}
          currentSortOrder={pagination.sortOrder}
          onSort={handleSort}
        >
          Name
        </Sorter>
      ),
      width: 320,
      render: row => (
        <div>
          <div className="font-semibold">{row.name}</div>
          <div className="mt-1 text-xs text-gray-500">{row.description}</div>
        </div>
      )
    },
    {
      key: "type",
      title: (
        <Sorter
          column="type"
          currentSortBy={pagination.sortBy}
          currentSortOrder={pagination.sortOrder}
          onSort={handleSort}
        >
          Type
        </Sorter>
      ),
      width: 120,
      render: row => <span className="capitalize">{row.type}</span>
    },
    {
      key: "status",
      title: (
        <Sorter
          column="status"
          currentSortBy={pagination.sortBy}
          currentSortOrder={pagination.sortOrder}
          onSort={handleSort}
        >
          Status
        </Sorter>
      ),
      width: 160,
      render: row => getStatusBadge(row.status)
    },
    {
      key: "priority",
      title: (
        <Sorter
          column="priority"
          currentSortBy={pagination.sortBy}
          currentSortOrder={pagination.sortOrder}
          onSort={handleSort}
        >
          Priority
        </Sorter>
      ),
      width: 120,
      render: row => (
        <Badge
          color={
            row.priority === "urgent"
              ? "purple"
              : row.priority === "high"
              ? "red"
              : row.priority === "medium"
              ? "green"
              : "gray"
          }
          size="sm"
        >
          {row.priority}
        </Badge>
      )
    },
    {
      key: "assignedTo",
      title: (
        <Sorter
          column="assigned_to"
          currentSortBy={pagination.sortBy}
          currentSortOrder={pagination.sortOrder}
          onSort={handleSort}
        >
          Assigned To
        </Sorter>
      ),
      width: 160,
      render: row => (row.assignedUser ? row.assignedUser.name : "Unassigned")
    },
    {
      key: "dueDate",
      title: (
        <Sorter
          column="due_date"
          currentSortBy={pagination.sortBy}
          currentSortOrder={pagination.sortOrder}
          onSort={handleSort}
        >
          Due Date
        </Sorter>
      ),
      width: 140,
      render: row =>
        row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "No due date"
    },
    {
      key: "actions",
      title: "Actions",
      width: 120,
      render: row => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="p-1"
              aria-label="Actions"
            >
              <span className="sr-only">Actions</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="4" r="1.5" fill="currentColor" />
                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                <circle cx="10" cy="16" r="1.5" fill="currentColor" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => handleEdit(row.uuid || row.id)}>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleAssign(row.uuid || row.id)}>
              <UserPlus className="w-4 h-4 mr-2" /> Assign
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => handleDelete(row)}
              className="text-red-600"
            >
              <Trash className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <PageContainer
      title="Resources"
      description="Manage and organize your project resources, tasks, and assets. Track status, priority, and assignments to keep your team aligned and productive."
      addText="Add Resource"
      onAdd={() => router.push("/resources/add")}
    >
      <Card className="mb-8">
        <CardHeader className="flex flex-col gap-4 pb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center flex-1 gap-1">
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              containerClass="max-w-[300px] w-full"
            />
            <FilterPopover
              label="Status"
              options={STATUS_OPTIONS}
              selected={filters.status}
              onChange={value => updateFilters({ status: value })}
              searchPlaceholder="Status"
              className="ml-2"
            />
            <FilterPopover
              label="Priority"
              options={PRIORITY_OPTIONS}
              selected={filters.priority}
              onChange={value => updateFilters({ priority: value })}
              searchPlaceholder="Priority"
              className="ml-2"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <TableV2
            columns={columns}
            data={resources}
            loading={loading}
            loadingText="Loading resources..."
            empty={<div>No resources found.</div>}
            footer={
              pagination.total > 0 && (
                <PaginationFooter
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  pageSize={pagination.limit}
                  total={pagination.total}
                  itemName="resources"
                  onPageChange={handlePageChange}
                />
              )
            }
          />
        </CardContent>
      </Card>
      <Dialog open={deleteDialog.isOpen} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.resource?.name}"?
              This action cannot be undone.
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
              {deleteDialog.isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
