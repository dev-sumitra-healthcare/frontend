"use client";

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePatientAuth } from '@/contexts/PatientAuthContext';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { User, Lock, Eye, EyeOff, Heart, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const PatientLoginSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  password: z.string().min(6, 'Password is required'),
});

export default function PatientLoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, error: authError, clearError } = usePatientAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/patient/dashboard');
    }
  }, [isAuthenticated, router]);

  const form = useForm<z.infer<typeof PatientLoginSchema>>({
    resolver: zodResolver(PatientLoginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (values: z.infer<typeof PatientLoginSchema>) => {
    try {
      clearError();
      setLocalError(null);

      await login(values.username, values.password);

      toast.success('Login Successful', {
        description: 'Welcome back!',
      });
    } catch (e: any) {
      const errorMessage = e.message || 'Login failed. Please try again.';
      setLocalError(errorMessage);
      toast.error('Login Failed', {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="patient-card-elevated w-full max-w-[480px] overflow-hidden">
      <div className="p-8">
        {/* Icon Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <div className="patient-icon-container patient-icon-primary w-16 h-16 shadow-glow-patient">
            <Heart className="h-8 w-8 text-white" />
          </div>
        </motion.div>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gradient-patient text-3xl md:text-4xl font-bold mb-3"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="patient-body-sm"
          >
            Enter your credentials to access your account
          </motion.p>
        </div>

        {/* Error Display */}
        {(authError || localError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-500" />
            <p className="text-sm font-medium text-red-600">{authError || localError}</p>
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
              <FormField name="username" control={form.control} render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-[#101828]">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]">
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        {...field}
                        type="text"
                        placeholder="your.username"
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-[#f3e8ff] bg-[#faf5ff] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#9810fa]/30 focus:border-[#9810fa] transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FormField name="password" control={form.control} render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-[#101828]">Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]">
                          <Lock className="h-5 w-5" />
                        </div>
                        <input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="w-full h-12 pl-12 pr-12 rounded-xl border border-[#f3e8ff] bg-[#faf5ff] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#9810fa]/30 focus:border-[#9810fa] transition-all"
                        />
                      </div>
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#9810fa] transition-colors"
                      onClick={() => setShowPassword((s) => !s)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-right"
            >
              <button
                type="button"
                className="text-sm font-medium text-[#9810fa] hover:text-[#a855f7] transition-colors"
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
              <button
                type="submit"
                disabled={authLoading}
                className="patient-btn-primary w-full h-12 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </motion.div>
          </form>
        </Form>
      </div>
    </div>
  );
}
