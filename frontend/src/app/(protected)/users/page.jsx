"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/common/Card";
import { Input } from "@/components/forms";
import { Button, Loading, Badge } from "@/components/common";
import { Plus } from "lucide-react";
import { TableV2 } from "@/components/common/TableV2";
import { getUsers } from "@/shared/services/user";
import { useAuthStore } from "@/store/useAuthStore";
import { PaginationFooter, Sorter } from "@/components/common";
import { DEFAULT_PAGINATION } from "@/shared/constants";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/common";
import { FilterPopover } from "@/components/common/FilterPopover";

const ROLE_OPTIONS = [
  { value: "Administrator", label: "Administrator" },
  { value: "Regular User", label: "User" }
];
const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Invited", label: "Invited" }
];

export default function UsersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const [search, setSearch] = useState("");
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    ...DEFAULT_PAGINATION,
    total: 0,
    totalPages: 1
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

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

  useEffect(() => {
    if (!authLoading && !isAdmin) return;
    setLoading(true);
    setError("");
    getUsers({
      search: debouncedSearch,
      role: roles, // send as array
      status: statuses, // send as array
      page: pagination.page,
      limit: pagination.limit,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder
    })
      .then(res => {
        setUsers(res.data);
        setPagination(p => ({
          ...p,
          page: res.page,
          limit: res.limit,
          total: res.total,
          totalPages: res.totalPages
        }));
      })
      .catch(err => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, [
    debouncedSearch,
    roles,
    statuses,
    pagination.page,
    pagination.limit,
    pagination.sortBy,
    pagination.sortOrder,
    isAdmin,
    authLoading
  ]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }
  if (!isAdmin) {
    // Redirect non-administrators to dashboard
    useEffect(() => {
      router.push("/dashboard");
    }, [router]);

    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Redirecting..." />
      </div>
    );
  }

  const handlePageChange = page => setPagination(p => ({ ...p, page }));
  const handleSort = column => {
    setPagination(p => {
      const isSame = p.sortBy === column;
      const isAsc = p.sortOrder === "asc";
      return {
        ...p,
        sortBy: column,
        sortOrder: isSame ? (isAsc ? "desc" : "asc") : "asc",
        page: 1
      };
    });
  };
  const handleLimitChange = e =>
    setPagination(p => ({ ...p, limit: Number(e.target.value), page: 1 }));

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
      width: 200
    },
    {
      key: "email",
      title: (
        <Sorter
          column="email"
          currentSortBy={pagination.sortBy}
          currentSortOrder={pagination.sortOrder}
          onSort={handleSort}
        >
          Email
        </Sorter>
      ),
      width: 220
    },
    {
      key: "role",
      title: (
        <Sorter
          column="role"
          currentSortBy={pagination.sortBy}
          currentSortOrder={pagination.sortOrder}
          onSort={handleSort}
        >
          Role
        </Sorter>
      ),
      width: 120,
      render: row => (
        <Badge
          color={
            row.role === "Administrator"
              ? "purple"
              : row.role === "Regular User"
              ? "blue"
              : "gray"
          }
        >
          {row.role}
        </Badge>
      )
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
      width: 120,
      render: row => (
        <Badge
          color={
            row.status === "Suspended"
              ? "red"
              : row.status === "Invited"
              ? "blue"
              : row.status === "Active"
              ? "green"
              : "gray"
          }
        >
          {row.status}
        </Badge>
      )
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
            <DropdownMenuItem
              onSelect={() => {
                /* TODO: handle edit */
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onSelect={() => {
                /* TODO: handle delete */
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
      </div>
      <Card>
        <CardHeader className="flex flex-col gap-4 pb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center flex-1 gap-2">
            <Input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <FilterPopover
              label="Role"
              options={ROLE_OPTIONS}
              selected={roles}
              onChange={setRoles}
              searchPlaceholder="Role"
              className="ml-2"
            />
            <FilterPopover
              label="Status"
              options={STATUS_OPTIONS}
              selected={statuses}
              onChange={setStatuses}
              searchPlaceholder="Status"
              className="ml-2"
            />
          </div>
          <Button className="w-full mt-4 md:w-auto md:mt-0">
            <Plus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <TableV2
            columns={columns}
            data={users}
            loading={loading}
            loadingText="Loading users..."
            empty={<div>No users found.</div>}
            footer={
              pagination.total > 0 && (
                <PaginationFooter
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  pageSize={pagination.limit}
                  total={pagination.total}
                  itemName="users"
                  onPageChange={handlePageChange}
                />
              )
            }
          />
          {error && (
            <div className="py-4 text-center text-red-600">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
