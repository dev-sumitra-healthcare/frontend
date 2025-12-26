"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldName } from "react-hook-form";
import { z } from "zod";
import { registerAdmin } from "@/lib/api";
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

// Schema for admin registration (bootstrap first admin)
const AdminRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must be at most 100 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number"),
});

export function AdminRegistrationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof AdminRegistrationSchema>>({
    resolver: zodResolver(AdminRegistrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof AdminRegistrationSchema>) {
    setIsLoading(true);
    try {
      const response = await registerAdmin(values);
      localStorage.setItem("adminAccessToken", response.data.data.accessToken);
      localStorage.setItem("admin", JSON.stringify(response.data.data.admin));
      toast.success("Admin Registration Successful", {
        description: "First admin account created. Redirecting to admin dashboard.",
      });
      router.push("/admin/dashboard");
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors) {
          error.response.data.errors.forEach((err: { field: FormFieldName; message: string }) => {
            form.setError(err.field as FieldName<z.infer<typeof AdminRegistrationSchema>>, {
              type: "server",
              message: err.message,
            });
          });
          return;
        }
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error("Admin Registration Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Create First Admin</CardTitle>
        <p className="text-sm text-gray-600">
          Bootstrap the system with the first administrator account
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              {isLoading ? "Creating Admin..." : "Create First Admin"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
