"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/forms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/common/Card";
import { Loading } from "@/components/common";
import { useResourceStore } from "@/store/useResourceStore";
import {
  RESOURCE_TYPE_OPTIONS,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS
} from "@/shared/constants";

const resourceSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be less than 255 characters"),
  description: z.string().optional(),
  type: z.enum(["project", "task", "inventory", "document", "other"], {
    required_error: "Type is required"
  }),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"], {
    required_error: "Status is required"
  }),
  priority: z.enum(["low", "medium", "high", "urgent"], {
    required_error: "Priority is required"
  }),
  dueDate: z.string().optional()
});

export default function EditResourcePage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();

  // Get state and actions from the store
  const { currentResource, loading, fetchResource, updateResource } =
    useResourceStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger
  } = useForm({ resolver: zodResolver(resourceSchema) });

  useEffect(() => {
    if (params.id) {
      fetchResource(params.id);
    }
  }, [params.id, fetchResource]);

  useEffect(() => {
    if (currentResource) {
      // Format the data for the form
      const formData = {
        ...currentResource,
        dueDate: currentResource.dueDate
          ? new Date(currentResource.dueDate).toISOString().slice(0, 16)
          : ""
      };

      reset(formData);
    }
  }, [currentResource, reset]);

  const onSubmit = async data => {
    try {
      setError("");

      // Convert dueDate to proper format if provided
      const formData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        tags: data.tags || []
      };

      console.log("Submitting form data:", formData);
      console.log("Resource ID:", params.id);

      await updateResource(params.id, formData);

      // Redirect back to resources page
      router.push("/resources");
    } catch (error) {
      console.error("Update error:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message || "Failed to update resource";
      setError(errorMessage);

      // Log detailed validation errors
      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading resource..." />
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
          <CardTitle>Resource Information</CardTitle>
          <CardDescription>
            Update the details below to modify the resource
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-3 mb-4 border border-red-200 rounded-md bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Resource Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                {...register("name")}
                placeholder="Enter resource name"
                error={errors.name?.message}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                {...register("description")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter resource description (optional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="type"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Resource Type *
              </label>
              <select
                id="type"
                name="type"
                {...register("type")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {RESOURCE_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Status *
              </label>
              <select
                id="status"
                name="status"
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Priority *
              </label>
              <select
                id="priority"
                name="priority"
                {...register("priority")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {PRIORITY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Due Date
              </label>
              <Input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
                {...register("dueDate")}
                error={errors.dueDate?.message}
              />
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                className="flex-1"
                isBusy={loading}
                busyText="Saving..."
              >
                Save Changes
              </Button>
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
