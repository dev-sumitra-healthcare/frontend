"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Save, CheckCircle } from "lucide-react";
import EncounterHeader from "@/components/doctor/EncounterHeader";
import VitalsForm, { VitalsData } from "@/components/doctor/VitalsForm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  getDoctorDashboard,
  DashboardQueueItem,
  getEncounterDetails,
  finalizeEncounter,
  FinalizeEncounterRequest
} from "@/lib/api";
import { toast } from "sonner";

export default function ConsultationPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params?.appointmentId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [appointment, setAppointment] = useState<DashboardQueueItem | null>(null);
  const [vitalsMode, setVitalsMode] = useState<"prefilled" | "manual">("manual");
  const [vitalsData, setVitalsData] = useState<VitalsData | undefined>(undefined);

  // Clinical notes state
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [historyPresentIllness, setHistoryPresentIllness] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [medications, setMedications] = useState("");

  const [encounterId, setEncounterId] = useState<string | null>(null);

  useEffect(() => {
    loadAppointmentData();
  }, [appointmentId]);

  const loadAppointmentData = async () => {
    try {
      setIsLoading(true);
      const response = await getDoctorDashboard();

      if (response.data.status === "success") {
        const queue = response.data.data.todaysQueue || [];
        const foundAppointment = queue.find((apt) => apt.appointmentId === appointmentId);

        if (foundAppointment) {
          setAppointment(foundAppointment);

          
          // Get encounter details (creates one if not exists)
          try {
            const encResponse = await getEncounterDetails(appointmentId);
            if (encResponse.data.success) {
              setEncounterId(encResponse.data.data.bundle.encounter.id);
            }
          } catch (err) {
            console.error("Error loading encounter details:", err);
          }

          // Check for triage vitals
          if (foundAppointment.vitals && foundAppointment.triageRecordedAt) {
            setVitalsMode("prefilled");
            // Map TriageVitals (api.ts) to VitalsData (VitalsForm.tsx)
            // Triage: pulse, temp, bp
            // Form: heartRate, temperature, bp
            const triage = foundAppointment.vitals as any;
            const formVitals: VitalsData = {
              bp: triage.bp,
              heartRate: triage.pulse,
              temperature: triage.temp,
              weight: triage.weight,
              height: triage.height
            };
            setVitalsData(formVitals);
          } else {
            setVitalsMode("manual");
          }
        } else {
          toast.error("Appointment not found");
          router.push("/doctor/opd");
        }
      }
    } catch (error: any) {
      console.error("Error loading appointment:", error);
      toast.error("Failed to load appointment", {
        description: error.response?.data?.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVitalsSubmit = (vitals: VitalsData) => {
    setVitalsData(vitals);
    toast.success("Vitals saved");
  };

  const handleSaveDraft = () => {
    // TODO: Implement draft saving
    toast.success("Draft saved");
  };

  const handleFinalizeEncounter = async () => {
    if (!encounterId) {
      toast.error("Encounter ID not found. Please refresh.");
      return;
    }

    try {
      const loadingToast = toast.loading("Finalizing encounter...");

      // Construct payload
      const payload: FinalizeEncounterRequest = {
        appointmentId,
        chiefComplaint,
        presentingSymptoms: [], // TODO: extract from text or add UI
        diagnosis: diagnosis ? [{ code: "manual", description: diagnosis, confidence: "high" }] : [],
        medications: medications ? [{ 
          name: medications, 
          dosage: "", 
          frequency: "", 
          duration: "", 
          instructions: treatmentPlan 
        }] : [],
        vitalSigns: vitalsData ? {
          bloodPressure: vitalsData.bp || "",
          heartRate: vitalsData.heartRate?.toString() || "",
          temperature: vitalsData.temperature?.toString() || "",
          respiratoryRate: "", 
          oxygenSaturation: "", // VitalsForm doesn't capture SpO2 currently
        } : {
          bloodPressure: "",
          heartRate: "",
          temperature: "",
          respiratoryRate: "",
          oxygenSaturation: "",
        },
        doctorRemarks: historyPresentIllness, // Mapping HPI to comments/remarks for now
        followUpInstructions: treatmentPlan,
      };

      await finalizeEncounter(encounterId, payload);

      toast.dismiss(loadingToast);
      toast.success("Encounter finalized", {
        description: "Returning to queue",
      });
      router.push("/doctor/opd");
    } catch (error: any) {
      console.error("Error finalizing encounter:", error);
      toast.dismiss();
      toast.error("Failed to finalize encounter", {
        description: error.response?.data?.message || "Please try again",
      });
    }
  };

  const handleBack = () => {
    router.push("/doctor/opd");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading encounter...</span>
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Encounter Header */}
      <EncounterHeader
        patientName={appointment.patient.fullName}
        uhid={appointment.patient.uhid || "N/A"}
        onBack={handleBack}
      />

      {/* Vitals Section */}
      <Card className="p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
          Vitals
        </h2>
        <VitalsForm
          initialValues={vitalsData}
          mode={vitalsMode}
          onSubmit={handleVitalsSubmit}
        />
      </Card>

      {/* Clinical Notes Section */}
      <Card className="p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
          Clinical Notes
        </h2>

        <div className="space-y-6">
          {/* Chief Complaint */}
          <div className="space-y-2">
            <Label htmlFor="chiefComplaint" className="text-sm font-medium text-gray-700">
              Chief Complaint
            </Label>
            <Textarea
              id="chiefComplaint"
              placeholder="Enter patient's main complaint..."
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* History of Present Illness */}
          <div className="space-y-2">
            <Label htmlFor="hpi" className="text-sm font-medium text-gray-700">
              History of Present Illness
            </Label>
            <Textarea
              id="hpi"
              placeholder="Describe the history of the present illness..."
              value={historyPresentIllness}
              onChange={(e) => setHistoryPresentIllness(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <Label htmlFor="diagnosis" className="text-sm font-medium text-gray-700">
              Diagnosis
            </Label>
            <Textarea
              id="diagnosis"
              placeholder="Enter diagnosis..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Treatment Plan */}
          <div className="space-y-2">
            <Label htmlFor="treatmentPlan" className="text-sm font-medium text-gray-700">
              Treatment Plan
            </Label>
            <Textarea
              id="treatmentPlan"
              placeholder="Enter treatment plan..."
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Medications/Prescription */}
          <div className="space-y-2">
            <Label htmlFor="medications" className="text-sm font-medium text-gray-700">
              Medications / Prescription
            </Label>
            <Textarea
              id="medications"
              placeholder="Enter prescribed medications..."
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Draft
        </Button>
        <Button
          onClick={handleFinalizeEncounter}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Finalize Encounter
        </Button>
      </div>
    </div>
  );
}
