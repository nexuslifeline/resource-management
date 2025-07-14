"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/forms";
import { PasswordInput } from "@/components/common";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthContainer } from "@/components/containers";
import { SocialLoginButtons } from "@/components/common";
import { useAuthErrorCleanup } from "@/hooks";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export default function RegisterPage() {
  const router = useRouter();
  const { register, error } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);

  // Clear auth errors on mount and unmount
  useAuthErrorCleanup();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async data => {
    try {
      setIsLoading(true);
      await register(data.name, data.email, data.password);
      router.push("/dashboard");
    } catch (error) {
      // Error is already handled by the store
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Register"
      description="Create your account to get started"
      termsText="By clicking register, you agree to our"
      footerContent={
        <p className="mt-4 text-xs text-center text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      }
    >
      {error && (
        <div className="p-3 mb-4 border border-red-200 rounded-md bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            {...formRegister("name")}
            placeholder="Enter your full name"
            error={errors.name?.message}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...formRegister("email")}
            placeholder="name@example.com"
            error={errors.email?.message}
          />
        </div>

        <PasswordInput
          id="password"
          label="Password"
          autoComplete="new-password"
          register={formRegister("password")}
          error={errors.password?.message}
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
          register={formRegister("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          className="w-full text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
          isBusy={isLoading}
          busyText="Creating account..."
        >
          Create account
        </Button>
      </form>

      <SocialLoginButtons />
    </AuthContainer>
  );
}
