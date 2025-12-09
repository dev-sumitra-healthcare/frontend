"use client";

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePatientAuth } from '@/contexts/PatientAuthContext';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassCard } from '@/components/glass/GlassCard';
import { GlassInput } from '@/components/glass/GlassInput';
import { GradientText } from '@/components/gradient/GradientText';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { User, Lock, Eye, EyeOff, HeartPulse, Loader2, AlertCircle } from 'lucide-react';
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
    <GlassCard variant="default" className="w-full max-w-[520px]">
      <div className="p-8">
        {/* Icon Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-xl"></div>
            <HeartPulse className="h-8 w-8 text-white relative z-10" />
          </div>
        </motion.div>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GradientText variants="lavender" className="text-3xl md:text-4xl font-bold mb-3">
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
            className="mb-6 p-4 rounded-2xl backdrop-blur-sm bg-red-500/10 border border-red-500/20 flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">{authError || localError}</p>
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
              <FormField name="username" control={form.control} render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-ocean-deep dark:text-gray-200">Username</FormLabel>
                  <FormControl>
                    <GlassInput
                      {...field}
                      placeholder="your.username"
                      icon={User}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
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
                      onClick={() => setShowPassword((s) => !s)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <FormMessage className="text-xs" />
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
                className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
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
          </form>
        </Form>
      </div>
    </GlassCard>
  );
}
