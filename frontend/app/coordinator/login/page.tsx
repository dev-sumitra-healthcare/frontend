"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2, AlertCircle } from "lucide-react";
import { loginCoordinator } from "@/lib/api";
import { toast } from "sonner";

export default function CoordinatorLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginCoordinator({
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const { coordinator } = response.data.data;

        if (coordinator.accountStatus === "pending_verification" || coordinator.account_status === "pending_verification") {
          setError(
            "Your account is pending verification. Please wait for admin approval or contact your hospital administrator."
          );
          setLoading(false);
          return;
        }

        if (coordinator.accountStatus === "suspended" || coordinator.account_status === "suspended") {
          setError(
            "Your account has been suspended. Please contact your hospital administrator."
          );
          setLoading(false);
          return;
        }

        toast.success("Login successful!");
        router.push("/coordinator/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials and try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-background dark:via-background/95 dark:to-primary/5 px-4 py-8">
      <div className="w-full max-w-4/12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-full shadow-lg dark:shadow-blue-500/20">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Sign in to your coordinator dashboard
          </p>
        </div>

        <Card className="border-0 shadow-xl dark:shadow-2xl mb-6">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
              Coordinator Login
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Manage your hospital operations
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <AlertDescription className="ml-2">{error}</AlertDescription>
                </div>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="coordinator@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-11 w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </Label>
                  <a
                    href="/coordinator/forgot-password"
                    className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline whitespace-nowrap"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-11 w-full"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pb-6">
            <Button
              type="button"
              onClick={handleSubmit}
              className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-card px-2 text-gray-500 dark:text-gray-400">New here?</span>
              </div>
            </div>

            <div className="text-center w-full">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <a
                  href="/coordinator/register"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                >
                  Register here
                </a>
              </p>
            </div>
          </CardFooter>
        </Card>

        <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-gray-100 dark:border-border p-4 mb-4">
          <p className="text-xs sm:text-sm text-center text-gray-600 dark:text-gray-400 mb-3">
            Looking for a different portal?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <a
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium"
            >
              Doctor Login
            </a>
            <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
            <a
              href="/admin/login"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium"
            >
              Admin Login
            </a>
          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
