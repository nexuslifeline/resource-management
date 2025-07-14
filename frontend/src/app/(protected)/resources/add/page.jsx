"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export default function AddResourcePage() {
  const [error, setError] = useState("");
  const router = useRouter();

  // Get actions from the store
  const { createResource, loading } = useResourceStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      status: "pending",
      priority: "medium",
      type: "other"
    }
  });

  const onSubmit = async data => {
    try {
      setError("");

      // Convert dueDate to proper format if provided
      const formData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        tags: data.tags || []
      };

      await createResource(formData);

      // Redirect back to resources page
      router.push("/resources");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create resource";
      setError(errorMessage);

      // Log detailed validation errors
      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
      }
    }
  };

  return (
    <div className="max-w-2xl px-4 mx-auto sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Resource Information</CardTitle>
          <CardDescription>
            Fill in the details below to create a new resource
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
                type="datetime-local"
                {...register("dueDate")}
                error={errors.dueDate?.message}
              />
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                isBusy={loading}
                busyText="Creating..."
                className="flex-1"
              >
                Create Resource
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
