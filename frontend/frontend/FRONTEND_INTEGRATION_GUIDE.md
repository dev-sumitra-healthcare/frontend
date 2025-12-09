# Frontend Integration Guide

This document provides comprehensive information for frontend developers to integrate with the Healthcare Backend API.

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [API Overview](#api-overview)
- [Core Workflows](#core-workflows)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Code Examples](#code-examples)
- [Testing](#testing)

## 🚀 Quick Start

### Base Configuration
```javascript
const API_CONFIG = {
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};


```

### CORS Setup
The backend is configured to accept requests from:
- `http://localhost:3000` (React default)
- Credentials (cookies) are enabled for refresh tokens

### Dependencies
```bash
npm install axios  # or fetch API
```

## 🔐 Authentication

### Authentication Flow
1. **Login** → Get access token + refresh token (HTTP-only cookie)
2. **API Calls** → Include `Authorization: Bearer {token}` header
3. **Token Refresh** → Automatic via HTTP-only cookie
4. **Logout** → Clear tokens and session

### Login Example
```javascript
// Login Request
const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_CONFIG.baseURL}/v1/login`, {
      email,
      password
    }, {
      withCredentials: true  // Important for refresh token cookie
    });

    const { accessToken, doctor } = response.data.data;
    
    // Store access token (localStorage, sessionStorage, or state)
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(doctor));
    
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Login failed' };
  }
};
```

### Axios Interceptor Setup
```javascript
// Request interceptor - Add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token
        const response = await axios.post(`${API_CONFIG.baseURL}/v1/refresh-token`, {}, {
          withCredentials: true
        });
        
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

## 🗂️ API Overview

### Base URLs
- **Authentication**: `/api/v1/`
- **Admin**: `/api/v1/admin/`
- **Appointments**: `/api/v1/appointments/`
- **Encounters**: `/api/v1/encounters/`
- **Workbench**: `/api/v1/workbench/`

### Response Format
All API responses follow this consistent format:
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## 🔄 Core Workflows

### 1. Doctor Dashboard Workflow
```javascript
// 1. Get today's appointments
const getTodaysAppointments = async () => {
  const today = new Date().toISOString().split('T')[0];
  const response = await axios.get(`/v1/appointments?date=${today}`);
  return response.data.data.appointments;
};

// 2. Get dashboard stats
const getDashboardStats = async () => {
  const response = await axios.get('/v1/stats');
  return response.data.data;
};

// 3. Update appointment status
const updateAppointmentStatus = async (appointmentId, status) => {
  const response = await axios.patch(`/v1/appointments/${appointmentId}/status`, {
    status
  });
  return response.data.data;
};
```

### 2. Patient Encounter Workflow
```javascript
// 1. Start encounter - Get patient data + AI analysis
const startEncounter = async (appointmentId) => {
  try {
    const response = await axios.get(`/v1/encounters/${appointmentId}/bundle`);
    const bundle = response.data.data.bundle;
    
    return {
      encounter: bundle.encounter,
      patient: bundle.patient,
      medicalHistory: bundle.medicalHistory,
      aiAnalysis: bundle.aiAnalysis,
      encounterForm: bundle.encounterForm
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to start encounter');
  }
};

// 2. Finalize encounter - Save completed form
const finalizeEncounter = async (encounterId, encounterFormData) => {
  try {
    const response = await axios.post(`/v1/encounters/${encounterId}/finalize`, encounterFormData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to finalize encounter');
  }
};
```

### 3. Profile Management
```javascript
// Get doctor profile
const getDoctorProfile = async () => {
  const response = await axios.get('/v1/profile');
  return response.data.data.doctor;
};

// Update doctor profile
const updateDoctorProfile = async (profileData) => {
  const response = await axios.put('/v1/profile', profileData);
  return response.data.data.doctor;
};
```

## 📡 API Endpoints Reference

### Authentication Endpoints

#### POST `/v1/register`
Register a new doctor account.

**Request:**
```javascript
{
  "fullName": "Dr. John Smith",
  "email": "john.smith@example.com",
  "medicalRegistrationId": "MED123456",
  "specialty": "Cardiology",
  "password": "SecurePass123"
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Doctor registration successful. Your account is pending verification.",
  "data": {
    "doctor": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "fullName": "Dr. John Smith",
      "email": "john.smith@example.com",
      "accountStatus": "pending_verification",
      // ... other fields
    }
  }
}
```

#### POST `/v1/login`
Authenticate doctor and receive tokens.

**Request:**
```javascript
{
  "email": "john.smith@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Login successful",
  "data": {
    "doctor": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "fullName": "Dr. John Smith",
      "email": "john.smith@example.com",
      "specialty": "Cardiology",
      "accountStatus": "active",
      "lastLogin": "2023-09-06T10:35:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/v1/refresh-token`
Refresh access token using HTTP-only cookie.

**Response:**
```javascript
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/v1/logout`
Logout and invalidate tokens.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```javascript
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Appointment Endpoints

#### GET `/v1/appointments`
Get appointments with optional filters.

**Query Parameters:**
- `date` (optional): Filter by date (YYYY-MM-DD)
- `status` (optional): Filter by status
- `limit` (optional): Limit results (default: 20)

**Response:**
```javascript
{
  "success": true,
  "data": {
    "appointments": [
      {
        "_id": "appt_123",
        "practitionerId": "doctor_1",
        "patientId": "patient_1",
        "patientName": "John Doe",
        "scheduledTime": "2024-03-15T09:00:00.000Z",
        "status": "Waiting",
        "appointmentType": "Follow-up",
        "duration": 30,
        "notes": "Hypertension follow-up visit"
      }
    ],
    "total": 5,
    "page": 1
  }
}
```

### Encounter Endpoints

#### GET `/v1/encounters/{appointment_id}/bundle`
Create encounter bundle with AI analysis.

**Response:**
```javascript
{
  "success": true,
  "message": "Encounter bundle created successfully",
  "data": {
    "bundle": {
      "encounter": {
        "id": "encounter_appt_123_1647338400000",
        "appointmentId": "appt_123",
        "patientId": "patient_1",
        "createdAt": "2024-03-15T09:00:00.000Z",
        "status": "in-progress"
      },
      "patient": {
        "id": "patient_1",
        "fullName": "John Doe",
        "uhid": "UHID-001",
        "age": 45,
        "gender": "Male",
        "allergies": ["Penicillin", "Shellfish"],
        "bloodType": "A+"
      },
      "medicalHistory": [
        {
          "date": "2024-01-15",
          "type": "Visit",
          "diagnosis": "Hypertension",
          "practitioner": "Dr. Sarah Wilson",
          "notes": "Blood pressure elevated. Started on Lisinopril 10mg daily."
        }
      ],
      "aiAnalysis": {
        "generatedAt": "2024-03-15T09:00:30.000Z",
        "summary": "Patient presents with symptoms consistent with seasonal allergies...",
        "recommendations": [
          "Consider prescribing a non-drowsy antihistamine",
          "Advise patient to monitor blood pressure"
        ],
        "confidence": 0.87,
        "processingTimeMs": 542
      },
      "encounterForm": {
        "chiefComplaint": "Patient reports sneezing, runny nose, and itchy eyes...",
        "diagnosis": [
          {
            "code": "J30.9",
            "description": "Allergic rhinitis, unspecified",
            "confidence": "High"
          }
        ],
        "medications": [
          {
            "name": "Loratadine",
            "dosage": "10mg",
            "frequency": "Once daily",
            "duration": "2 weeks"
          }
        ],
        "vitalSigns": {
          "bloodPressure": "128/82 mmHg",
          "heartRate": "76 bpm",
          "temperature": "98.6°F"
        },
        "doctorRemarks": "",
        "followUpInstructions": "Return in 2-3 weeks if symptoms persist"
      }
    }
  }
}
```

#### POST `/v1/encounters/{encounter_id}/finalize`
Save completed encounter form.

**Request:**
```javascript
{
  "chiefComplaint": "Patient reports allergy symptoms",
  "presentingSymptoms": ["Sneezing", "Runny nose", "Itchy eyes"],
  "diagnosis": [
    {
      "code": "J30.9",
      "description": "Allergic rhinitis, unspecified",
      "confidence": "High"
    }
  ],
  "medications": [
    {
      "name": "Loratadine",
      "dosage": "10mg",
      "frequency": "Once daily",
      "duration": "2 weeks",
      "instructions": "Take with or without food"
    }
  ],
  "vitalSigns": {
    "bloodPressure": "128/82 mmHg",
    "heartRate": "76 bpm",
    "temperature": "98.6°F",
    "respiratoryRate": "16 breaths/min",
    "oxygenSaturation": "98%"
  },
  "doctorRemarks": "Patient educated about allergen avoidance",
  "followUpInstructions": "Return in 2-3 weeks if symptoms persist"
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Encounter finalized successfully",
  "data": {
    "encounter": {
      "id": "encounter_appt_123_1647338400000",
      "finalizedAt": "2024-03-15T09:30:00.000Z",
      "status": "completed"
    },
    "appointment": {
      "id": "appt_123",
      "status": "Completed",
      "updatedAt": "2024-03-15T09:30:00.000Z"
    },
    "nextSteps": [
      "Encounter has been saved to patient medical record",
      "Appointment status updated to Completed",
      "Patient can be discharged or scheduled for follow-up"
    ]
  }
}
```

### Dashboard/Stats Endpoints

#### GET `/v1/stats`
Get dashboard statistics for the logged-in doctor.

**Response:**
```javascript
{
  "success": true,
  "data": {
    "todaysAppointments": {
      "total": 8,
      "completed": 3,
      "inProgress": 1,
      "waiting": 4
    },
    "thisWeekStats": {
      "totalPatients": 45,
      "completedEncounters": 38,
      "avgConsultationTime": 28
    },
    "recentActivity": [
      {
        "type": "appointment",
        "description": "Completed consultation with John Doe",
        "timestamp": "2024-03-15T09:30:00.000Z"
      }
    ],
    "upcomingAppointments": [
      {
        "id": "appt_124",
        "patientName": "Jane Smith",
        "scheduledTime": "2024-03-15T10:30:00.000Z",
        "appointmentType": "New Visit"
      }
    ]
  }
}
```

## 📝 Data Models

### Patient Model
```typescript
interface Patient {
  id: string;
  fullName: string;
  uhid: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  allergies: string[];
  bloodType: string;
  medicalRecordNumber: string;
}
```

### Appointment Model
```typescript
interface Appointment {
  id: string;
  practitionerId: string;
  patientId: string;
  patientName: string;
  scheduledTime: string;
  status: 'Scheduled' | 'Waiting' | 'In-Progress' | 'Completed' | 'Cancelled';
  appointmentType: 'New Visit' | 'Follow-up' | 'Routine Check';
  duration: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
```

### Encounter Bundle Model
```typescript
interface EncounterBundle {
  encounter: {
    id: string;
    appointmentId: string;
    patientId: string;
    createdAt: string;
    status: 'in-progress' | 'completed';
  };
  patient: Patient;
  medicalHistory: MedicalHistoryRecord[];
  aiAnalysis: {
    generatedAt: string;
    summary: string;
    recommendations: string[];
    confidence: number;
    processingTimeMs: number;
  };
  encounterForm: {
    chiefComplaint: string;
    presentingSymptoms: string[];
    diagnosis: DiagnosisRecord[];
    medications: MedicationRecord[];
    vitalSigns: VitalSigns;
    doctorRemarks: string;
    followUpInstructions: string;
  };
}
```

## 🚨 Error Handling

### Common HTTP Status Codes
- **200**: Success
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/expired token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error
- **503**: Service Unavailable (AI service down)

### Error Response Format
```javascript
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### Frontend Error Handling
```javascript
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        // Validation errors
        return {
          type: 'validation',
          message: data.message,
          errors: data.errors || []
        };
      
      case 401:
        // Unauthorized - redirect to login
        localStorage.clear();
        window.location.href = '/login';
        return { type: 'auth', message: 'Please log in again' };
      
      case 403:
        return { type: 'permission', message: 'Access denied' };
      
      case 404:
        return { type: 'notFound', message: 'Resource not found' };
      
      case 503:
        return { type: 'service', message: 'Service temporarily unavailable' };
      
      default:
        return { type: 'server', message: 'Server error occurred' };
    }
  }
  
  return { type: 'network', message: 'Network error' };
};
```

## 🧪 Testing with Mock Data

### Prerequisites
1. Start the mock AI service: `npm run mock:ai`
2. Start the backend: `npm run dev`

### Test Credentials
```javascript
const TEST_DOCTOR = {
  email: 'test.doctor@example.com',
  password: 'SecurePass123'
};
```

### Test Data Available
- **4 Patients**: John Doe, Jane Smith, Robert Johnson, Emily Davis
- **7 Appointments**: Various statuses and times
- **Medical History**: Realistic healthcare records
- **Mock AI**: Consistent analysis responses

### Sample Integration Test
```javascript
const testEncounterFlow = async () => {
  try {
    // 1. Login
    const loginResult = await loginUser('test.doctor@example.com', 'SecurePass123');
    console.log('Login:', loginResult.success);
    
    // 2. Get appointments
    const appointments = await getTodaysAppointments();
    console.log('Appointments:', appointments.length);
    
    // 3. Start encounter
    const appointmentId = 'appt_123'; // John Doe's appointment
    const bundle = await startEncounter(appointmentId);
    console.log('Encounter started:', bundle.encounter.id);
    
    // 4. Finalize encounter
    const finalizedEncounter = await finalizeEncounter(bundle.encounter.id, {
      chiefComplaint: "Updated chief complaint",
      diagnosis: bundle.encounterForm.diagnosis,
      medications: bundle.encounterForm.medications,
      vitalSigns: bundle.encounterForm.vitalSigns,
      doctorRemarks: "Test finalization",
      followUpInstructions: "Follow up in 1 week"
    });
    console.log('Encounter finalized:', finalizedEncounter.encounter.status);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};
```

## 🔧 Development Tips

### Environment Setup
```javascript
// .env.local (Next.js) or equivalent
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_AI_SERVICE_URL=http://localhost:3001
```

### State Management (Redux/Context)
```javascript
// Example user state structure
const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null
};
```

### React Hook Example
```javascript
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result.success) {
        setUser(result.data.doctor);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await axios.post('/v1/logout');
    localStorage.clear();
    setUser(null);
  };

  return { user, login, logout, loading };
};
```

### Debugging
- Backend logs all requests and repository operations
- Mock AI service provides detailed logging
- Use `/v1/encounters/service-info` to check configuration
- Browser Network tab shows all API calls

## 📞 Support

### Common Issues
1. **CORS Errors**: Ensure credentials are included in requests
2. **401 Errors**: Check token refresh implementation
3. **503 Errors**: Verify mock AI service is running
4. **Empty Responses**: Check date formats and filters

### Development Workflow
1. Start mock AI service first
2. Start backend server
3. Test authentication flow
4. Test core workflows
5. Handle errors gracefully

This guide provides everything needed for frontend integration. The mock data layer ensures consistent, predictable behavior during development and testing.
