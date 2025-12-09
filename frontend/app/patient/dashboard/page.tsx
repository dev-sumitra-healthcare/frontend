"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import PatientProfileWidget from '@/components/patient/PatientProfileWidget';
import PatientAppointmentsWidget from '@/components/patient/PatientAppointmentsWidget';
import PatientPrescriptionsWidget from '@/components/patient/PatientPrescriptionsWidget';
import MedicalHistoryWidget from '@/components/patient/MedicalHistoryWidget';
import { DigitalMIDCard } from '@/components/patient/digital-mid-card';
import { NextAppointmentWidget } from '@/components/patient/NextAppointmentWidget';
import { RecentActivityFeed } from '@/components/patient/RecentActivityFeed';
import { Stethoscope, LogOut, User, Calendar, FileText, AlertCircle, Clock } from 'lucide-react';
import { getPatientProfile } from '@/lib/api';
import { usePatientAuth } from '@/contexts/PatientAuthContext';
import Link from 'next/link';

type TabType = 'profile' | 'appointments' | 'prescriptions' | 'history';

interface PatientProfile {
  fullName: string;
  uhid: string;
  dateOfBirth?: string;
  gender?: string;
  needsProfileCompletion?: boolean;
}

export default function PatientDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  useEffect(() => {
    // Check if patient is authenticated
    const token = localStorage.getItem('patientAccessToken');
    const storedUser = localStorage.getItem('patientUser');
    
    if (!token || !storedUser) {
      router.replace('/patient/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      // Check if user is a patient
      if (userData.role !== 'patient') {
        router.replace('/patient/login');
        return;
      }
      setUser(userData);
      
      // Fetch patient profile to get UHID and other data
      fetchPatientProfile();
    } catch (e) {
      router.replace('/patient/login');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  const fetchPatientProfile = async () => {
    try {
      const response = await getPatientProfile();
      if (response.data.status === 'success' && response.data.data) {
        setPatientProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching patient profile:', error);
    }
  };

  const { logout } = usePatientAuth();

  const handleLogout = () => {
    logout();  // Uses context which clears both localStorage AND state
  };

  // Use profile data if available, fallback to user data
  const patientName = patientProfile?.fullName || user?.username || 'Patient';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as TabType, label: 'My Profile', icon: User },
    { id: 'appointments' as TabType, label: 'Appointments', icon: Calendar },
    { id: 'prescriptions' as TabType, label: 'Prescriptions', icon: FileText },
    { id: 'history' as TabType, label: 'History', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Stethoscope className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">MedMitra</span>
                <p className="text-xs text-gray-500">Patient Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-gray-700">
                Welcome, <span className="font-semibold text-purple-600">{patientName}</span>
              </span>
              <Link href="/patient/book">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Calendar className="h-4 w-4 mr-1" /> Book Appointment
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-700 hover:text-purple-600 hover:bg-purple-50"
              >
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Healthcare Dashboard</h1>
          <p className="text-gray-600">View your medical information and health records</p>
        </div>

        {/* Complete Profile Banner */}
        {patientProfile?.needsProfileCompletion && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">Complete Your Profile</p>
                <p className="text-sm text-amber-700">Add your date of birth and other details for a better experience</p>
              </div>
            </div>
            <Link href="/patient/onboarding">
              <Button variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-100">
                Complete Now
              </Button>
            </Link>
          </div>
        )}

        {/* Digital MID Card */}
        <div className="mb-6">
          <DigitalMIDCard 
            patientName={patientName} 
            mid={patientProfile?.uhid || "Loading..."} 
            dob={patientProfile?.dateOfBirth ? new Date(patientProfile.dateOfBirth).toLocaleDateString() : undefined}
            gender={patientProfile?.gender || undefined}
          />
        </div>

        {/* Next Appointment Widget */}
        <div className="mb-6">
          <NextAppointmentWidget />
        </div>

        {/* Two Column Layout: Content + Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-1 p-2" aria-label="Tabs">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all
                          ${
                            isActive
                              ? 'bg-purple-100 text-purple-700 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {activeTab === 'profile' && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-6 h-6 text-purple-600" />
                      My Profile
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Your personal and medical information</p>
                  </div>
                  <PatientProfileWidget />
                </div>
              )}

              {activeTab === 'appointments' && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-purple-600" />
                      My Appointments
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">View your upcoming and past appointments</p>
                  </div>
                  <PatientAppointmentsWidget />
                </div>
              )}

              {activeTab === 'prescriptions' && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-purple-600" />
                      My Prescriptions
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">View and download your prescriptions</p>
                  </div>
                  <PatientPrescriptionsWidget />
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Clock className="w-6 h-6 text-purple-600" />
                      Medical History
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Your complete health journey across all hospitals</p>
                  </div>
                  <MedicalHistoryWidget />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Recent Activity (1 col) */}
          <div className="lg:col-span-1">
            <RecentActivityFeed />
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your profile information is managed by your healthcare provider. 
            If you notice any discrepancies, please contact your doctor's office.
          </p>
        </div>
      </main>
    </div>
  );
}
