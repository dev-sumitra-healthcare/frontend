"use client";

import { useState, useEffect } from "react";
import { X, Clock, Calendar, CreditCard, Shield, Building2 } from "lucide-react";

interface DoctorInfo {
  id: string;
  fullName: string;
  specialty?: string;
  consultationFee?: number;
  availableSlots?: string[];
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorInfo | null;
  onConfirm: (data: { doctorId: string; date: string; timeSlot: string; paymentMethod: string }) => void;
  isLoading?: boolean;
}

const TIME_SLOTS = ["09:00 AM", "10:00 AM", "02:00 PM", "03:30 PM"];

const PAYMENT_METHODS = [
  {
    id: "card",
    title: "Credit/Debit Card",
    description: "Pay securely with your card",
    icon: CreditCard,
  },
  {
    id: "insurance",
    title: "Insurance",
    description: "Use your health insurance",
    icon: Shield,
  },
  {
    id: "clinic",
    title: "Pay at Clinic",
    description: "Pay when you visit",
    icon: Building2,
  },
];

export default function BookingModal({
  isOpen,
  onClose,
  doctor,
  onConfirm,
  isLoading = false,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDate("");
      setSelectedTimeSlot(null);
      setSelectedPaymentMethod(null);
    }
  }, [isOpen]);

  if (!isOpen || !doctor) return null;

  const timeSlots = doctor.availableSlots?.length ? doctor.availableSlots : TIME_SLOTS;
  const consultationFee = doctor.consultationFee ?? 150;
  const isFormValid = selectedDate && selectedTimeSlot && selectedPaymentMethod;

  const handleConfirm = () => {
    if (isFormValid) {
      onConfirm({
        doctorId: doctor.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot!,
        paymentMethod: selectedPaymentMethod!,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none"
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Book appointment with ${doctor.fullName}`}
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-[520px] sm:max-w-lg mx-4 max-h-[90vh] overflow-y-auto overflow-x-hidden"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 space-y-6">
          {/* Header */}
          <h2 className="text-[18px] font-medium text-[#101828] pr-8" style={{ fontFamily: "Inter, sans-serif" }}>
            Book Appointment with {doctor.fullName}
          </h2>

          {/* Doctor Info Card */}
          <div className="bg-[#f0f7ff] border-l-4 border-[#155dfc] rounded-r-lg p-4">
            <p className="text-[16px] font-medium text-[#101828]" style={{ fontFamily: "Inter, sans-serif" }}>
              {doctor.fullName}
            </p>
            <p className="text-[14px] text-[#475467]" style={{ fontFamily: "Inter, sans-serif" }}>
              {doctor.specialty || "General Medicine"}
            </p>
            <p
              className="text-[14px] text-[#101828] font-medium mt-1"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Consultation Fee: ${consultationFee}
            </p>
          </div>

          {/* Select Date */}
          <div>
            <label
              className="block text-[14px] font-medium text-[#364153] mb-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Select Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667085] pointer-events-none z-10" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toLocaleDateString('en-CA')}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-full h-[48px] pl-12 pr-4 rounded-lg border border-[#d0d5dd] text-[16px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30 focus:border-[#155dfc] bg-white relative"
                style={{ fontFamily: "Inter, sans-serif" }}
                aria-label="Select appointment date"
              />
            </div>
          </div>

          {/* Select Time Slot */}
          <div>
            <label
              className="block text-[14px] font-medium text-[#364153] mb-3"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Select Time Slot
            </label>

            {/* Responsive: 2 cols on small screens, 3 on sm+ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`w-full flex flex-col items-center justify-center p-3 rounded-lg border transition-all text-center ${
                    selectedTimeSlot === slot
                      ? "bg-[#155dfc] border-[#155dfc] text-white"
                      : "bg-white border-[#d0d5dd] text-[#364153] hover:border-[#155dfc]"
                  }`}
                  aria-pressed={selectedTimeSlot === slot}
                >
                  <Clock
                    className={`w-5 h-5 mb-1 ${selectedTimeSlot === slot ? "text-white" : "text-[#667085]"}`}
                  />
                  <span className="text-[14px] font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                    {slot}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label
              className="block text-[14px] font-medium text-[#364153] mb-3"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Payment Method
            </label>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedPaymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all text-left ${
                      isSelected ? "border-[#155dfc] bg-[#f0f7ff]" : "border-[#d0d5dd] bg-white hover:border-[#155dfc]"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-[#155dfc]" : "text-[#667085]"}`} />
                    <div>
                      <p className="text-[14px] font-medium text-[#101828]" style={{ fontFamily: "Inter, sans-serif" }}>
                        {method.title}
                      </p>
                      <p className="text-[13px] text-[#667085]" style={{ fontFamily: "Inter, sans-serif" }}>
                        {method.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[48px] rounded-lg border border-[#d0d5dd] bg-white text-[#364153] text-[16px] font-medium hover:bg-gray-50 transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isFormValid || isLoading}
              className={`flex-1 h-[48px] rounded-lg text-[16px] font-medium transition-colors flex items-center justify-center gap-2 ${
                isFormValid && !isLoading ? "bg-[#155dfc] text-white hover:bg-[#1d4ed8]" : "bg-[#d0d5dd] text-[#667085] cursor-not-allowed"
              }`}
              style={{ fontFamily: "Inter, sans-serif" }}
              aria-disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <span className="font-bold">$</span>
                  Confirm &amp; Pay ${consultationFee}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
