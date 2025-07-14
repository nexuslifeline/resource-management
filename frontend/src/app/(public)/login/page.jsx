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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, error } = useAuthStore();

  // Clear auth errors on mount and unmount
  useAuthErrorCleanup();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async data => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (error) {
      // Error is already handled by the store
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Login"
      description="Enter your email and password below to log into your account"
      termsText="By clicking login, you agree to our"
    >
      {error && (
        <div className="p-3 mb-4 border border-red-200 rounded-md bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {...register("email")}
            placeholder="name@example.com"
            error={errors.email?.message}
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-gray-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            label=""
            autoComplete="current-password"
            register={register("password")}
            error={errors.password?.message}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
          isBusy={isLoading}
          busyText="Signing in..."
        >
          Login
        </Button>
      </form>
      
      <SocialLoginButtons />
      
      <p className="mt-4 text-xs text-center text-gray-500">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign up
        </Link>
      </p>
    </AuthContainer>
  );
}
