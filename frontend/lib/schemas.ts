import { z } from "zod";

export const DoctorRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must be at most 100 characters"),
  email: z.string().email("Invalid email address"),
  medicalRegistrationId: z.string().min(5, "Medical registration ID must be at least 5 characters").max(50, "Medical registration ID must be at most 50 characters"),
  specialty: z.string().min(2, "Specialty must be at least 2 characters").max(100, "Specialty must be at most 100 characters"),
  password: z.string().min(6, "Password must be at least 6 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").optional().or(z.literal('')),
});

export const DoctorLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const AdminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const PatientRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]),
  bloodType: z.string().optional(),
  allergies: z.string().optional(), // Comma separated string for input
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
});

export const EncounterFormSchema = z.object({
  chiefComplaint: z.string().min(1, "Chief complaint is required"),
  diagnosis: z.array(z.object({
    id: z.string(),
    name: z.string()
  })).optional(),
  medications: z.array(z.object({
    name: z.string().min(1, "Drug name is required"),
    dosage: z.string().min(1, "Dosage is required"),
    frequency: z.string().min(1, "Frequency is required"),
    duration: z.string().optional(),
    instructions: z.string().optional(),
  })).optional(),
  notes: z.string().optional(),
});

export const AppointmentBookingSchema = z.object({
  hospitalId: z.string().min(1, "Hospital is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  date: z.date(),
  timeSlot: z.string().min(1, "Time slot is required"),
  reason: z.string().optional(),
});
