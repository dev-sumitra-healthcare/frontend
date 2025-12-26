"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createPatient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Simplified schema with only required fields
const quickAddPatientSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], {
    required_error: "Please select a gender",
  }),
}).refine(
  (data) => data.email || data.phone,
  {
    message: "Either email or phone number is required",
    path: ["email"],
  }
);

type QuickAddPatientFormValues = z.infer<typeof quickAddPatientSchema>;

interface DuplicatePatient {
  id: string;
  fullName: string;
  uhid: string;
  email?: string;
  phoneNumber?: string;
}

interface QuickAddPatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (patientId: string) => void;
}

export function QuickAddPatientModal({
  open,
  onOpenChange,
  onSuccess,
}: QuickAddPatientModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [duplicatePatient, setDuplicatePatient] = useState<DuplicatePatient | null>(null);

  const form = useForm<QuickAddPatientFormValues>({
    resolver: zodResolver(quickAddPatientSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: undefined,
    },
  });

  const onSubmit = async (values: QuickAddPatientFormValues) => {
    setIsLoading(true);
    setDuplicatePatient(null);

    try {
      const response = await createPatient({
        fullName: values.fullName,
        email: values.email || undefined,
        phone: values.phone || undefined,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
      });

      if (response.data?.success) {
        const patientId = response.data.data.patient.id;

        toast.success("Patient created successfully!", {
          description: `${values.fullName} has been added to your patient list.`,
        });

        form.reset();
        onOpenChange(false);

        // Navigate back to dashboard or trigger success callback
        if (onSuccess) {
          onSuccess(patientId);
        } else {
          // Default: Navigate back to dashboard
          router.push(`/dashboard`);
        }
      }
    } catch (error: any) {
      console.error("Error creating patient:", error);

      // Handle duplicate patient error
      if (error.response?.status === 409 && error.response?.data?.data?.existingPatient) {
        const existing = error.response.data.data.existingPatient;
        setDuplicatePatient(existing);
        toast.error("Patient already exists", {
          description: `A patient with this ${existing.email ? "email" : "phone"} already exists.`,
        });
      } else {
        toast.error("Failed to create patient", {
          description: error.response?.data?.message || error.message || "An unexpected error occurred",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseExisting = () => {
    if (duplicatePatient) {
      toast.info("Using existing patient", {
        description: `Redirecting to ${duplicatePatient.fullName}'s encounter page...`,
      });

      onOpenChange(false);

      if (onSuccess) {
        onSuccess(duplicatePatient.id);
      } else {
        router.push(`/dashboard`);
      }
    }
  };

  const handleReset = () => {
    setDuplicatePatient(null);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Quickly add a new patient with essential information. You can add more details later.
          </DialogDescription>
        </DialogHeader>

        {duplicatePatient && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Patient Already Exists</AlertTitle>
            <AlertDescription className="space-y-2">
              <p className="text-sm">
                <strong>{duplicatePatient.fullName}</strong> (UHID: {duplicatePatient.uhid})
              </p>
              {duplicatePatient.email && (
                <p className="text-sm">Email: {duplicatePatient.email}</p>
              )}
              {duplicatePatient.phoneNumber && (
                <p className="text-sm">Phone: {duplicatePatient.phoneNumber}</p>
              )}
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleUseExisting}
                >
                  Start Encounter with Existing Patient
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                >
                  Try Different Patient
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email and Phone in a row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <p className="text-xs text-muted-foreground -mt-2">
              * At least one contact method (email or phone) is required
            </p>

            {/* Date of Birth and Gender in a row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Creating..." : "Add Patient & Start Encounter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
