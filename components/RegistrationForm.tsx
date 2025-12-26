"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldName } from "react-hook-form";
import { z } from "zod";
import { registerDoctor, completeOAuthRegistration, getGoogleOAuthUrl } from "@/lib/api";
import { toast } from "sonner";
import { BackendErrorResponse, FormFieldName } from "@/lib/types";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
import { DoctorRegistrationSchema } from "@/lib/schemas";

export function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isOAuthFlow, setIsOAuthFlow] = useState(false);
  const [oauthToken, setOauthToken] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof DoctorRegistrationSchema>>({
    resolver: zodResolver(DoctorRegistrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      medicalRegistrationId: "",
      specialty: "",
      password: "",
    },
  });

  // Check for OAuth params on mount
  useEffect(() => {
    const email = searchParams.get('email');
    const oauth = searchParams.get('oauth');
    const token = searchParams.get('oauth_token');

    if (oauth === 'true' && email && token) {
      setIsOAuthFlow(true);
      setOauthToken(token);
      form.setValue('email', email);
      // Email is pre-filled and read-only for OAuth
    }
  }, [searchParams, form]);

  async function onSubmit(values: z.infer<typeof DoctorRegistrationSchema>) {
    setIsLoading(true);
    try {
      if (isOAuthFlow && oauthToken) {
        // OAuth registration completion
        const response = await completeOAuthRegistration({
          email: values.email,
          oauthToken: oauthToken,
          fullName: values.fullName,
          medicalRegistrationId: values.medicalRegistrationId,
          specialty: values.specialty,
        });

        // Store token and user data
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        toast.success("Registration Successful", {
          description: "Your account has been created with Google.",
        });

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        // Traditional email/password registration
        await registerDoctor(values);
        toast.success("Registration Successful", {
          description: "Your account has been created. Please login to continue.",
        });
        
        // Redirect to login
        router.push('/doctor/login');
      }
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors) {
          error.response.data.errors.forEach((err: { field: FormFieldName; message: string }) => {
            form.setError(err.field as FieldName<z.infer<typeof DoctorRegistrationSchema>>, {
              type: "server",
              message: err.message,
            });
          });
          return; // Exit after setting form errors
        }
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error("Registration Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const response = await getGoogleOAuthUrl();
      window.location.href = response.data.url;
    } catch (error: unknown) {
      let errorMessage = "Failed to initiate Google signup";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error("Google Signup Failed", {
        description: errorMessage,
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Doctor Registration</CardTitle>
        {isOAuthFlow && (
          <p className="text-sm text-muted-foreground mt-2">
            Complete your registration with Google
          </p>
        )}
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
                    <Input placeholder="John Doe" {...field} />
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
                    <Input 
                      placeholder="john.doe@example.com" 
                      {...field} 
                      readOnly={isOAuthFlow}
                      className={isOAuthFlow ? "bg-muted" : ""}
                    />
                  </FormControl>
                  {isOAuthFlow && (
                    <p className="text-xs text-muted-foreground">From Google account</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medicalRegistrationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Registration ID</FormLabel>
                  <FormControl>
                    <Input placeholder="MR12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <FormControl>
                    <Input placeholder="Cardiology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isOAuthFlow && (
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
            )}
            <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>

            {!isOAuthFlow && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignup}
                  disabled={isLoading || isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Connecting to Google...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign up with Google
                    </div>
                  )}
                </Button>
              </>
            )}

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Button 
                variant="link" 
                className="px-0 font-medium" 
                type="button"
                onClick={() => router.push('/doctor/login')}
              >
                Login here
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
