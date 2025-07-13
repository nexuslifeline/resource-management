"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Github, Facebook } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, clearError, error } = useAuthStore();

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
      clearError();
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f7fafd] py-12 px-4">
      <Card className="w-full max-w-md border border-gray-200 shadow-md rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Login</CardTitle>
          <CardDescription>
            Enter your email and password below to log into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                className=""
                placeholder="name@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className="pr-10"
                  placeholder="********"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute text-gray-400 -translate-y-1/2 right-2 top-1/2 hover:text-gray-600"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </form>
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-3 text-xs font-medium text-gray-400">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="flex gap-3 mb-4">
            <Button
              variant="outline"
              className="flex items-center justify-center flex-1 gap-2"
            >
              <Github className="w-4 h-4" /> GitHub
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center flex-1 gap-2"
            >
              <Facebook className="w-4 h-4" /> Facebook
            </Button>
          </div>
          <p className="mt-2 text-xs text-center text-gray-500">
            By clicking login, you agree to our{" "}
            <Link href="#" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
      <footer className="flex flex-col items-center w-full mt-6 mb-2 text-sm text-gray-500">
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/about-us" className="hover:underline">
            About Us
          </Link>
          <span className="hidden sm:inline">|</span>
          <Link href="/contact-us" className="hover:underline">
            Contact Us
          </Link>
        </div>
      </footer>
    </div>
  );
}
