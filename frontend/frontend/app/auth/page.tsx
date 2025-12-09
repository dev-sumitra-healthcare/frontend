"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Stethoscope, HeartPulse, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  const router = useRouter();

  // Redirect to doctor login by default after a short delay
  // This maintains some backward compatibility for bookmarked links
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/doctor/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-background dark:via-background/95 dark:to-primary/5 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Select Portal
          </h1>
          <p className="text-gray-700 dark:text-gray-400 text-sm">
            Choose your portal to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Doctor Portal */}
          <Link href="/doctor/login">
            <Card className="h-full hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-500 group">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Doctor Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  Access your clinical dashboard, manage appointments, and patient records
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                  Continue as Doctor
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Patient Portal */}
          <Link href="/patient/login">
            <Card className="h-full hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-500 group">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HeartPulse className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Patient Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  View appointments, access health records, and book consultations
                </p>
                <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 font-medium">
                  Continue as Patient
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Redirecting to Doctor Portal in 5 seconds...
        </p>
      </div>
    </div>
  );
}
