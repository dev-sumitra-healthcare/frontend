"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import DoctorHeader from "@/components/doctor/DoctorHeader";
import DoctorTabs from "@/components/doctor/DoctorTabs";

// Pages that should NOT have the dashboard layout (public/auth pages)
const PUBLIC_ROUTES = ['/doctor/login', '/doctor/register'];
const EXACT_PUBLIC_ROUTES = ['/doctor'];

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [doctorName, setDoctorName] = useState("Sarah Johnson");

  useEffect(() => {
    loadDoctorInfo();
  }, []);

  const loadDoctorInfo = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setDoctorName(user.fullName || user.full_name || 'Doctor');
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      router.push('/doctor/login');
    }
  };

  // Check if current route is a public route (no layout needed)
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route)) ||
    EXACT_PUBLIC_ROUTES.includes(pathname || '');

  // For public routes (login/register/landing), render children without layout
  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50">
      {/* Header */}
      <DoctorHeader 
        doctorName={doctorName} 
        onLogout={handleLogout}
      />
      
      {/* Navigation Tabs */}
      <DoctorTabs />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
}
