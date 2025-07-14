"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/common";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/common";
import { Loading } from "@/components/common";
import { useResourceStore } from "@/store/useResourceStore";
import { Badge } from "@/components/common";

const assignSchema = z.object({
  assigned_to: z.string().min(1, "Please select a user")
});

export default function AssignResourcePage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();

  // Get state and actions from the store
  const {
    currentResource,
    users,
    loading,
    fetchResource,
    fetchUsers,
    assignResource
  } = useResourceStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(assignSchema)
  });

  useEffect(() => {
    if (params.id) {
      // Fetch resource and users in parallel
      Promise.all([fetchResource(params.id), fetchUsers()]).catch(error => {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      });
    }
  }, [params.id, fetchResource, fetchUsers]);

  useEffect(() => {
    if (currentResource) {
      reset({ assigned_to: currentResource.assignedTo || "" });
    }
  }, [currentResource, reset]);

  const onSubmit = async data => {
    try {
      setError("");

      await assignResource(params.id, data.assigned_to);

      // Redirect back to resources page
      router.push("/resources");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to assign resource";
      setError(errorMessage);
    }
  };

  const handleUnassign = async () => {
    try {
      setError("");

      await assignResource(params.id, null);

      // Redirect back to resources page
      router.push("/resources");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to unassign resource";
      setError(errorMessage);
    }
  };

  const getStatusBadge = status => {
    const statusMap = {
      pending: { label: "Pending", color: "blue" },
      in_progress: { label: "In Progress", color: "blue" },
      completed: { label: "Completed", color: "green" },
      cancelled: { label: "Cancelled", color: "red" },
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  if (error && !currentResource) {
    return (
      <div className="max-w-2xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="py-8 text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => router.push("/resources")} className="mt-4">
            Back to Resources
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl px-4 mx-auto sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>{currentResource?.name}</CardTitle>
          <CardDescription>{currentResource?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-3 mb-4 border border-red-200 rounded-md bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Type:</span>{" "}
                {currentResource?.type}
              </div>
              <div>
                <span className="font-medium">Status:</span>
                {getStatusBadge(currentResource?.status)}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="assigned_to"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Assign to User
              </label>
              <select
                id="assigned_to"
                {...register("assigned_to")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a user...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.assigned_to && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.assigned_to.message}
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                isBusy={loading}
                busyText="Assigning..."
                className="flex-1"
              >
                Assign Resource
              </Button>
              {currentResource?.assignedTo && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUnassign}
                  isBusy={loading}
                  busyText="Unassigning..."
                  className="flex-1"
                >
                  Unassign
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/resources")}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
