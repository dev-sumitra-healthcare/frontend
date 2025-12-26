import {
  DoctorRegistrationResponse,
  DoctorLoginResponse,
  DoctorProfileResponse,
  UpdateDoctorProfileResponse,
  AdminLoginResponse,
  AdminRegistrationResponse,
  GetDoctorsResponse,
  VerifySuspendDoctorResponse,
  AppointmentsResponse,
  ActionItemsSummaryResponse,
  PerformanceStatsResponse,
  EncounterDataResponse
} from "./api";

export const fakeDoctorRegistrationResponse: DoctorRegistrationResponse = {
  success: true,
  message: "Doctor registered successfully.",
  data: {
    doctor: {
      _id: "doc-123",
      fullName: "Dr. John Doe",
      email: "john.doe@example.com",
      medicalRegistrationId: "MR12345",
      specialty: "Cardiology",
      roles: ["doctor"],
      accountStatus: "pending_verification",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};

export const fakeDoctorLoginResponse: DoctorLoginResponse = {
  success: true,
  message: "Login successful.",
  data: {
    doctor: {
      _id: "doc-123",
      fullName: "Dr. John Doe",
      email: "john.doe@example.com",
      medicalRegistrationId: "MR12345",
      specialty: "Cardiology",
      roles: ["doctor"],
      accountStatus: "active",
      lastLogin: new Date().toISOString(),
    },
    accessToken: "fake-access-token",
  },
};

export const fakeDoctorProfileResponse: DoctorProfileResponse = {
  success: true,
  data: {
    doctor: {
      _id: "doc-123",
      fullName: "Dr. John Doe",
      email: "john.doe@example.com",
      medicalRegistrationId: "MR12345",
      specialty: "Cardiology",
      roles: ["doctor"],
      accountStatus: "active",
      phoneNumber: "123-456-7890",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA",
      },
      qualifications: [
        {
          degree: "MD",
          institution: "Medical School",
          year: 2010,
        },
      ],
      experience: 10,
      isVerified: true,
      verificationDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};

export const fakeUpdateDoctorProfileResponse: UpdateDoctorProfileResponse = {
  success: true,
  message: "Profile updated successfully.",
  data: {
    doctor: {
      _id: "doc-123",
      fullName: "Dr. John Doe",
      email: "john.doe@example.com",
      medicalRegistrationId: "MR12345",
      specialty: "Dermatology",
      roles: ["doctor"],
      accountStatus: "active",
      phoneNumber: "123-456-7890",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA",
      },
      qualifications: [
        {
          degree: "MD",
          institution: "Medical School",
          year: 2010,
        },
      ],
      experience: 10,
      isVerified: true,
      verificationDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};

export const fakeAdminLoginResponse: AdminLoginResponse = {
  success: true,
  message: "Admin login successful.",
  data: {
    admin: {
      _id: "admin-123",
      email: "admin@example.com",
      roles: ["admin"],
    },
    accessToken: "fake-admin-access-token",
  },
};

export const fakeAdminRegistrationResponse: AdminRegistrationResponse = {
  success: true,
  message: "Admin registered successfully.",
  data: {
    admin: {
      _id: "admin-123",
      email: "admin@example.com",
      roles: ["admin"],
    },
  },
};

export const fakeGetDoctorsResponse: GetDoctorsResponse = {
  success: true,
  data: {
    doctors: [
      {
        _id: "doc-123",
        fullName: "Dr. John Doe",
        email: "john.doe@example.com",
        medicalRegistrationId: "MR12345",
        specialty: "Cardiology",
        accountStatus: "active",
      },
      {
        _id: "doc-456",
        fullName: "Dr. Jane Smith",
        email: "jane.smith@example.com",
        medicalRegistrationId: "MR67890",
        specialty: "Neurology",
        accountStatus: "pending_verification",
      },
    ],
  },
};

export const fakeVerifySuspendDoctorResponse: VerifySuspendDoctorResponse = {
  success: true,
  message: "Doctor status updated.",
  data: {
    doctor: {
      _id: "doc-456",
      fullName: "Dr. Jane Smith",
      email: "jane.smith@example.com",
      medicalRegistrationId: "MR67890",
      specialty: "Neurology",
      accountStatus: "active",
    },
  },
};

export const fakeAppointmentsResponse: AppointmentsResponse = {
  status: "success",
  data: [
    {
      id: "apt-1",
      time: "09:00 AM",
      patientName: "Alice Johnson",
      patientUhid: "UHID-001",
      type: "Consultation",
      status: "Confirmed",
    },
    {
      id: "apt-2",
      time: "10:00 AM",
      patientName: "Bob Williams",
      patientUhid: "UHID-002",
      type: "Follow-up",
      status: "Checked-In",
    },
  ],
};

export const fakeActionItemsSummaryResponse: ActionItemsSummaryResponse = {
  status: "success",
  data: {
    newResults: 5,
    consultationRequests: 2,
    unreadMessages: 8,
  },
};

export const fakePerformanceStatsResponse: PerformanceStatsResponse = {
  status: "success",
  data: {
    patientsSeen: 12,
    patientsScheduled: 20,
    avgConsultTimeMinutes: 15,
    pendingDocumentation: 3,
  },
};

export const fakeEncounterDataResponse: EncounterDataResponse = {
  success: true,
  data: {
    encounterForm: {
      chiefComplaint: "Patient reports sneezing, runny nose, and itchy eyes for the past 3 days.",
      diagnosis: [{ id: "J30.9", name: "Allergic rhinitis, unspecified" }],
      medications: [
        {
          name: "Loratadine",
          dosage: "10mg",
          frequency: "Once daily",
        },
      ],
    },
    aiAnalysis: {
      summary: "The patient, a 45-year-old male with a history of seasonal allergies, presents with classic symptoms of allergic rhinitis. The symptoms are consistent with exposure to environmental allergens.",
      recommendations: [
        "Advise patient to avoid known allergens.",
        "Consider adding a nasal corticosteroid spray if symptoms persist.",
        "Recommend a follow-up visit in 2 weeks to assess treatment efficacy.",
      ],
    },
    patientHistory: [
      {
        id: "event-1",
        date: "2024-08-10",
        type: "Consultation",
        title: "Annual Check-up",
        details: "Routine annual physical examination. All vitals normal.",
      },
      {
        id: "event-2",
        date: "2023-05-20",
        type: "Lab Result",
        title: "Cholesterol Panel",
        details: "Total cholesterol: 180 mg/dL, HDL: 60 mg/dL, LDL: 100 mg/dL.",
      },
    ],
  },
};