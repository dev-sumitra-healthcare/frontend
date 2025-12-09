"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loginDoctor, registerDoctor, logoutDoctor, getDoctorProfile } from '@/lib/api';
import type { AxiosError } from 'axios';

// Types
interface Doctor {
  _id?: string;
  id: string;
  fullName?: string;
  full_name?: string;
  email: string;
  medicalRegistrationId?: string;
  medical_registration_id?: string;
  specialty: string;
  roles: string[];
  accountStatus?: string;
  account_status?: string;
  phoneNumber?: string;
  phone_number?: string;
  experience?: number;
  isVerified?: boolean;
  is_verified?: boolean;
  lastLogin?: string;
  last_login?: string;
}

interface AuthContextType {
  user: Doctor | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  fullName: string;
  email: string;
  medicalRegistrationId: string;
  specialty: string;
  password: string;
  hospitalId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Doctor | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated on mount
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        setAccessToken(token);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await loginDoctor({ email, password });

      if (response.data?.data?.accessToken && response.data?.data?.doctor) {
        const { accessToken: token, doctor } = response.data.data;

        // Normalize doctor data (handle both camelCase and snake_case)
        const doctorData = doctor as any;
        const normalizedDoctor = {
          ...doctor,
          id: doctorData._id || doctorData.id,
          fullName: doctorData.full_name || doctorData.fullName,
          medicalRegistrationId: doctorData.medical_registration_id || doctorData.medicalRegistrationId,
          accountStatus: doctorData.account_status || doctorData.accountStatus,
          phoneNumber: doctorData.phone_number || doctorData.phoneNumber,
          isVerified: doctorData.is_verified !== undefined ? doctorData.is_verified : doctorData.isVerified,
          lastLogin: doctorData.last_login || doctorData.lastLogin,
        };

        // Store in localStorage
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(normalizedDoctor));

        // Update state
        setAccessToken(token);
        setUser(normalizedDoctor);

        // Navigate to dashboard
        router.replace('/doctor/dashboard');
      } else {
        throw new Error('Invalid response structure from server');
      }
    } catch (err: any) {
      let errorMessage = err.response?.data?.message || err.message || 'Login failed';
      
      // Handle pending verification error with user-friendly message
      if (errorMessage.includes('pending verification')) {
        errorMessage = 'Your account is pending verification. Please contact the administrator to complete the verification process.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await registerDoctor(data);

      if (response.data?.success && response.data?.data?.doctor) {
        // Registration successful - DO NOT auto-login since account needs verification
        // Just return success - the component will show the verification message
        return;
      } else {
        throw new Error('Registration failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call backend logout
      try {
        await logoutDoctor();
      } catch (err) {
        // Continue with logout even if backend call fails
        console.error('Logout API error:', err);
      }

      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Clear state
      setAccessToken(null);
      setUser(null);
      setError(null);

      // Redirect to doctor login
      router.replace('/doctor/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await getDoctorProfile();
      
      if (response.data?.data?.doctor) {
        const doctor = response.data.data.doctor as any;
        const normalized = {
          ...doctor,
          id: doctor._id || doctor.id,
        };
        localStorage.setItem('user', JSON.stringify(normalized));
        setUser(normalized);
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated: !!accessToken && !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
