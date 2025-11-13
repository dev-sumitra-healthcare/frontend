"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { patientLogin, patientRegister } from '@/lib/api';

// Types
interface Patient {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PatientAuthContextType {
  user: Patient | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined);

export function PatientAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Patient | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated on mount
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('patientAccessToken');
      const storedUser = localStorage.getItem('patientUser');

      if (token && storedUser) {
        setAccessToken(token);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Patient auth check error:', error);
      localStorage.removeItem('patientAccessToken');
      localStorage.removeItem('patientUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await patientLogin({ username, password });

      if (response.data?.accessToken && response.data?.user) {
        const { accessToken: token, user: patient } = response.data;

        // Store in localStorage
        localStorage.setItem('patientAccessToken', token);
        localStorage.setItem('patientUser', JSON.stringify(patient));

        // Update state
        setAccessToken(token);
        setUser(patient);

        // Navigate to patient dashboard
        router.replace('/patient/dashboard');
      } else {
        throw new Error('Invalid response structure from server');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
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

      const response = await patientRegister(data);

      if (response.data?.accessToken && response.data?.user) {
        const { accessToken: token, user: patient } = response.data;

        // Store in localStorage
        localStorage.setItem('patientAccessToken', token);
        localStorage.setItem('patientUser', JSON.stringify(patient));

        // Update state
        setAccessToken(token);
        setUser(patient);

        // Navigate to patient dashboard (auto-login after registration)
        router.replace('/patient/dashboard');
      } else {
        // If backend does not auto-login, just return success
        // The component will handle the redirect
        return;
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
  const logout = () => {
    try {
      setIsLoading(true);

      // Clear local storage
      localStorage.removeItem('patientAccessToken');
      localStorage.removeItem('patientUser');

      // Clear state
      setAccessToken(null);
      setUser(null);
      setError(null);

      // Redirect to patient login
      router.replace('/patient/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value: PatientAuthContextType = {
    user,
    accessToken,
    isAuthenticated: !!accessToken && !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <PatientAuthContext.Provider value={value}>{children}</PatientAuthContext.Provider>;
}

// Custom hook to use patient auth context
export function usePatientAuth() {
  const context = useContext(PatientAuthContext);
  if (context === undefined) {
    throw new Error('usePatientAuth must be used within a PatientAuthProvider');
  }
  return context;
}
