"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Stethoscope, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassInput } from "@/components/glass/GlassInput";
import { GradientText } from "@/components/gradient/GradientText";
import { motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DoctorLoginSchema } from "@/lib/schemas";

export function LoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/doctor/dashboard');
    }
  }, [isAuthenticated, router]);

  const form = useForm<z.infer<typeof DoctorLoginSchema>>({
    resolver: zodResolver(DoctorLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof DoctorLoginSchema>) {
    try {
      clearError();
      setLocalError(null);
      
      await login(values.email, values.password);
      
      toast.success("Login Successful", {
        description: "Welcome back!",
      });
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please try again.";
      setLocalError(errorMessage);
      toast.error("Login Failed", {
        description: errorMessage,
      });
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
    toast.info("Google OAuth", {
      description: "Google login will be available soon.",
    });
  };

  return (
    <GlassCard variant="default" className="w-full max-w-[540px]">
      <div className="p-8">
        {/* Icon Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-xl"></div>
            <Stethoscope className="h-8 w-8 text-white relative z-10" />
          </div>
        </motion.div>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GradientText variant="primary" className="text-3xl md:text-4xl font-bold mb-3">
              Welcome Back
            </GradientText>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-ocean-mid dark:text-gray-300 text-sm"
          >
            Enter your credentials to access your account
          </motion.p>
        </div>

        {/* Error Display */}
        {(authError || localError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-2xl backdrop-blur-sm flex items-start gap-3 ${
              (authError || localError)?.includes('pending verification')
                ? 'bg-amber-500/10 border border-amber-500/20'
                : 'bg-red-500/10 border border-red-500/20'
            }`}
          >
            <AlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
              (authError || localError)?.includes('pending verification')
                ? 'text-amber-500'
                : 'text-red-500'
            }`} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                (authError || localError)?.includes('pending verification')
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {authError || localError}
              </p>
              {(authError || localError)?.includes('pending verification') && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  Your registration has been received. An administrator will review and activate your account shortly.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-ocean-deep dark:text-gray-200">Email</FormLabel>
                    <FormControl>
                      <GlassInput
                        {...field}
                        type="email"
                        placeholder="doctor@example.com"
                        icon={Mail}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-ocean-deep dark:text-gray-200">Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <GlassInput
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          icon={Lock}
                          className="h-12 pr-12"
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-ocean-mid hover:text-ocean-deep dark:hover:text-gray-200 transition-colors"
                        onClick={togglePasswordVisibility}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-right"
            >
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                onClick={() => console.log('Reset password')}
              >
                Forgot password?
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <GlassButton
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={authLoading}
              >
                {authLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Logging in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </GlassButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="relative my-6"
            >
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-ocean-light/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 px-3 text-ocean-mid">Or continue with</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <GlassButton
                type="button"
                variant="glass"
                size="lg"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={authLoading}
              >
                {authLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading...
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
                    Sign in with Google
                  </div>
                )}
              </GlassButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-6 text-center text-sm"
            >
              <span className="text-ocean-mid dark:text-gray-400">Don't have an account? </span>
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                onClick={() => router.push('/doctor/register')}
              >
                Register here
              </button>
            </motion.div>
          </form>
        </Form>
      </div>
    </GlassCard>
  );
}
