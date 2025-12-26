"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldName } from "react-hook-form";
import { z } from "zod";
import { loginAdmin } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BackendErrorResponse, FormFieldName } from "@/lib/types";
import axios from "axios";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLoginSchema } from "@/lib/schemas";

export function AdminLoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof AdminLoginSchema>>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof AdminLoginSchema>) {
    setIsLoading(true);
    try {
      const response = await loginAdmin(values); // Use loginAdmin
      localStorage.setItem("adminAccessToken", response.data.data.accessToken); // Store admin token
      localStorage.setItem("admin", JSON.stringify(response.data.data.admin)); // Store admin profile
      toast.success("Admin Login Successful", {
        description: "Redirecting to admin dashboard.",
      });
      router.push("/admin/dashboard"); // Redirect to admin dashboard
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors) {
          error.response.data.errors.forEach((err: { field: FormFieldName; message: string }) => {
            form.setError(err.field as FieldName<z.infer<typeof AdminLoginSchema>>, {
              type: "server",
              message: err.message,
            });
          });
          return; // Exit after setting form errors
        }
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error("Admin Login Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
