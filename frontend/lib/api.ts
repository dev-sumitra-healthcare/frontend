import axios, { AxiosResponse, AxiosError } from "axios";
import type { Coordinator } from "./types";

// Interfaces for Doctor API
export interface DoctorRegistrationRequest {
  fullName: string;
  email: string;
  medicalRegistrationId: string;
  specialty: string;
  hospitalId: string;
  password: string;
}

export interface DoctorRegistrationResponse {
  success: boolean;
  message: string;
  data: {
    doctor: {
      _id: string;
      fullName: string;
      email: string;
      medicalRegistrationId: string;
      specialty: string;
      roles: string[];
      accountStatus: "pending_verification" | "active" | "suspended";
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface DoctorLoginRequest {
  email: string;
  password: string;
}

export interface DoctorLoginResponse {
  success: boolean;
  message: string;
  data: {
    doctor: {
      _id: string;
      fullName: string;
      email: string;
      medicalRegistrationId: string;
      specialty: string;
      roles: string[];
      accountStatus: "pending_verification" | "active" | "suspended";
      lastLogin: string;
    };
    accessToken: string;
  };
}

export interface DoctorProfileResponse {
  success: boolean;
  data: {
    doctor: {
      _id: string;
      fullName: string;
      email: string;
      medicalRegistrationId: string;
      specialty: string;
      roles: string[];
      accountStatus: "pending_verification" | "active" | "suspended";
      phoneNumber?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
      };
      qualifications?: Array<{ degree: string; institution: string; year: number }>;
      experience?: number;
      isVerified?: boolean;
      verificationDate?: string;
      lastLogin?: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface UpdateDoctorProfileRequest {
  fullName?: string;
  specialty?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  qualifications?: Array<{ degree: string; institution: string; year: number }>;
  experience?: number;
}

export interface UpdateDoctorProfileResponse {
  success: boolean;
  message: string;
  data: {
    doctor: DoctorProfileResponse["data"]["doctor"]; // Re-use the doctor type
  };
}

// Interfaces for Admin API
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data: {
    admin: {
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
    };
    accessToken: string;
  };
}

export interface AdminRegistrationRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AdminRegistrationResponse {
  success: boolean;
  message: string;
  data: {
    admin: AdminLoginResponse["data"]["admin"];
    accessToken: string;
  };
}

export interface AdminProfileResponse {
  success: boolean;
  data: {
    admin: AdminLoginResponse["data"]["admin"];
  };
}

export interface UpdateAdminProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface AdminDashboardStatsResponse {
  success: boolean;
  data: {
    doctors: number;
    admins: number;
    coordinators: number;
  };
}

export interface GetDoctorsResponse {
  success: boolean;
  data: {
    doctors: Array<{
      _id: string;
      fullName: string;
      email: string;
      medicalRegistrationId: string;
      specialty: string;
      accountStatus: "pending_verification" | "active" | "suspended";
      phoneNumber?: string;
      experience?: number;
      isVerified?: boolean;
      verificationDate?: string;
      lastLogin?: string;
      createdAt: string;
      updatedAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface VerifySuspendDoctorResponse {
  success: boolean;
  message: string;
  data: {
    doctor: {
      _id: string;
      fullName: string;
      email: string;
      medicalRegistrationId: string;
      specialty: string;
      accountStatus: "pending_verification" | "active" | "suspended";
    };
  };
}

// Interfaces for Dashboard API
export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  patientUhid: string;
  type: string;
  status: string;
}

// Backend appointment structure from Postman collection
export interface BackendAppointment {
  appointmentId: string;
  scheduledTime: string;
  patient: {
    id: string;
    name?: string;
  };
  appointmentType: string;
  status: string;
}

export interface AppointmentsResponse {
  status: string;
  data: Appointment[];
}

export interface BackendAppointmentsResponse {
  status: string;
  data: BackendAppointment[];
}

export interface ActionItemsSummaryResponse {
  status: string;
  data: {
    newResults: number;
    consultationRequests: number;
    unreadMessages: number;
  };
}

// Backend action items structure from Postman collection
export interface BackendActionItemsResponse {
  status: string;
  data: {
    newResultsToReview: number;
    pendingConsultationRequests: number;
    unreadPatientMessages: number;
  };
}

export interface PerformanceStatsResponse {
  status: string;
  data: {
    patientsSeen: number;
    patientsScheduled: number;
    avgConsultTimeMinutes: number;
    pendingDocumentation: number;
  };
}

// Backend performance stats structure from Postman collection
export interface BackendPerformanceStatsResponse {
  status: string;
  data: {
    patientsSeen: number;
    patientsScheduled: number;
    averageConsultTimeMinutes: number;
    pendingDocumentationCount: number;
  };
}

// Interfaces for Workbench API
export interface WorkbenchSummaryResponse {
  success: boolean;
  data: {
    // Define workbench summary structure based on backend implementation
    summary: any; // TODO: Define proper interface once backend implementation is clear
  };
}

export interface DoctorStatsResponse {
  success: boolean;
  data: {
    // Define stats structure based on backend implementation
    stats: any; // TODO: Define proper interface once backend implementation is clear
  };
}

// Interfaces for Encounter API
export interface EncounterDataResponse {
  success: boolean;
  message?: string;
  data: {
    bundle: {
      encounter: {
        id: string;
        status: string;
        appointmentId: string;
      };
      patient: {
        id: string;
        name: string;
        uhid: string;
        demographics: {
          age: number;
          gender: string;
          allergies?: string[];
        };
      };
      medicalHistory: Array<{
        id: string;
        date: string;
        type: string;
        title: string;
        details: string;
      }>;
      aiAnalysis: {
        summary: string;
        recommendations: string[];
        confidence: number;
        processingTimeMs: number;
      };
      encounterForm: {
        chiefComplaint?: string;
        diagnosis?: Array<{ id: string; name: string }>;
        medications?: Array<{ name: string; dosage: string; frequency: string }>;
      };
    };
  };
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for refresh token cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side (not during SSR)
    if (typeof window !== 'undefined') {
      const isCoordinatorEndpoint = config.url?.startsWith('/coordinator/') || config.url === '/coordinator';
      const isAdminEndpoint = config.url?.startsWith('/admin/') || config.url === '/admin';
      
      // Patient self-service endpoints (use patientAccessToken):
      // - /patients/me/* - patient profile
      // - /patients/appointments - booking appointments
      // - /patients/specialties - listing specialties
      // - /patients/doctors/* - searching doctors, availability
      // 
      // Doctor endpoints accessing patient data (use accessToken):
      // - /patients/global/* - global patient search
      // - /patients/:uuid - doctor viewing specific patient (UUID format)
      const isPatientSelfEndpoint = config.url?.startsWith('/patients/me') ||
                                     config.url?.startsWith('/patients/appointments') ||
                                     config.url?.startsWith('/patients/specialties') ||
                                     config.url?.startsWith('/patients/doctors');
      
      // Doctor accessing patient data (global search or specific patient by UUID)
      const isDoctorPatientEndpoint = config.url?.startsWith('/patients/global');
      
      let token: string | null = null;
      if (isCoordinatorEndpoint) {
        token = localStorage.getItem("coordinatorAccessToken");
      } else if (isAdminEndpoint) {
        token = localStorage.getItem("adminAccessToken");
      } else if (isPatientSelfEndpoint && !isDoctorPatientEndpoint) {
        // Patient self-service endpoints use patient token
        token = localStorage.getItem("patientAccessToken");
      } else {
        // All other endpoints (including /patients/global/* and /patients/:id) use doctor token
        token = localStorage.getItem("accessToken");
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry login endpoints
      if (originalRequest.url?.includes('/login')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const isCoordinatorEndpoint = originalRequest.url?.startsWith('/coordinator/') || originalRequest.url === '/coordinator';
        const isAdminEndpoint = originalRequest.url?.startsWith('/admin/') || originalRequest.url === '/admin';
        // Patient self-service endpoints (same logic as request interceptor)
        const isPatientSelfEndpoint = originalRequest.url?.startsWith('/patients/me') ||
                                       originalRequest.url?.startsWith('/patients/appointments') ||
                                       originalRequest.url?.startsWith('/patients/specialties') ||
                                       originalRequest.url?.startsWith('/patients/doctors');
        const isDoctorPatientEndpoint = originalRequest.url?.startsWith('/patients/global');
        const isPatientEndpoint = isPatientSelfEndpoint && !isDoctorPatientEndpoint;
        
        let refreshEndpoint = '/refresh-token'; // default doctor
        if (isCoordinatorEndpoint) {
          refreshEndpoint = '/auth/coordinator/refresh-token';
        } else if (isAdminEndpoint) {
          refreshEndpoint = '/admin/refresh-token';
        } else if (isPatientEndpoint) {
          refreshEndpoint = '/auth/refresh-token'; // patient uses common auth refresh
        }
        
        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${API_BASE_URL}${refreshEndpoint}`,
          {},
          { withCredentials: true }
        );
        
        const newToken = refreshResponse.data?.data?.accessToken || refreshResponse.data?.accessToken;
        
        // Update the appropriate token in localStorage (client-side only)
        if (typeof window !== 'undefined') {
          if (isCoordinatorEndpoint) {
            localStorage.setItem("coordinatorAccessToken", newToken);
          } else if (isAdminEndpoint) {
            localStorage.setItem("adminAccessToken", newToken);
          } else if (isPatientEndpoint) {
            localStorage.setItem("patientAccessToken", newToken);
          } else {
            localStorage.setItem("accessToken", newToken);
          }
        }
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to appropriate login page (client-side only)
        if (typeof window !== 'undefined') {
          const isCoordinatorEndpoint = originalRequest.url?.startsWith('/coordinator/') || originalRequest.url === '/coordinator';
          const isAdminEndpoint = originalRequest.url?.startsWith('/admin/') || originalRequest.url === '/admin';
          // Patient self-service endpoints (same logic as above)
          const isPatientSelfEndpoint = originalRequest.url?.startsWith('/patients/me') ||
                                         originalRequest.url?.startsWith('/patients/appointments') ||
                                         originalRequest.url?.startsWith('/patients/specialties') ||
                                         originalRequest.url?.startsWith('/patients/doctors');
          const isDoctorPatientEndpoint = originalRequest.url?.startsWith('/patients/global');
          const isPatientEndpoint = isPatientSelfEndpoint && !isDoctorPatientEndpoint;

          // Clear all auth tokens
          localStorage.removeItem("accessToken");
          localStorage.removeItem("adminAccessToken");
          localStorage.removeItem("coordinatorAccessToken");
          localStorage.removeItem("patientAccessToken");
          localStorage.removeItem("user");
          localStorage.removeItem("admin");
          localStorage.removeItem("coordinatorData");
          localStorage.removeItem("patientUser");

          if (isCoordinatorEndpoint) {
            window.location.href = "/coordinator/login";
          } else if (isAdminEndpoint) {
            window.location.href = "/admin/login";
          } else if (isPatientEndpoint) {
            window.location.href = "/patient/login";
          } else {
            // Fallback: Check current window location to determine where to redirect
            const currentPath = window.location.pathname;
            
            if (currentPath.startsWith('/patient')) {
              window.location.href = "/patient/login";
            } else if (currentPath.startsWith('/coordinator')) {
              window.location.href = "/coordinator/login";
            } else if (currentPath.startsWith('/admin')) {
              window.location.href = "/admin/login";
            } else {
              // Default to doctor login only if we are in doctor area or unknown
              window.location.href = "/doctor/login";
            }
          }
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// --- API Functions for Doctors --- 

// 1. Doctor Registration
export const registerDoctor = async (data: DoctorRegistrationRequest): Promise<AxiosResponse<DoctorRegistrationResponse>> => {
  return apiClient.post("/register", data);
};

// 2. Doctor Login
export const loginDoctor = async (data: DoctorLoginRequest): Promise<AxiosResponse<DoctorLoginResponse>> => {
  return apiClient.post("/login", data);
};

// 3. Refresh Token for Doctors
export const refreshToken = async () => {
  return apiClient.post("/refresh-token");
};

// 4. Doctor Logout
export const logoutDoctor = async () => {
  return apiClient.post("/logout");
};

// 5. Get Doctor Profile
export const getDoctorProfile = async (): Promise<AxiosResponse<DoctorProfileResponse>> => {
  return apiClient.get("/profile");
};

// 6. Update Doctor Profile
export const updateDoctorProfile = async (data: UpdateDoctorProfileRequest): Promise<AxiosResponse<UpdateDoctorProfileResponse>> => {
  return apiClient.put("/profile", data);
};

// 7. Update Doctor UI Preferences (Configure Pad)
export interface DoctorUIPreferences {
  vitalsOrder?: string[];           // e.g., ["bp", "pulse", "temp", "weight"]
  defaultView?: 'compact' | 'detailed' | 'minimal';
  encounterFormOrder?: string[];    // e.g., ["vitals", "diagnosis", "medications", "notes"]
}

export interface UpdatePreferencesResponse {
  success: boolean;
  message: string;
  data: {
    preferences: DoctorUIPreferences;
  };
}

export const updateDoctorPreferences = async (preferences: DoctorUIPreferences): Promise<AxiosResponse<UpdatePreferencesResponse>> => {
  return apiClient.put("/doctors/me/preferences", preferences);
};

// --- Coordinator Triage API Functions ---

export interface TriageVitals {
  bp?: string;        // Blood pressure e.g., "120/80"
  pulse?: number;     // Heart rate
  temp?: number;      // Temperature in F
  weight?: number;    // Weight in kg
  height?: number;    // Height in cm
  spo2?: number;      // SpO2 percentage
}

export interface TriagePayment {
  amount: number | string;  // Can be number or decimal string like "150.00"
  method: 'Cash' | 'UPI' | 'Card' | 'Insurance';
  status: 'pending' | 'paid' | 'failed';
  transactionId?: string;
}

export interface CreateTriageRequest {
  vitals?: TriageVitals;
  payment?: TriagePayment;
}

export interface CreateTriageResponse {
  success: boolean;
  message: string;
  data: {
    encounterId: string;
    encounterStatus: string;
    paymentId?: string;
    paymentStatus?: string;
  };
}

export const createTriageEncounter = async (
  appointmentId: string, 
  data: CreateTriageRequest
): Promise<AxiosResponse<CreateTriageResponse>> => {
  return apiClient.post(`/coordinator/appointments/encounters/${appointmentId}/triage`, data);
};

// --- Doctor Coordinator Management API Functions ---

export interface DoctorCoordinator {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface GetDoctorCoordinatorsResponse {
  success: boolean;
  data: {
    coordinators: DoctorCoordinator[];
  };
}

export interface CreateDoctorCoordinatorRequest {
  fullName: string;
  email: string;
  phoneNumber?: string;
}

export interface CreateDoctorCoordinatorResponse {
  success: boolean;
  message: string;
  data: {
    coordinator: DoctorCoordinator;
    tempPassword: string;
  };
}

export interface ToggleDoctorCoordinatorAccessResponse {
  success: boolean;
  message: string;
  data: {
    coordinator: DoctorCoordinator;
  };
}

export const getDoctorCoordinators = async (): Promise<AxiosResponse<GetDoctorCoordinatorsResponse>> => {
  return apiClient.get("/doctors/coordinators");
};

export const createDoctorCoordinator = async (data: CreateDoctorCoordinatorRequest): Promise<AxiosResponse<CreateDoctorCoordinatorResponse>> => {
  return apiClient.post("/doctors/coordinators", data);
};

export const toggleDoctorCoordinatorAccess = async (id: string, isActive: boolean): Promise<AxiosResponse<ToggleDoctorCoordinatorAccessResponse>> => {
  return apiClient.put(`/doctors/coordinators/${id}/access`, { isActive });
};

export const deleteDoctorCoordinator = async (id: string): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
  return apiClient.delete(`/doctors/coordinators/${id}`);
};

// --- Doctor Dashboard API Functions ---

export interface DashboardQueueItem {
  appointmentId: string;
  scheduledTime: string;
  appointmentType: string;
  status: string;
  triageStatus: 'scheduled' | 'waiting' | 'ready' | 'in-progress' | 'completed';
  patient: {
    id: string | null;
    fullName: string;
    uhid: string | null;
    mid: string | null;
    age?: number | null;
    gender?: string | null;
  };
  vitals: Record<string, unknown> | null;
  triageRecordedAt: string | null;
  paymentStatus?: 'pending' | 'paid' | 'completed' | 'failed' | null;
  paymentAmount?: number | null;
  encounterStatus?: string | null;
  encounterId?: string | null;
}

export interface DashboardActionItems {
  pendingDocumentation: number;
  pendingLabResults: number;
  waitingPatients: number;
}

export interface DashboardPerformanceStats {
  patientsSeen: number;
  patientsScheduled: number;
  avgConsultTime: number;
}

export interface DoctorDashboardResponse {
  status: string;
  data: {
    todaysQueue: DashboardQueueItem[];
    actionItems: DashboardActionItems;
    performanceStats: DashboardPerformanceStats;
  };
}

// Get complete doctor dashboard data
export const getDoctorDashboard = async (): Promise<AxiosResponse<DoctorDashboardResponse>> => {
  return apiClient.get("/doctors/me/dashboard");
};

// Get today's appointment queue (or for specific date)
export const getTodaysQueue = async (date?: string): Promise<AxiosResponse<{ status: string; data: DashboardQueueItem[] }>> => {
  const params = date ? { date } : {};
  return apiClient.get("/doctors/me/queue", { params });
};

// Get action items for doctor
export const getDoctorActionItems = async (): Promise<AxiosResponse<{ status: string; data: DashboardActionItems }>> => {
  return apiClient.get("/doctors/me/action-items");
};

// Get doctor performance stats
export const getDoctorStats = async (): Promise<AxiosResponse<{ status: string; data: DashboardPerformanceStats }>> => {
  return apiClient.get("/doctors/me/stats");
};

// --- API Functions for Admin ---


// 7. Admin Registration
export const registerAdmin = async (data: AdminRegistrationRequest): Promise<AxiosResponse<AdminRegistrationResponse>> => {
  return apiClient.post("/admin/register", data);
};

// 7. Admin Login
export const loginAdmin = async (data: AdminLoginRequest): Promise<AxiosResponse<AdminLoginResponse>> => {
  return apiClient.post("/admin/login", data);
};

// 8. Get Admin Profile
export const getAdminProfile = async (): Promise<AxiosResponse<AdminProfileResponse>> => {
  return apiClient.get("/admin/profile");
};

// 9. Update Admin Profile
export const updateAdminProfile = async (data: UpdateAdminProfileRequest): Promise<AxiosResponse<AdminProfileResponse>> => {
  return apiClient.put("/admin/profile", data);
};

// 10. Admin Refresh Token
export const refreshAdminToken = async () => {
  return apiClient.post("/admin/refresh-token");
};

// 11. Admin Logout
export const logoutAdmin = async () => {
  return apiClient.post("/admin/logout");
};

// 12. Admin Dashboard Stats
export const getAdminDashboardStats = async (): Promise<AxiosResponse<AdminDashboardStatsResponse>> => {
  return apiClient.get("/admin/dashboard/stats");
};

// 8. List Doctors
export const getDoctors = async (params?: { status?: string; page?: number; limit?: number }): Promise<AxiosResponse<GetDoctorsResponse>> => {
  return apiClient.get("/admin/doctors", { params });
};

// 9. Verify Doctor Account
export const verifyDoctorAccount = async (doctorId: string): Promise<AxiosResponse<VerifySuspendDoctorResponse>> => {
  return apiClient.post(`/admin/doctors/${doctorId}/verify`);
};

// 10. Suspend Doctor Account
export const suspendDoctorAccount = async (doctorId: string): Promise<AxiosResponse<VerifySuspendDoctorResponse>> => {
  return apiClient.post(`/admin/doctors/${doctorId}/suspend`);
};

// --- API Functions for Workbench ---

// 11. Get Workbench Summary
export const getWorkbenchSummary = async (): Promise<AxiosResponse<WorkbenchSummaryResponse>> => {
  return apiClient.get("/workbench/summary");
};

// 12. Get Doctor Stats - DEPRECATED: Use getDoctorStats from Dashboard API section instead

// --- API Functions for Dashboard ---
// Note: These endpoints may need to be implemented in the backend
// Fallback to mock data if endpoints don't exist yet

// 11. Get Today's Appointments
export const getTodaysAppointments = async (): Promise<AxiosResponse<AppointmentsResponse>> => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  
  const response = await apiClient.get<BackendAppointmentsResponse>(`/appointments?date=${dateString}`);
  
  // Transform backend data to frontend format
  const transformedData: Appointment[] = response.data.data.map(appointment => ({
    id: appointment.appointmentId,
    time: appointment.scheduledTime,
    patientName: appointment.patient.name || 'Unknown Patient',
    patientUhid: appointment.patient.id,
    type: appointment.appointmentType,
    status: appointment.status
  }));
  
  return {
    ...response,
    data: {
      status: response.data.status,
      data: transformedData
    }
  };
};

// 12. Get Action Items Summary
export const getActionItemsSummary = async (): Promise<AxiosResponse<ActionItemsSummaryResponse>> => {
  const response = await apiClient.get<BackendActionItemsResponse>("/workbench/summary");
  
  // Transform backend data to frontend format
  const transformedData = {
    newResults: response.data.data.newResultsToReview,
    consultationRequests: response.data.data.pendingConsultationRequests,
    unreadMessages: response.data.data.unreadPatientMessages
  };
  
  return {
    ...response,
    data: {
      status: response.data.status,
      data: transformedData
    }
  };
};

// 13. Get Performance Stats
export const getPerformanceStats = async (): Promise<AxiosResponse<PerformanceStatsResponse>> => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  
  const response = await apiClient.get<BackendPerformanceStatsResponse>(`/practitioners/me/stats?date=${dateString}`);
  
  // Transform backend data to frontend format
  const transformedData = {
    patientsSeen: response.data.data.patientsSeen,
    patientsScheduled: response.data.data.patientsScheduled,
    avgConsultTimeMinutes: response.data.data.averageConsultTimeMinutes,
    pendingDocumentation: response.data.data.pendingDocumentationCount
  };
  
  return {
    ...response,
    data: {
      status: response.data.status,
      data: transformedData
    }
  };
};

// --- API Functions for Encounter ---
// Note: These endpoints may need to be implemented in the backend

// Search encounters (Past Cases)
export interface SearchEncountersParams {
  diagnosis?: string;
  symptoms?: string;
  patientName?: string;
  patientId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface EncounterSearchResult {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  status: string;
  diagnosis: Array<{ code?: string; description: string; confidence?: string }> | null;
  chiefComplaint: string | null;
  symptoms: string[] | null;
  vitalSigns: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface SearchEncountersResponse {
  success: boolean;
  message: string;
  data: {
    encounters: EncounterSearchResult[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const searchEncounters = async (params?: SearchEncountersParams): Promise<AxiosResponse<SearchEncountersResponse>> => {
  return apiClient.get("/encounters/search", { params });
};

// 14. Get Encounter Details (Create encounter bundle with AI analysis)
export const getEncounterDetails = async (appointmentId: string): Promise<AxiosResponse<EncounterDataResponse>> => {
  return apiClient.get(`/encounters/${appointmentId}/bundle`);
};

// 15. Finalize Encounter with Form Data
export interface FinalizeEncounterRequest {
  appointmentId?: string; // optional but recommended for reliable linkage
  chiefComplaint: string;
  presentingSymptoms: string[];
  diagnosis: Array<{
    code: string;
    description: string;
    confidence: string;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    respiratoryRate: string;
    oxygenSaturation: string;
  };
  doctorRemarks: string;
  followUpInstructions: string;
}

export interface FinalizeEncounterResponse {
  success: boolean;
  data: {
    encounter: {
      id: string;
      status: string;
    };
    appointment: {
      id: string;
      status: string;
    };
    nextSteps: string[];
  };
}

export const finalizeEncounter = async (
  encounterId: string, 
  data: FinalizeEncounterRequest
): Promise<AxiosResponse<FinalizeEncounterResponse>> => {
  return apiClient.post(`/encounters/${encounterId}/finalize`, data);
};

// --- Patient API Functions ---
export interface CreatePatientRequest {
  fullName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  bloodType?: string;
  allergies?: string[];
  address?: { street?: string; city?: string; state?: string; zipCode?: string; country?: string };
  emergencyContact?: { name?: string; phone?: string; relationship?: string };
  insurance?: { provider?: string; policyNumber?: string; groupNumber?: string };
  uhid?: string;
}

export interface PatientListResponse {
  success: boolean;
  message: string;
  data: { results: any[]; total: number; page: number; limit: number };
}

export interface CreatePatientResponse {
  success: boolean;
  message: string;
  data: { patient: any };
}

export const createPatient = async (data: CreatePatientRequest) => {
  return apiClient.post(`/patients`, data);
};

export const getPatients = async (params?: {
  name?: string;
  uhid?: string;
  email?: string;
  phone?: string;
  page?: number;
  limit?: number;
  scope?: 'my' | 'all';  // 'my' = only my patients, 'all' = hospital-wide
}) => {
  return apiClient.get<PatientListResponse>(`/patients`, { params });
};

export const getPatientById = async (id: string) => {
  return apiClient.get(`/patients/${id}`);
};

export const updatePatient = async (id: string, updates: Partial<CreatePatientRequest>) => {
  return apiClient.put(`/patients/${id}`, updates);
};

export const searchPatients = async (q: string, page = 1, limit = 20) => {
  return apiClient.get(`/patients/search`, { params: { q, page, limit } });
};

// Global Patient Search (across MedMitra network)
export interface GlobalPatientResult {
  id: string;
  mid: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  gender: string | null;
  age: number | null;
  date_of_birth: string | null;
  isLocal: boolean;
  status: 'local' | 'network';
  statusLabel: string;
}

export interface GlobalSearchResponse {
  success: boolean;
  message: string;
  data: {
    results: GlobalPatientResult[];
    total: number;
    page: number;
    limit: number;
  };
}

export const searchGlobalPatients = async (q: string, page = 1, limit = 20): Promise<AxiosResponse<GlobalSearchResponse>> => {
  return apiClient.get('/patients/global/search', { params: { q, page, limit } });
};

export interface EnrollPatientResponse {
  success: boolean;
  message: string;
  data: {
    patientId: string;
    uhid?: string;
    alreadyEnrolled: boolean;
  };
}

export const enrollGlobalPatient = async (globalPatientId: string): Promise<AxiosResponse<EnrollPatientResponse>> => {
  return apiClient.post(`/patients/global/${globalPatientId}/enroll`);
};

export const registerExistingPatient = async (patientId: string) => {
  return apiClient.post(`/patients/${patientId}/enroll`);
};

// --- Patient Portal (Self) API Functions ---
export interface PatientUpcomingAppointment {
  appointmentId: string;
  scheduledTime: string; // ISO timestamp
  appointmentType?: string | null;
  practitioner: {
    fullName: string | null;
    specialty: string | null;
  };
}

export interface PatientUpcomingAppointmentsResponse {
  status: 'success' | 'error';
  data: PatientUpcomingAppointment[];
}

export interface PatientActivityItem {
  activityId: string;
  date: string; // YYYY-MM-DD
  type: string; // 'Consultation Complete' | 'Lab Results Ready' | etc
  summary: string;
  link: string;
}

export interface PatientActivityResponse {
  status: 'success' | 'error';
  data: PatientActivityItem[];
}

export const getMyUpcomingAppointments = async (params?: { status?: string }) => {
  return apiClient.get<PatientUpcomingAppointmentsResponse>(`/patients/me/appointments`, { params });
};

// --- Universal ID System API Functions ---

export interface GlobalPatient {
  id: string;
  mid: string;
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
}

export interface GlobalPatientRegistrationRequest {
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  hospitalId: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
}

export interface GlobalPatientSearchResponse {
  success: boolean;
  data: {
    results: GlobalPatient[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface EnrollPatientRequest {
  hospitalId: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
}

export interface UnifiedEncounter {
  id: string;
  encounter_date: string;
  chief_complaint: string;
  diagnosis: any[];
  treatment_plan: string;
  source: 'current' | 'external';
  hospital_name: string;
  city?: string;
  doctor_name: string;
  doctor_specialty?: string;
}

export interface UnifiedHistoryResponse {
  success: boolean;
  data: {
    encounters: UnifiedEncounter[];
    total: number;
    globalPatientId: string;
    requestingHospitalId: string;
  };
}

// 1. Register New Global Patient
export const registerGlobalPatient = async (data: GlobalPatientRegistrationRequest) => {
  return apiClient.post('/patients/global', data);
};

// 2. Search Global Patients - See newer implementation above (searchGlobalPatients)
// DEPRECATED: Use searchGlobalPatients from the Global Patient Search section

// 3. Get Global Patient by MID
export const getGlobalPatientByMid = async (mid: string) => {
  return apiClient.get<{ success: boolean; data: GlobalPatient }>(`/patients/global/${mid}`);
};

// 4. Enroll Patient at Hospital - See newer implementation above (enrollGlobalPatient)
// DEPRECATED: Use enrollGlobalPatient from the Global Patient Search section

// 5. Get Patient Network Status
export const getPatientNetworkStatus = async (mid: string) => {
  return apiClient.get(`/patients/global/${mid}/network`);
};

// 6. Get Unified Medical History
export const getUnifiedPatientHistory = async (globalPatientId: string, hospitalId: string) => {
  return apiClient.get<UnifiedHistoryResponse>(`/encounters/history/${globalPatientId}`, {
    params: { hospitalId }
  });
};

// 7. Download Prescription PDF
export const downloadPrescriptionPDF = async (prescriptionId: string) => {
  const response = await apiClient.get(`/prescriptions/${prescriptionId}/download`, {
    responseType: 'blob'
  });
  
  // Create a blob link to download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `prescription-${prescriptionId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// 8. View Prescription PDF (Inline)
export const viewPrescriptionPDF = (prescriptionId: string) => {
  return `${API_BASE_URL}/prescriptions/${prescriptionId}/view`;
};



export interface PatientProfile {
  id: string;
  fullName: string;
  uhid: string;
  mid?: string; // MedMitra ID - universal patient identifier
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  allergies?: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relation?: string;
  };
  insurance?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
  };
}

export interface PatientProfileResponse {
  status: 'success' | 'error';
  data: PatientProfile;
}

export const getMyProfile = async () => {
  return apiClient.get<PatientProfileResponse>(`/patients/me/profile`);
};

export interface PatientAppointment {
  appointmentId: string;
  scheduledTime: string;
  appointmentType: string;
  status: string;
  notes?: string;
  isPast: boolean;
  practitioner: {
    fullName: string;
    specialty: string | null;
  };
}

export interface PatientAppointmentsResponse {
  status: 'success' | 'error';
  data: PatientAppointment[];
}

export const getAllMyAppointments = async () => {
  return apiClient.get<PatientAppointmentsResponse>(`/patients/me/appointments/all`);
};

export interface PatientPrescription {
  prescriptionId: string;
  encounterId: string;
  date: string;
  encounterDate?: string;
  chiefComplaint?: string;
  doctor: {
    fullName: string;
    specialty: string | null;
  };
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  advice?: string | null;
  tests?: Array<{
    name: string;
    instructions?: string;
  }>;
  followUp?: string | null;
}

export interface PatientPrescriptionsResponse {
  status: 'success' | 'error';
  data: PatientPrescription[];
}

export const getMyPrescriptions = async () => {
  return apiClient.get<PatientPrescriptionsResponse>(`/patients/me/prescriptions`);
};

// --- Appointment API Functions ---
export interface CreateAppointmentRequest {
  patientId: string;
  scheduledTime: string; // ISO format
  appointmentType?: string;
}

export const createAppointment = async (data: CreateAppointmentRequest) => {
  return apiClient.post(`/appointments`, data);
};

// --- Patient Auth (Self) ---
export const patientLogin = async (data: { username: string; password: string; }) => {
  // Uses common auth controller
  return apiClient.post(`/auth/login`, data);
};

export const patientRegister = async (data: { username: string; email: string; phone: string; password: string; }) => {
  return apiClient.post(`/auth/register`, { ...data, role: 'patient' });
};

// --- OAuth Functions ---

// Google OAuth: Get OAuth URL
export interface GoogleOAuthUrlResponse {
  url: string;
}

export const getGoogleOAuthUrl = async (): Promise<AxiosResponse<GoogleOAuthUrlResponse>> => {
  return apiClient.get("/auth/google");
};

// Get current session (for OAuth users)
export interface SessionResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export const getSession = async (): Promise<AxiosResponse<SessionResponse>> => {
  return apiClient.get("/auth/session");
};

// Logout (works for both traditional and OAuth)
export const logout = async (): Promise<AxiosResponse<{ message: string }>> => {
  return apiClient.post("/auth/logout");
};

// Complete OAuth registration for doctors
export interface CompleteOAuthRegistrationRequest {
  email: string;
  oauthToken: string;
  fullName: string;
  medicalRegistrationId: string;
  specialty: string;
}

export interface CompleteOAuthRegistrationResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  accessToken: string;
}

export const completeOAuthRegistration = async (
  data: CompleteOAuthRegistrationRequest
): Promise<AxiosResponse<CompleteOAuthRegistrationResponse>> => {
  return apiClient.post("/auth/oauth/complete-registration", data);
};

// --- Prescription Template API Functions ---
export interface PrescriptionTemplate {
  id: string;
  name: string;
  doctor_id: string;
  header?: string;
  footer?: string;
  elements: {
    sections?: Array<{
      type: 'medications' | 'advice' | 'tests' | 'custom';
      title: string;
      content?: string;
    }>;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateRequest {
  name: string;
  header?: string;
  footer?: string;
  elements: {
    sections?: Array<{
      type: 'medications' | 'advice' | 'tests' | 'custom';
      title: string;
      content?: string;
    }>;
  };
}

export interface TemplateListResponse {
  success: boolean;
  message: string;
  data: {
    results: PrescriptionTemplate[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TemplateResponse {
  success: boolean;
  message: string;
  data: {
    template: PrescriptionTemplate;
  };
}

// Create a new prescription template
export const createTemplate = async (data: CreateTemplateRequest): Promise<AxiosResponse<TemplateResponse>> => {
  return apiClient.post('/prescription-templates', data);
};

// Get all templates for the logged-in doctor
export const getTemplates = async (params?: { page?: number; limit?: number }): Promise<AxiosResponse<TemplateListResponse>> => {
  return apiClient.get('/prescription-templates', { params });
};

// Get a single template by ID
export const getTemplateById = async (id: string): Promise<AxiosResponse<TemplateResponse>> => {
  return apiClient.get(`/prescription-templates/${id}`);
};

// Update a template
export const updateTemplate = async (id: string, data: Partial<CreateTemplateRequest>): Promise<AxiosResponse<TemplateResponse>> => {
  return apiClient.put(`/prescription-templates/${id}`, data);
};

// Delete a template
export const deleteTemplate = async (id: string): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
  return apiClient.delete(`/prescription-templates/${id}`);
};

// --- Prescription API Functions ---
export interface Prescription {
  id: string;
  encounter_id: string;
  patient_id: string;
  doctor_id: string;
  template_id?: string;
  content: {
    medications?: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }>;
    advice?: string;
    tests?: Array<{
      name: string;
      instructions?: string;
    }>;
    followUp?: string;
    notes?: string;
  };
  created_at: string;
  updated_at: string;
  // For detailed view with patient info
  patients?: {
    id: string;
    full_name: string;
    uhid: string;
    date_of_birth: string;
    gender: string;
  };
  encounters?: {
    id: string;
    encounter_date: string;
  };
}

export interface CreatePrescriptionRequest {
  encounterId: string;
  patientId: string;
  templateId?: string;
  content: {
    medications?: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }>;
    advice?: string;
    tests?: Array<{
      name: string;
      instructions?: string;
    }>;
    followUp?: string;
    notes?: string;
  };
}

export interface PrescriptionListResponse {
  success: boolean;
  message: string;
  data: {
    prescriptions?: Prescription[];
    results?: Prescription[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface PrescriptionResponse {
  success: boolean;
  message: string;
  data: {
    prescription: Prescription;
  };
}

// Create a new prescription
export const createPrescription = async (data: CreatePrescriptionRequest): Promise<AxiosResponse<PrescriptionResponse>> => {
  return apiClient.post('/prescriptions', data);
};

// Get all prescriptions for an encounter
export const getPrescriptionsByEncounter = async (encounterId: string): Promise<AxiosResponse<PrescriptionListResponse>> => {
  return apiClient.get(`/prescriptions/encounter/${encounterId}`);
};

// Get all prescriptions for a patient
export const getPrescriptionsByPatient = async (patientId: string, params?: { page?: number; limit?: number }): Promise<AxiosResponse<PrescriptionListResponse>> => {
  return apiClient.get(`/prescriptions/patient/${patientId}`, { params });
};

// Get a single prescription by ID
export const getPrescriptionById = async (id: string): Promise<AxiosResponse<PrescriptionResponse>> => {
  return apiClient.get(`/prescriptions/${id}`);
};

// Update a prescription
export const updatePrescription = async (id: string, data: Partial<CreatePrescriptionRequest>): Promise<AxiosResponse<PrescriptionResponse>> => {
  return apiClient.put(`/prescriptions/${id}`, data);
};

// ============================================
// Hospital API
// ============================================

export interface Hospital {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface HospitalsResponse {
  success: boolean;
  data: {
    hospitals: Hospital[];
  };
}

// Get all active hospitals (public - for registration)
export const getActiveHospitals = async (): Promise<AxiosResponse<HospitalsResponse>> => {
  return axios.get(`${API_BASE_URL}/hospitals/active`);
};

// ============================================
// Coordinator API (Admin)
// ============================================

export interface GetCoordinatorsResponse {
  success: boolean;
  data: {
    coordinators: Array<{
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
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages?: number;
      pages?: number;
    };
  };
}

export interface VerifySuspendCoordinatorResponse {
  success: boolean;
  message: string;
  data: {
    coordinator: {
      id: string;
      fullName?: string;
      full_name?: string;
      email: string;
      accountStatus?: "pending_verification" | "active" | "suspended";
      account_status?: "pending_verification" | "active" | "suspended";
    };
  };
}

// Get all coordinators (Admin)
export const getCoordinators = async (params?: { status?: string; hospitalId?: string; page?: number; limit?: number }): Promise<AxiosResponse<GetCoordinatorsResponse>> => {
  return apiClient.get("/admin/coordinators", { params });
};

// Verify coordinator account (Admin)
export const verifyCoordinatorAccount = async (coordinatorId: string): Promise<AxiosResponse<VerifySuspendCoordinatorResponse>> => {
  return apiClient.post(`/admin/coordinators/${coordinatorId}/verify`);
};

// Suspend coordinator account (Admin)
export const suspendCoordinatorAccount = async (coordinatorId: string): Promise<AxiosResponse<VerifySuspendCoordinatorResponse>> => {
  return apiClient.post(`/admin/coordinators/${coordinatorId}/suspend`);
};

// ============================================
// Coordinator Self-Service API
// ============================================

export interface CoordinatorRegistrationRequest {
  fullName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  hospitalId: string;
}

export interface CoordinatorLoginRequest {
  email: string;
  password: string;
}

export interface CoordinatorAuthResponse {
  success: boolean;
  message: string;
  data: {
    coordinator: Coordinator;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface CoordinatorProfileResponse {
  success: boolean;
  data: {
    coordinator: Coordinator;
  };
}

export interface CoordinatorPatientsResponse {
  success: boolean;
  data: {
    results: Array<{
      id: string;
      fullName: string;
      uhid: string;
      mid?: string;
      email?: string;
      phoneNumber?: string;
      dateOfBirth?: string;
      gender?: string;
      address?: string;
      city?: string;
      state?: string;
      bloodGroup?: string;
      hospital_id: string;
      created_by_coordinator_id?: string;
      createdAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
    scope: 'all';
  };
}

export interface CoordinatorCreatePatientRequest {
  fullName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface CoordinatorAppointment {
  appointmentId: string;
  scheduledTime: string;
  patient: {
    id: string;
    fullName: string;
    uhid: string;
    phoneNumber?: string;
  };
  doctor: {
    id: string;
    fullName: string;
    specialty?: string;
  };
  appointmentType: string;
  status: 'Waiting' | 'In-Consultation' | 'Documentation-Pending' | 'Completed' | 'Cancelled' | 'No-Show';
  createdAt: string;
  createdByCoordinatorId?: string;
}

export interface CoordinatorAppointmentsResponse {
  success: boolean;
  data: {
    appointments: CoordinatorAppointment[];
    date: string;
    hospitalId: string;
  };
}

export interface CoordinatorCreateAppointmentRequest {
  practitionerId: string;
  patientId: string;
  scheduledTime: string;
  appointmentType?: string;
  status?: string;
}

export interface CoordinatorDashboardStats {
  totalPatients: number;
  newPatientsThisMonth: number;
  totalDoctors: number;
  todayAppointments: number;
  todayCompleted: number;
  upcomingToday: number;
}

export interface CoordinatorDashboardOverview {
  hospitalId: string;
  patients: {
    total: number;
    newThisMonth: number;
  };
  appointments: {
    today: {
      total: number;
      byStatus: Record<string, number>;
    };
  };
  doctors: {
    total: number;
  };
  generatedAt: string;
}

export interface CoordinatorAppointmentTrend {
  date: string;
  total: number;
  completed: number;
  cancelled: number;
}

// Helper function to get coordinator auth headers
const getCoordinatorAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('coordinatorAccessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Register coordinator
export const registerCoordinator = async (data: CoordinatorRegistrationRequest): Promise<AxiosResponse<CoordinatorAuthResponse>> => {
  return apiClient.post('/auth/coordinator/register', data);
};

// Login coordinator
export const loginCoordinator = async (credentials: CoordinatorLoginRequest): Promise<AxiosResponse<CoordinatorAuthResponse>> => {
  const response = await apiClient.post<CoordinatorAuthResponse>('/auth/coordinator/login', credentials);

  // Store token in localStorage
  if (typeof window !== 'undefined' && response.data.success && response.data.data.tokens.accessToken) {
    localStorage.setItem('coordinatorAccessToken', response.data.data.tokens.accessToken);
    localStorage.setItem('coordinatorData', JSON.stringify(response.data.data.coordinator));
  }

  return response;
};

// Logout coordinator
export const logoutCoordinator = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/coordinator/logout', {}, { headers: getCoordinatorAuthHeaders() });
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('coordinatorAccessToken');
      localStorage.removeItem('coordinatorData');
    }
  }
};

// Get coordinator profile
export const getCoordinatorProfile = async (): Promise<AxiosResponse<CoordinatorProfileResponse>> => {
  return apiClient.get('/auth/coordinator/profile', { headers: getCoordinatorAuthHeaders() });
};

// Update coordinator profile
export const updateCoordinatorProfile = async (data: Partial<Coordinator>): Promise<AxiosResponse<CoordinatorProfileResponse>> => {
  return apiClient.put('/auth/coordinator/profile', data, { headers: getCoordinatorAuthHeaders() });
};

// ============================================
// Coordinator Patient Management
// ============================================

// Get all patients (hospital-wide)
export const getCoordinatorPatients = async (params?: {
  page?: number;
  limit?: number;
  name?: string;
  uhid?: string;
  phone?: string;
  email?: string;
}): Promise<AxiosResponse<CoordinatorPatientsResponse>> => {
  return apiClient.get('/coordinator/patients', { params, headers: getCoordinatorAuthHeaders() });
};

// Get single patient
export const getCoordinatorPatientById = async (patientId: string): Promise<AxiosResponse<{ success: boolean; data: { patient: any } }>> => {
  return apiClient.get(`/coordinator/patients/${patientId}`, { headers: getCoordinatorAuthHeaders() });
};

// Create patient
export const createCoordinatorPatient = async (data: CoordinatorCreatePatientRequest): Promise<AxiosResponse<{ success: boolean; data: { patient: any } }>> => {
  return apiClient.post('/coordinator/patients', data, { headers: getCoordinatorAuthHeaders() });
};

// Update patient
export const updateCoordinatorPatient = async (
  patientId: string,
  data: Partial<CoordinatorCreatePatientRequest>
): Promise<AxiosResponse<{ success: boolean; data: { patient: any } }>> => {
  return apiClient.put(`/coordinator/patients/${patientId}`, data, { headers: getCoordinatorAuthHeaders() });
};

// Delete patient
export const deleteCoordinatorPatient = async (patientId: string): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
  return apiClient.delete(`/coordinator/patients/${patientId}`, { headers: getCoordinatorAuthHeaders() });
};

// Search patients
export const searchCoordinatorPatients = async (query: string, searchBy: string = 'all'): Promise<AxiosResponse<CoordinatorPatientsResponse>> => {
  return apiClient.post('/coordinator/patients/search', { query, searchBy }, { headers: getCoordinatorAuthHeaders() });
};

// ============================================
// Coordinator Appointment Management
// ============================================

// Get appointments by date
export const getCoordinatorAppointmentsByDate = async (
  date: string,
  filters?: { doctorId?: string; status?: string }
): Promise<AxiosResponse<CoordinatorAppointmentsResponse>> => {
  return apiClient.get('/coordinator/appointments', { params: { date, ...filters }, headers: getCoordinatorAuthHeaders() });
};

// Create appointment
export const createCoordinatorAppointment = async (
  data: CoordinatorCreateAppointmentRequest
): Promise<AxiosResponse<{ success: boolean; data: { appointment: any } }>> => {
  return apiClient.post('/coordinator/appointments', data, { headers: getCoordinatorAuthHeaders() });
};

// Update appointment status
export const updateCoordinatorAppointmentStatus = async (
  appointmentId: string,
  status: string
): Promise<AxiosResponse<{ success: boolean; data: { appointment: any } }>> => {
  return apiClient.patch(`/coordinator/appointments/${appointmentId}/status`, { status }, { headers: getCoordinatorAuthHeaders() });
};

// Cancel appointment
export const cancelCoordinatorAppointment = async (
  appointmentId: string,
  reason?: string
): Promise<AxiosResponse<{ success: boolean; data: { appointment: any } }>> => {
  return apiClient.post(`/coordinator/appointments/${appointmentId}/cancel`, { reason }, { headers: getCoordinatorAuthHeaders() });
};

// Delete appointment
export const deleteCoordinatorAppointment = async (appointmentId: string): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
  return apiClient.delete(`/coordinator/appointments/${appointmentId}`, { headers: getCoordinatorAuthHeaders() });
};

// Get upcoming appointments
export const getCoordinatorUpcomingAppointments = async (
  days: number = 7,
  limit: number = 50
): Promise<AxiosResponse<{ success: boolean; data: { appointments: CoordinatorAppointment[] } }>> => {
  return apiClient.get('/coordinator/appointments/upcoming', { params: { days, limit }, headers: getCoordinatorAuthHeaders() });
};

// ============================================
// Coordinator Dashboard
// ============================================

// Get dashboard overview
export const getCoordinatorDashboardOverview = async (): Promise<AxiosResponse<{ success: boolean; data: CoordinatorDashboardOverview }>> => {
  return apiClient.get('/coordinator/dashboard/overview', { headers: getCoordinatorAuthHeaders() });
};

// Get top stats (fast)
export const getCoordinatorTopStats = async (): Promise<AxiosResponse<{ success: boolean; data: CoordinatorDashboardStats }>> => {
  return apiClient.get('/coordinator/dashboard/top-stats', { headers: getCoordinatorAuthHeaders() });
};

// Get doctors list
export const getCoordinatorDoctors = async (filters?: {
  status?: string;
  specialty?: string;
}): Promise<AxiosResponse<{ success: boolean; data: { doctors: any[]; total: number } }>> => {
  return apiClient.get('/coordinator/dashboard/doctors', { params: filters, headers: getCoordinatorAuthHeaders() });
};

// Get recent activity
export const getCoordinatorRecentActivity = async (
  limit: number = 10
): Promise<AxiosResponse<{ success: boolean; data: { activities: any[] } }>> => {
  return apiClient.get('/coordinator/dashboard/recent-activity', { params: { limit }, headers: getCoordinatorAuthHeaders() });
};

// Get appointment trends
export const getCoordinatorAppointmentTrends = async (): Promise<AxiosResponse<{ success: boolean; data: { trends: CoordinatorAppointmentTrend[] } }>> => {
  return apiClient.get('/coordinator/dashboard/appointment-trends', { headers: getCoordinatorAuthHeaders() });
};

// ============================================
// Patient Self-Service API Functions
// ============================================

export interface PatientProfile {
  id: string;
  fullName: string;
  uhid: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  allergies?: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relation?: string;
  };
  insurance?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
  };
}

// Get patient profile
export const getPatientProfile = async (): Promise<AxiosResponse<{ status: string; data: PatientProfile & { needsProfileCompletion?: boolean } }>> => {
  return apiClient.get('/patients/me/profile');
};

// Update patient profile (for onboarding)
export interface UpdateProfileData {
  fullName?: string;  // Optional - backend uses existing if not provided
  phone?: string;     // Optional - backend uses existing if not provided
  dateOfBirth: string;
  gender: string;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
}

export const updatePatientProfile = async (data: UpdateProfileData): Promise<AxiosResponse<{ status: string; message: string; data: PatientProfile }>> => {
  return apiClient.put('/patients/me/profile', data);
};

// Get upcoming appointments
export const getPatientUpcomingAppointments = async (): Promise<AxiosResponse<{ status: string; data: PatientAppointment[] }>> => {
  return apiClient.get('/patients/me/appointments');
};

// Get all appointments
export const getPatientAllAppointments = async (): Promise<AxiosResponse<{ status: string; data: PatientAppointment[] }>> => {
  return apiClient.get('/patients/me/appointments/all');
};

// Get prescriptions
export const getPatientPrescriptions = async (): Promise<AxiosResponse<{ status: string; data: PatientPrescription[] }>> => {
  return apiClient.get('/patients/me/prescriptions');
};

// Get recent activity
export const getPatientRecentActivity = async (): Promise<AxiosResponse<{ status: string; data: any[] }>> => {
  return apiClient.get('/patients/me/activity');
};

// ============================================
// Patient Dashboard Widget APIs
// ============================================

export interface NextAppointmentData {
  appointmentId: string;
  scheduledTime: string;
  appointmentType: string;
  status: string;
  notes?: string;
  doctor: {
    id?: string;
    fullName: string;
    specialty?: string;
  };
  hospital: {
    id?: string;
    name: string;
    address?: string;
    city?: string;
  };
}

export interface ActivityFeedItem {
  id: string;
  type: 'consultation' | 'prescription' | 'appointment';
  icon: string;
  title: string;
  subtitle: string;
  hospitalName: string;
  date: string;
  relativeTime: string;
  link: string;
}

// Get next upcoming appointment (for dashboard widget)
export const getPatientNextAppointment = async (): Promise<AxiosResponse<{ status: string; data: NextAppointmentData | null }>> => {
  return apiClient.get('/patients/me/next-appointment');
};

// Get activity feed (multi-hospital)
export const getPatientActivityFeed = async (limit: number = 5): Promise<AxiosResponse<{ status: string; data: ActivityFeedItem[] }>> => {
  return apiClient.get('/patients/me/activity-feed', { params: { limit } });
};

// ============================================
// Medical History Timeline APIs (Phase 4)
// ============================================

export interface MedicalHistoryItem {
  encounterId: string;
  date: string;
  chiefComplaint: string;
  diagnosis?: string;
  vitals?: Record<string, any>;
  advice?: string;
  status: string;
  hospital?: {
    id: string;
    name: string;
    city?: string;
  };
  doctor?: {
    fullName: string;
    specialty?: string;
  };
}

// Get medical history (unified timeline across all hospitals)
export const getMedicalHistory = async (): Promise<AxiosResponse<{ status: string; data: MedicalHistoryItem[] }>> => {
  return apiClient.get('/patients/me/medical-history');
};

// ============================================
// Medications API
// ============================================

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  startDate: string;
  endDate: string | null;
  prescriber: string;
  prescriberSpecialty: string | null;
  encounterId: string;
  isActive: boolean;
}

export interface MedicationsResponse {
  current: MedicationItem[];
  past: MedicationItem[];
  totalCount: number;
}

// Get medications (aggregated from encounters)
export const getMyMedications = async (): Promise<AxiosResponse<{ status: string; data: MedicationsResponse }>> => {
  return apiClient.get('/patients/me/medications');
};

// ============================================
// Vitals API
// ============================================

export interface VitalReading {
  id: string;
  date: string;
  hospitalName: string;
  bloodPressure: string | null;
  systolic: number | null;
  diastolic: number | null;
  heartRate: number | null;
  temperature: number | null;
  weight: number | null;
  height: number | null;
  spO2: number | null;
  bloodGlucose: number | null;
  respiratoryRate: number | null;
}

export interface VitalSummaryItem {
  value: string | number;
  date: string;
}

export interface VitalsResponse {
  latest: VitalReading | null;
  history: VitalReading[];
  summary: {
    bloodPressure: VitalSummaryItem | null;
    heartRate: VitalSummaryItem | null;
    temperature: VitalSummaryItem | null;
    weight: VitalSummaryItem | null;
    height: VitalSummaryItem | null;
    spO2: VitalSummaryItem | null;
    bloodGlucose: VitalSummaryItem | null;
  };
}

// Get vitals history (from encounters)
export const getMyVitals = async (limit: number = 20): Promise<AxiosResponse<{ status: string; data: VitalsResponse }>> => {
  return apiClient.get('/patients/me/vitals', { params: { limit } });
};

// ============================================
// Doctor Discovery & Booking APIs
// ============================================

export interface Hospital {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  doctorCount?: number;
}

export interface DoctorCard {
  id: string;
  fullName: string;
  specialty?: string;
  experience?: number;
  profileImage?: string;
  hospital: {
    id: string;
    name: string;
    city?: string;
  };
  nextAvailable?: string;
}

export interface AvailableSlot {
  time: string;
  display: string;
}

export interface AvailableDate {
  date: string;
  dayName: string;
  dayNumber: number;
  month: string;
  isToday: boolean;
}

export interface BookingConfirmation {
  appointmentId: string;
  scheduledTime: string;
  appointmentType: string;
  status: string;
  doctor: {
    id: string;
    fullName: string;
    specialty?: string;
  };
  hospital: {
    id: string;
    name: string;
    address?: string;
    city?: string;
  };
}

// Get all hospitals
export const getHospitals = async (): Promise<AxiosResponse<{ status: string; data: Hospital[] }>> => {
  return apiClient.get('/patients/hospitals');
};

// Get doctors at a hospital
export const getDoctorsByHospital = async (hospitalId: string, specialty?: string): Promise<AxiosResponse<{ status: string; data: DoctorCard[] }>> => {
  const params = specialty ? { specialty } : {};
  return apiClient.get(`/patients/hospitals/${hospitalId}/doctors`, { params });
};

// Search doctors (across all hospitals)
export const searchDoctors = async (query?: string, specialty?: string, hospitalId?: string): Promise<AxiosResponse<{ status: string; data: DoctorCard[] }>> => {
  return apiClient.get('/patients/doctors/search', { params: { query, specialty, hospitalId } });
};

// Get available specialties
export const getSpecialties = async (): Promise<AxiosResponse<{ status: string; data: string[] }>> => {
  return apiClient.get('/patients/specialties');
};

// Get doctor availability (dates and slots)
export const getDoctorAvailability = async (doctorId: string, hospitalId: string, date?: string): Promise<AxiosResponse<{ status: string; data: { dates: AvailableDate[]; slots: AvailableSlot[] } }>> => {
  return apiClient.get(`/patients/doctors/${doctorId}/availability`, { params: { hospitalId, date } });
};

// Book appointment
export const bookPatientAppointment = async (data: { doctorId: string; hospitalId: string; scheduledTime: string; appointmentType?: string }): Promise<AxiosResponse<{ status: string; message: string; data: BookingConfirmation }>> => {
  return apiClient.post('/patients/appointments', data);
};
