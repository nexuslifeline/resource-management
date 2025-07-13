"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import AuthenticatedLayout from "@/components/layout/authenticated-layout";
import { api } from "@/shared/lib";

const resourceSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be less than 255 characters"),
  description: z.string().optional(),
  // type: z.enum(["project", "task", "inventory", "document", "other"], {
  //   required_error: "Type is required"
  // }),
  // status: z.enum(["pending", "in_progress", "completed", "cancelled"], {
  //   required_error: "Status is required"
  // }),
  // priority: z.enum(["low", "medium", "high", "urgent"], {
  //   required_error: "Priority is required"
  // }),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export default function EditResourcePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [resource, setResource] = useState(null);
  const router = useRouter();
  const params = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger
  } = useForm({ esolver: zodResolver(resourceSchema) });

  useEffect(() => {
    fetchResource();
  }, []);

  const fetchResource = async () => {
    try {
      const response = await api.get(`/resources/${params.id}`);
      const resourceData = response.data.data;
      setResource(resourceData);

      // Format the data for the form
      const formData = {
        ...resourceData,
        dueDate: resourceData.dueDate
          ? new Date(resourceData.dueDate).toISOString().slice(0, 16)
          : ""
      };

      reset(formData);
    } catch (error) {
      console.error("Error fetching resource:", error);
      setError("Failed to load resource");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async data => {
    try {
      setIsSaving(true);
      setError("");

      // Convert dueDate to proper format if provided
      const formData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        tags: data.tags || []
      };

      console.log("Submitting form data:", formData);
      console.log("Resource ID:", params.id);

      const response = await api.put(`/resources/${params.id}`, formData);
      console.log("Update response:", response.data);

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
    } finally {
      setIsSaving(false);
    }
  };

  // Test function to manually trigger submission
  const testSubmit = () => {
    console.log("Test submit triggered");
    alert("Test submit works!");
  };

  // Test function to manually trigger form validation and submission
  const testFormSubmit = async () => {
    console.log("Testing form submission...");

    // Check if form is valid
    const isValid = await trigger();
    console.log("Form is valid:", isValid);
    console.log("Form errors:", errors);

    if (isValid) {
      console.log("Form is valid, triggering submission...");
      // Get current form values
      const formValues = document.querySelector("form").elements;
      const data = {};
      for (let element of formValues) {
        if (element.name) {
          data[element.name] = element.value;
        }
      }
      console.log("Form data:", data);
      onSubmit(data);
    } else {
      alert("Form validation failed! Check console for errors.");
    }
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="lg" text="Loading resource..." />
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error && !resource) {
    return (
      <AuthenticatedLayout>
        <div className="max-w-2xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="py-8 text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => router.push("/resources")} className="mt-4">
              Back to Resources
            </Button>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-2xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Resource</h1>
          <p className="mt-2 text-gray-600">Update resource information</p>
        </div>

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
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
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
                  <option value="project">Project</option>
                  <option value="task">Task</option>
                  <option value="inventory">Inventory</option>
                  <option value="document">Document</option>
                  <option value="other">Other</option>
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
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
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
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
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
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
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
    </AuthenticatedLayout>
  );
}
