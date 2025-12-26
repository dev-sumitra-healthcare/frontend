"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, User, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VitalsStatusBadge, PaymentStatusBadge } from "@/components/doctor/StatusBadge";
import { getDoctorDashboard, DashboardQueueItem } from "@/lib/api";
import { toast } from "sonner";

// Helper to format date
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
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

// Determine vitals status based on actual vitals data
function getVitalsStatus(vitals: Record<string, unknown> | null): "good" | "required" {
  if (!vitals || Object.keys(vitals).length === 0) {
    return "required"; // No vitals recorded
  }
  
  // Check if we have critical vitals
  const hasVitals = vitals.bp || vitals.pulse || vitals.temp || vitals.weight;
  if (!hasVitals) {
    return "required";
  }
  
  // Check for concerning values (simplified logic)
  // In a real app, this would use clinical thresholds
  const bp = vitals.bp as string | undefined;
  if (bp) {
    const parts = bp.split("/");
    if (parts.length === 2) {
      const systolic = parseInt(parts[0]);
      if (systolic > 180 || systolic < 90) {
        return "required"; // Abnormal BP
      }
    }
  }
  
  return "good";
}

// Map payment status from API
function mapPaymentStatus(paymentStatus?: string | null): "completed" | "process" | "none" {
  if (!paymentStatus) return "none";
  
  const status = paymentStatus.toLowerCase();
  if (status === "paid" || status === "completed") return "completed";
  if (status === "pending" || status === "processing") return "process";
  return "none";
}

export default function OPDQueuePage() {
  const router = useRouter();
  const [queue, setQueue] = useState<DashboardQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      setIsLoading(true);
      const response = await getDoctorDashboard();

      if (response.data.status === "success") {
        setQueue(response.data.data.todaysQueue || []);
      }
    } catch (error: unknown) {
      console.error("Error loading queue:", error);
      const errorMessage = error && typeof error === "object" && "response" in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      toast.error("Failed to load queue", {
        description: errorMessage || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConsultation = (appointmentId: string) => {
    router.push(`/encounter/${appointmentId}`);
  };

  // Calculate stats
  const waitingPatients = queue.filter(
    (q) => q.triageStatus === "waiting" || q.triageStatus === "ready"
  );
  const inProgressPatients = queue.filter((q) => q.triageStatus === "in-progress");
  const completedPatients = queue.filter((q) => q.triageStatus === "completed");

  // Filter patients by search query
  const filteredPatients = waitingPatients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patient.patient.fullName.toLowerCase().includes(searchLower) ||
      patient.patient.uhid?.toLowerCase().includes(searchLower) ||
      patient.patient.mid?.toLowerCase().includes(searchLower)
    );
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading queue...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OPD - Patient Queue</h1>
          <p className="text-sm text-gray-600">Today: {formatDate(new Date())}</p>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by patient name and UHID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-gray-500">Waiting</p>
              <p className="text-xl font-bold text-gray-900">{waitingPatients.length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">In Progress</p>
              <p className="text-xl font-bold text-gray-900">{inProgressPatients.length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Completed</p>
              <p className="text-xl font-bold text-gray-900">{completedPatients.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Waiting Queue Section */}
      <div className="bg-amber-50/50 rounded-xl border border-amber-100 overflow-hidden">
        {/* Table Header */}
        <div className="bg-amber-100/50 px-6 py-4 border-b border-amber-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-5">Waiting Queue ({filteredPatients.length})</div>
            <div className="col-span-3 text-center">Vitals</div>
            <div className="col-span-2 text-center">Payment</div>
            <div className="col-span-2"></div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-amber-100">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12 bg-white">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No patients in waiting queue</p>
              <p className="text-sm text-gray-400 mt-1">
                Patients will appear here when they are ready
              </p>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <div
                key={patient.appointmentId}
                className="grid grid-cols-12 gap-4 items-center px-6 py-4 bg-white hover:bg-gray-50 transition-colors"
              >
                {/* Patient Info */}
                <div className="col-span-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {patient.patient.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      UHID: {patient.patient.uhid || patient.patient.mid || "N/A"} •{" "}
                      {patient.patient.age || "N/A"}Y / {patient.patient.gender || "N/A"}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(patient.scheduledTime)}</span>
                    </div>
                  </div>
                </div>

                {/* Vitals Status */}
                <div className="col-span-3 flex justify-center">
                  <VitalsStatusBadge status={getVitalsStatus(patient.vitals)} />
                </div>

                {/* Payment Status */}
                <div className="col-span-2 flex justify-center">
                  <PaymentStatusBadge status={mapPaymentStatus(patient.paymentStatus)} />
                </div>

                {/* Action Button */}
                <div className="col-span-2 flex justify-end">
                  <Button
                    onClick={() => handleStartConsultation(patient.appointmentId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* In Progress Section (if any) */}
      {inProgressPatients.length > 0 && (
        <div className="bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden">
          <div className="bg-blue-100/50 px-6 py-4 border-b border-blue-200">
            <h3 className="font-medium text-blue-800">
              In Progress ({inProgressPatients.length})
            </h3>
          </div>
          <div className="divide-y divide-blue-100">
            {inProgressPatients.map((patient) => (
              <div
                key={patient.appointmentId}
                className="grid grid-cols-12 gap-4 items-center px-6 py-4 bg-white"
              >
                <div className="col-span-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {patient.patient.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      UHID: {patient.patient.uhid || patient.patient.mid || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="col-span-3 flex justify-center">
                  <VitalsStatusBadge status={getVitalsStatus(patient.vitals)} />
                </div>
                <div className="col-span-2 flex justify-center">
                  <PaymentStatusBadge status={mapPaymentStatus(patient.paymentStatus)} />
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button
                    onClick={() => handleStartConsultation(patient.appointmentId)}
                    variant="outline"
                    className="border-blue-600 text-blue-600"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
