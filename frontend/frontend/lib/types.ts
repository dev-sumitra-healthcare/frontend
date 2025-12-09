export type FormFieldName = "fullName" | "email" | "medicalRegistrationId" | "specialty" | "password";

export interface BackendErrorResponse {
  success: boolean;
  message: string;
  errors?: Array<{
    field: FormFieldName;
    message: string;
  }>;
}

export interface Doctor {
  _id: string;
  id?: string;
  fullName?: string;
  full_name?: string;
  email: string;
  specialty: string;
  accountStatus?: "pending_verification" | "active" | "suspended";
  account_status?: "pending_verification" | "active" | "suspended";
  medicalRegistrationId?: string;
  medical_registration_id?: string;
  phoneNumber?: string;
  phone_number?: string;
  experience?: number;
  isVerified?: boolean;
  is_verified?: boolean;
  verificationDate?: string;
  verification_date?: string;
  lastLogin?: string;
  last_login?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface Coordinator {
  id: string;
  fullName?: string;
  full_name?: string;
  email: string;
  phoneNumber?: string;
  phone_number?: string;
  hospitalId?: string;
  hospital_id?: string;
  accountStatus?: "pending_verification" | "active" | "suspended";
  account_status?: "pending_verification" | "active" | "suspended";
  verificationDate?: string;
  verification_date?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface Admin {
  _id: string;
  fullName: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
  permissions: {
    canManageDoctors: boolean;
    canManagePatients: boolean;
    canManageSystem: boolean;
    canViewAnalytics: boolean;
    canManageSettings: boolean;
  };
  accountStatus: "active" | "suspended" | "inactive";
  lastLogin?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  isSuperAdmin: boolean;
  accountAge?: number;
  createdAt: string;
  updatedAt: string;
}
