"use client";

import { User, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PatientQueueCardProps {
  patient: {
    fullName: string;
    uhid: string | null;
    mid: string | null;
  };
  scheduledTime: string;
  appointmentId: string;
  demographics?: string;
  onStartConsultation: (appointmentId: string) => void;
}

// Helper to format time from ISO string
function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "--:--";
  }
}

export default function PatientQueueCard({
  patient,
  scheduledTime,
  appointmentId,
  demographics,
  onStartConsultation,
}: PatientQueueCardProps) {
  return (
    <Card className="p-6 md:p-8 hover:shadow-lg transition-shadow border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Section: Avatar and Patient Info */}
        <div className="flex items-start md:items-center gap-4 flex-1">
          {/* Avatar */}
          <div className="flex-shrink-0 h-12 w-12 md:h-16 md:w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
          </div>

          {/* Patient Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
              {patient.fullName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {patient.uhid || patient.mid || "No ID"} {demographics && `• ${demographics}`}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
              <Clock className="h-4 w-4" />
              <span>{formatTime(scheduledTime)}</span>
            </div>
          </div>
        </div>

        {/* Right Section: Action Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={() => onStartConsultation(appointmentId)}
            className="w-full md:w-auto flex items-center gap-2"
          >
            <span>Start Consultation</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
