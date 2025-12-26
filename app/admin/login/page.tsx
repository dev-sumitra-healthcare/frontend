import { AdminLoginForm } from "@/components/AdminLoginForm";
import { Shield } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-3xl relative z-10">
        {/* Main Card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600 dark:bg-red-500 rounded-full blur-xl opacity-50" />
                <div className="relative bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 p-4 rounded-full shadow-lg transform transition-transform hover:scale-105">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-3">
              Admin Portal
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Secure system administration access
            </p>
          </div>

          {/* Login Form */}
          <div className="flex items-center justify-center w-full h-full">
            <AdminLoginForm />
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500">
                SECURE ACCESS
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              For authorized system administrators only
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Protected by enterprise-grade security</span>
            </div>
          </div>
        </div>

        {/* Bottom links */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Having trouble?
            <a
              href="#"
              className="ml-1 text-red-600 dark:text-red-400 hover:underline"
            >
              Contact IT Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
