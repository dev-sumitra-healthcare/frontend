"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LoginForm as DoctorLoginForm } from '@/components/LoginForm';
import { RegisterForm as DoctorRegisterForm } from '@/components/RegisterForm';
import PatientLoginForm from '@/components/patient/PatientLoginForm';
import PatientRegisterForm from '@/components/patient/PatientRegisterForm';
import { Button } from '@/components/ui/button';
import { Stethoscope, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UnifiedAuth() {
  const search = useSearchParams();
  const router = useRouter();
  const defaultTab = (search.get('tab') || 'login') as 'login' | 'register';
  const defaultRole = (search.get('role') || 'doctor') as 'doctor' | 'patient';
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [activeRole, setActiveRole] = useState<'doctor' | 'patient'>(defaultRole);

  const handleNavigation = (tab: 'login' | 'register', role: 'doctor' | 'patient') => {
    setActiveTab(tab);
    setActiveRole(role);
    router.replace(`/auth?tab=${tab}&role=${role}`, { scroll: false });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            MedMitra
          </h1>
          <p className="text-muted-foreground text-lg">Your Healthcare Management Platform</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Doctor Card */}
          <button
            onClick={() => handleNavigation(activeTab, 'doctor')}
            className={cn(
              "p-6 rounded-2xl border-2 transition-all duration-200 text-left",
              activeRole === 'doctor'
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950/20 shadow-lg scale-105"
                : "border-muted hover:border-blue-300 hover:shadow-md"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center",
                activeRole === 'doctor' ? "bg-blue-600" : "bg-blue-100 dark:bg-blue-900"
              )}>
                <Stethoscope className={cn(
                  "h-6 w-6",
                  activeRole === 'doctor' ? "text-white" : "text-blue-600 dark:text-blue-400"
                )} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">Healthcare Provider</h3>
                <p className="text-sm text-muted-foreground">
                  Access your dashboard, manage appointments, and patient records
                </p>
              </div>
              {activeRole === 'doctor' && (
                <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>

          {/* Patient Card */}
          <button
            onClick={() => handleNavigation(activeTab, 'patient')}
            className={cn(
              "p-6 rounded-2xl border-2 transition-all duration-200 text-left",
              activeRole === 'patient'
                ? "border-purple-600 bg-purple-50 dark:bg-purple-950/20 shadow-lg scale-105"
                : "border-muted hover:border-purple-300 hover:shadow-md"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center",
                activeRole === 'patient' ? "bg-purple-600" : "bg-purple-100 dark:bg-purple-900"
              )}>
                <HeartPulse className={cn(
                  "h-6 w-6",
                  activeRole === 'patient' ? "text-white" : "text-purple-600 dark:text-purple-400"
                )} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">Patient Portal</h3>
                <p className="text-sm text-muted-foreground">
                  View appointments, access health records, and book consultations
                </p>
              </div>
              {activeRole === 'patient' && (
                <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Login/Register Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border bg-card p-1 shadow-sm">
            <Button
              variant={activeTab === 'login' ? 'default' : 'ghost'}
              onClick={() => handleNavigation('login', activeRole)}
              className="px-8 rounded-md"
            >
              Sign In
            </Button>
            <Button
              variant={activeTab === 'register' ? 'default' : 'ghost'}
              onClick={() => handleNavigation('register', activeRole)}
              className="px-8 rounded-md"
            >
              Create Account
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex justify-center">
          {activeTab === 'login' && activeRole === 'doctor' && <DoctorLoginForm />}
          {activeTab === 'register' && activeRole === 'doctor' && <DoctorRegisterForm />}
          {activeTab === 'login' && activeRole === 'patient' && <PatientLoginForm />}
          {activeTab === 'register' && activeRole === 'patient' && <PatientRegisterForm />}
        </div>
      </div>
    </div>
  );
}
