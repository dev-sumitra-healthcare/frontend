"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get access token from URL parameters
        const accessToken = searchParams.get("access_token");
        const error = searchParams.get("error");

        if (error) {
          setStatus("error");
          setMessage(`Authentication failed: ${error}`);
          toast.error("Authentication Failed", {
            description: error,
          });
          
          // Redirect to login after a delay
          setTimeout(() => {
            router.push("/doctor/login");
          }, 3000);
          return;
        }

        if (!accessToken) {
          setStatus("error");
          setMessage("No access token received");
          toast.error("Authentication Failed", {
            description: "No access token received from the server",
          });
          
          // Redirect to login after a delay
          setTimeout(() => {
            router.push("/doctor/login");
          }, 3000);
          return;
        }

        // Store the access token
        localStorage.setItem("accessToken", accessToken);

        // Fetch user session
        const sessionResponse = await getSession();
        const user = sessionResponse.data.user;

        // Store user data
        localStorage.setItem("user", JSON.stringify(user));

        setStatus("success");
        setMessage("Authentication successful! Redirecting...");
        
        toast.success("Login Successful", {
          description: `Welcome back, ${user.username}!`,
        });

        // Redirect to dashboard based on role
        setTimeout(() => {
          if (user.role === "admin" || user.role === "super_admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/dashboard");
          }
        }, 1500);
      } catch (error: any) {
        console.error("OAuth callback error:", error);
        setStatus("error");
        setMessage("Failed to complete authentication");
        
        toast.error("Authentication Failed", {
          description: error.response?.data?.message || "An unexpected error occurred",
        });
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push("/doctor/login");
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card rounded-lg shadow-xl border border-muted/50 p-8">
          <div className="flex flex-col items-center space-y-4">
            {status === "loading" && (
              <>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-center">
                  Completing Sign In
                </h2>
                <p className="text-muted-foreground text-center">
                  {message}
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-center text-green-600">
                  Success!
                </h2>
                <p className="text-muted-foreground text-center">
                  {message}
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-center text-red-600">
                  Authentication Failed
                </h2>
                <p className="text-muted-foreground text-center">
                  {message}
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  Redirecting to login page...
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
}
