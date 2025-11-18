"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Building2, AlertCircle, CheckCircle2 } from "lucide-react";
import { registerCoordinator, type CoordinatorRegistrationRequest, getActiveHospitals, type Hospital } from "@/lib/api";

export default function CoordinatorRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState<CoordinatorRegistrationRequest>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    hospitalId: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);

  // Fetch hospitals on component mount
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await getActiveHospitals();
        if (response.data.success) {
          setHospitals(response.data.data.hospitals);
        }
      } catch (error) {
        console.error('Failed to fetch hospitals:', error);
        setError('Failed to load hospitals. Please refresh the page.');
      } finally {
        setLoadingHospitals(false);
      }
    };

    fetchHospitals();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  const handleSelectChange = (name: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must contain at least one lowercase letter, one uppercase letter, and one number");
      return false;
    }

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!formData.hospitalId.trim()) {
      setError("Hospital ID is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await registerCoordinator(formData);

      if (response.data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/coordinator/login");
        }, 3000);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      // Handle validation errors array from backend
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors.map((e: any) => e.msg).join(', ');
        setError(errorMessages);
      } else {
        const errorMessage = err.response?.data?.message ||
          "Registration failed. Please check your information and try again.";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-background dark:via-background/95 dark:to-green-950/20 px-4 py-8">
        <Card className="w-full max-w-md border-0 shadow-xl dark:shadow-2xl">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                  <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Registration Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Your account has been created successfully.
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-6">
                Your account is pending admin verification. You will be notified once approved.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting to login page...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-background dark:via-background/95 dark:to-primary/5 px-4 py-8">
      <div className="w-full max-w-4/12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-full shadow-lg dark:shadow-blue-500/20">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Join as Coordinator
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Create your account to manage hospital operations
          </p>
        </div>

        <Card className="border-0 shadow-xl dark:shadow-2xl mb-6">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
              Coordinator Registration
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <div className="flex items-start">
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                    <AlertDescription className="ml-2">{error}</AlertDescription>
                  </div>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Full Name <span className="text-red-500 dark:text-red-400">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11 w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email Address <span className="text-red-500 dark:text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="coordinator@hospital.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11 w-full"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-11 w-full"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="hospitalId"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Hospital <span className="text-red-500 dark:text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                  <Select
                    disabled={loadingHospitals || loading}
                    onValueChange={(value) => handleSelectChange("hospitalId", value)}
                    value={formData.hospitalId}
                  >
                    <SelectTrigger className="pl-11 h-11 w-full">
                      <SelectValue
                        placeholder={
                          loadingHospitals
                            ? "Loading hospitals..."
                            : "Select your hospital"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {hospitals.map((hospital) => (
                        <SelectItem key={hospital.id} value={hospital.id}>
                          {hospital.name}
                          {hospital.city && hospital.state
                            ? ` (${hospital.city}, ${hospital.state})`
                            : ''}
                        </SelectItem>
                      ))}
                      {hospitals.length === 0 && !loadingHospitals && (
                        <SelectItem value="no-hospitals" disabled>
                          No hospitals available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select the hospital where you work as a coordinator
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password <span className="text-red-500 dark:text-red-400">*</span>
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11 w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm Password <span className="text-red-500 dark:text-red-400">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11 w-full"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                <p className="text-xs text-blue-900 dark:text-blue-300">
                  <strong>Important:</strong> After registration, your account will be in
                  <span className="font-semibold"> pending verification</span> status.
                  You'll be able to log in once an administrator approves your account.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pb-6">
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-card px-2 text-gray-500 dark:text-gray-400">
                    Already registered?
                  </span>
                </div>
              </div>

              <div className="text-center w-full">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/coordinator/login"
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                  >
                    Sign in here
                  </a>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-gray-100 dark:border-border p-4 mb-4">
          <p className="text-xs sm:text-sm text-center text-gray-600 dark:text-gray-400 mb-3">
            Looking for a different portal?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <a
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium"
            >
              Doctor Login
            </a>
            <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
            <a
              href="/admin/login"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium"
            >
              Admin Login
            </a>
          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          By registering, you agree to our{" "}
          <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
