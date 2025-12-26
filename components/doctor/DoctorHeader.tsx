"use client";

import { Stethoscope, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorHeaderProps {
  doctorName: string;
  pageTitle?: string;
  pageSubtitle?: string;
  onLogout: () => void;
}

export default function DoctorHeader({ 
  doctorName, 
  pageTitle,
  pageSubtitle,
  onLogout 
}: DoctorHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section: Logo and Portal Info */}
          <div className="flex items-center gap-6">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Doctor Portal</h1>
                <p className="text-sm text-blue-600">Dr. {doctorName}</p>
              </div>
            </div>

            {/* Page Title (if provided) */}
            {pageTitle && (
              <div className="hidden md:flex items-center gap-3 pl-6 border-l border-gray-200">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{pageTitle}</h2>
                  {pageSubtitle && (
                    <p className="text-sm text-red-500">{pageSubtitle}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Section: Logout Button */}
          <Button
            variant="ghost"
            onClick={onLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
