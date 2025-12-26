"use client";

import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface AppointmentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
}

export default function AppointmentSuccessModal({
  isOpen,
  onClose,
  patientName,
  appointmentDate,
  appointmentTime,
}: AppointmentSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Appointment Booked Successfully!
          </h2>

          {/* Details */}
          <p className="text-gray-600 mb-6">
            {patientName}&apos;s appointment has been scheduled for
            <br />
            {appointmentDate} at {appointmentTime}
          </p>

          {/* Confirmation Bar */}
          <div className="bg-blue-100 text-blue-700 py-3 px-4 rounded-lg font-medium">
            A confirmation will be sent to the patient.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
