"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/dashboard/Header";
import EncounterForm from "@/components/encounter/EncounterForm";
import AIAssistantWidget from "@/components/encounter/AIAssistantWidget";
import VitalsDisplay from "@/components/encounter/VitalsDisplay";
import HistoryTimeline from "@/components/encounter/HistoryTimeline";
import ExistingPrescriptions from "@/components/encounter/ExistingPrescriptions";
import { getEncounterDetails } from "@/lib/api";

export default function EncounterPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id?: string };
  const [bundle, setBundle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const resp = await getEncounterDetails(id);
        const api = resp.data;
        if (!api?.success) {
          setError(api?.message || "Failed to load encounter");
          return;
        }
        const b = api.data?.bundle;
        if (!b) {
          setError("Encounter bundle missing");
          return;
        }
        // Map patient history to widget format
        const history = Array.isArray(b.medicalHistory)
          ? b.medicalHistory.map((h: any, idx: number) => ({
              id: h.id || `hist-${idx + 1}`,
              date: h.date || h.encounter_date || new Date().toISOString(),
              type: h.type || "Visit",
              title: h.title || h.diagnosis || h.chief_complaint || "Encounter",
              details:
                h.details ||
                h.notes ||
                (h.treatmentPlan ? `Plan: ${h.treatmentPlan}` : ""),
            }))
          : [];

        setBundle({ ...b, medicalHistory: history });
      } catch (err: any) {
        console.error("Error loading encounter:", err);
        if (err?.response?.status === 401) {
          router.push("/doctor/login");
        } else if (err?.response?.status === 404) {
          setError("Appointment not found");
        } else {
          setError("Failed to load encounter data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    // Trigger useEffect
    setTimeout(() => setLoading(false), 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading encounter details...</p>
          <p className="text-sm text-gray-500 mt-2">Appointment ID: {id}</p>
          <p className="text-xs text-green-600 mt-1">Live Data</p>
        </div>
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Encounter</h2>
          <p className="text-gray-600 mb-4">{error || "Encounter data not found."}</p>
          <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-left">
            <p><strong>Appointment ID:</strong> {id}</p>
            <p><strong>Mode:</strong> Live Data</p>
            <p><strong>Status:</strong> Error</p>
          </div>
          <div className="space-y-2">
            <button onClick={retryFetch} className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Try Again</button>
            <button onClick={() => window.history.back()} className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  const patient = bundle.patient || {};
  const headerAllergies = Array.isArray(patient.allergies) && patient.allergies.length > 0 ? `Allergies: ${patient.allergies.join(", ")}` : "No known allergies";

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {/* Sticky Patient Header */}
      <div className="sticky top-0 z-10 bg-white shadow-md p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              {patient.fullName || patient.full_name || "Patient"}
              {patient.dateOfBirth ? 
                `, ${Math.max(0, Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime())/ (365.25*24*60*60*1000)))}` : ''}
              {patient.gender ? ` ${patient.gender}` : ''}
            </h2>
            <p className="text-sm text-gray-600">
              {patient.uhid || "UHID"} | {headerAllergies}
            </p>
          </div>
          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Live Data</div>
        </div>
      </div>

      <main className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Vitals Display - from Triage */}
          <VitalsDisplay 
            vitals={bundle.vitals || bundle.encounterForm?.vitalSigns || null}
            onEdit={() => console.log('Edit vitals')}
          />
          
          {/* Main Encounter Form */}
          <EncounterForm
            data={bundle.encounterForm}
            encounterId={bundle.encounter?.id}
            appointmentId={bundle.encounter?.appointmentId}
            patientName={patient.fullName || patient.full_name}
            patientId={patient.id}
            patient={patient}
          />
          
          {/* Existing Prescriptions Section */}
          {bundle.encounter?.id && (
            <ExistingPrescriptions encounterId={bundle.encounter.id} />
          )}
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <AIAssistantWidget data={bundle.aiAnalysis} />
          <HistoryTimeline 
            history={bundle.medicalHistory || []}
            onViewDetails={(id) => router.push(`/encounter/${id}`)}
          />
        </div>
      </main>
    </div>
  );
}
