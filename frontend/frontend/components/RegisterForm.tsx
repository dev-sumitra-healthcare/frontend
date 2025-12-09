"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Stethoscope, Mail, Lock, User, IdCard, Briefcase, Loader2, AlertCircle, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getActiveHospitals, Hospital } from "@/lib/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Registration schema
const DoctorRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  medicalRegistrationId: z.string().min(5, "Medical Registration ID must be at least 5 characters").max(50),
  specialty: z.string().min(2, "Specialty must be at least 2 characters").max(100),
  hospitalId: z.string().min(1, "Please select a hospital"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function RegisterForm() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);

  // Fetch hospitals on mount
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await getActiveHospitals();
        if (response.data.success) {
          setHospitals(response.data.data.hospitals);
        }
      } catch (error) {
        console.error('Failed to fetch hospitals:', error);
        toast.error('Failed to load hospitals', {
          description: 'Please refresh the page to try again.',
        });
      } finally {
        setLoadingHospitals(false);
      }
    };

    fetchHospitals();
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const form = useForm<z.infer<typeof DoctorRegistrationSchema>>({
    resolver: zodResolver(DoctorRegistrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      medicalRegistrationId: "",
      specialty: "",
      hospitalId: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof DoctorRegistrationSchema>) {
    try {
      clearError();
      setLocalError(null);

      const { confirmPassword, ...registerData } = values;

      await register(registerData);

      toast.success("Registration Successful", {
        description: "Your account has been created and is pending verification. You'll be able to login once an administrator approves your account.",
        duration: 6000,
      });

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/doctor/login');
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.message || "Registration failed. Please try again.";
      setLocalError(errorMessage);
      toast.error("Registration Failed", {
        description: errorMessage,
      });
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <GlassCard variant="default" className="w-full max-w-[600px]">
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
              Create Doctor Account
            </GradientText>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-ocean-mid dark:text-gray-300 text-sm"
          >
            Register to access the MedMitra portal
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-ocean-deep dark:text-gray-200">Full Name</FormLabel>
                    <FormControl>
                      <GlassInput
                        {...field}
                        placeholder="Dr. John Smith"
                        icon={User}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
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

            {/* Medical Registration ID */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FormField
                control={form.control}
                name="medicalRegistrationId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-ocean-deep dark:text-gray-200">Medical Registration ID</FormLabel>
                    <FormControl>
                      <GlassInput
                        {...field}
                        placeholder="MED123456"
                        icon={IdCard}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Specialty */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-ocean-deep dark:text-gray-200">Specialty</FormLabel>
                    <FormControl>
                      <GlassInput
                        {...field}
                        placeholder="Cardiology"
                        icon={Briefcase}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Hospital */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <FormField
                control={form.control}
                name="hospitalId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-ocean-deep dark:text-gray-200">Hospital</FormLabel>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ocean-mid z-10" />
                      <FormControl>
                        <Select
                          disabled={loadingHospitals || authLoading}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="pl-12 h-12 rounded-xl backdrop-blur-sm bg-white/40 dark:bg-gray-900/40 border border-white/20 dark:border-gray-700/20">
                            <SelectValue placeholder={loadingHospitals ? "Loading hospitals..." : "Select your hospital"} />
                          </SelectTrigger>
                          <SelectContent>
                            {hospitals.map((hospital) => (
                              <SelectItem key={hospital.id} value={hospital.id}>
                                {hospital.name}
                                {hospital.city && hospital.state ? ` (${hospital.city}, ${hospital.state})` : ''}
                              </SelectItem>
                            ))}
                            {hospitals.length === 0 && !loadingHospitals && (
                              <SelectItem value="no-hospitals" disabled>
                                No hospitals available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
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

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-ocean-deep dark:text-gray-200">Confirm Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <GlassInput
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          icon={Lock}
                          className="h-12 pr-12"
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-ocean-mid hover:text-ocean-deep dark:hover:text-gray-200 transition-colors"
                        onClick={toggleConfirmPasswordVisibility}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
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
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </GlassButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 text-center text-sm"
            >
              <span className="text-ocean-mid dark:text-gray-400">Already have an account? </span>
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                onClick={() => router.push("/doctor/login")}
              >
                Login here
              </button>
            </motion.div>
          </form>
        </Form>
      </div>
    </GlassCard>
  );
}
