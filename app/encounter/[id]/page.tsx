"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, Check, X, Plus, Loader2, Sparkles, Send, Heart, Activity, Thermometer, Scale, Ruler, Wind, LucideIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { 
  getEncounterDetails, 
  finalizeEncounter, 
  FinalizeEncounterRequest, 
  getDoctorProfile,
  invokeAlfaEncounter,
  invokeAlfaChat,
  AlfaRecommendations,
  getVitalsDefinitions,
  getDoctorVitalsConfig,
  VitalDefinition
} from "@/lib/api";
import dynamic from "next/dynamic";
import { PrescriptionPDF } from "@/components/prescriptions/PrescriptionPDF";
import EncounterPreview from "@/components/doctor/EncounterPreview";

// Dynamically import PDFViewer to avoid SSR issues
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div> }
);

// Types
interface Medication {
  id: string;
  name: string;
  dosage: string;
  duration: string;
  frequency: string;
}

interface Vitals {
  [key: string]: string;
}

// Icon mapping for vitals
const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  activity: Activity,
  thermometer: Thermometer,
  scale: Scale,
  ruler: Ruler,
  wind: Wind,
};

// Draft data structure for localStorage
interface EncounterFormDraft {
  healthHistory: string;
  vitals: Vitals;
  chiefComplaint: string;
  symptoms: string[];
  diagnoses: string[];
  medications: Medication[];
  investigations: string;
  additionalNotes: string;
  followUp: string;
  savedAt: number; // timestamp
}

// Helper to get storage key for a specific encounter
const getStorageKey = (encounterId: string) => `encounter_draft_${encounterId}`;


export default function EncounterPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id?: string };
  
  // Data loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bundle, setBundle] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState<{ name: string; qualification?: string; registration?: string } | null>(null);

  // Derived state: Check if encounter is already finalized (read-only)
  const isFinalized = bundle?.encounter?.status === 'completed' || bundle?.encounter?.status === 'finalized';

  // Form State
  const [healthHistory, setHealthHistory] = useState("");
  const [vitals, setVitals] = useState<Vitals>({});
  const [enabledVitals, setEnabledVitals] = useState<VitalDefinition[]>([]);
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState("");
  const [diagnoses, setDiagnoses] = useState<string[]>([]);
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [investigations, setInvestigations] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [followUp, setFollowUp] = useState("");

  // Medication form state
  const [showMedForm, setShowMedForm] = useState(false);
  const [medForm, setMedForm] = useState({
    name: "",
    dosage: "",
    duration: "",
    frequency: "",
  });

  // Alfa AI State
  const [isAlfaLoading, setIsAlfaLoading] = useState(false);
  const [alfaSummary, setAlfaSummary] = useState<string | null>(null);
  const [alfaRecommendations, setAlfaRecommendations] = useState<AlfaRecommendations | null>(null);
  const [alfaEncId, setAlfaEncId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isAiPanelExpanded, setIsAiPanelExpanded] = useState(false); // AI panels collapsed initially

  // Load encounter data and vitals config
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        
        // Fetch encounter, doctor profile, and vitals config in parallel
        const [resp, doctorResp, vitalsConfigResp] = await Promise.all([
          getEncounterDetails(id),
          getDoctorProfile().catch(() => null),
          getDoctorVitalsConfig().catch(() => null)
        ]);
        
        // Set doctor info
        if (doctorResp?.data?.success) {
          const doc = doctorResp.data.data?.doctor || doctorResp.data.data;
          setDoctorInfo({
            name: doc?.fullName || doc?.full_name || 'Doctor',
            qualification: doc?.qualification || doc?.qualifications,
            registration: doc?.registrationNumber || doc?.registration_number || doc?.medicalRegistrationId
          });
        }
        
        // Set vitals configuration
        if (vitalsConfigResp?.data?.data?.vitalsConfig) {
          const config = vitalsConfigResp.data.data.vitalsConfig;
          const enabled = config.filter((v: any) => v.isEnabled === true);
          setEnabledVitals(enabled);
        } else {
          // Fallback: fetch all vitals definitions
          try {
            const allVitals = await getVitalsDefinitions();
            setEnabledVitals(allVitals.data.data.vitals);
          } catch {
            console.warn('Could not fetch vitals definitions');
          }
        }
        
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
        setBundle(b);
        
        // Pre-fill form with existing data
        if (b.encounterForm) {
          setChiefComplaint(b.encounterForm.chiefComplaint || "");
          if (b.encounterForm.presentingSymptoms) {
            setSymptoms(b.encounterForm.presentingSymptoms);
          }
        }
        if (b.vitals) {
          // Map API vitals to our dynamic vitals state
          const vitalsFromApi: Vitals = {};
          if (b.vitals.bp || b.vitals.bloodPressure) vitalsFromApi.bp = b.vitals.bp || b.vitals.bloodPressure || "";
          if (b.vitals.pulse || b.vitals.heartRate) vitalsFromApi.pulse = String(b.vitals.pulse || b.vitals.heartRate || "");
          if (b.vitals.temp || b.vitals.temperature) vitalsFromApi.temp = String(b.vitals.temp || b.vitals.temperature || "");
          if (b.vitals.weight) vitalsFromApi.weight = String(b.vitals.weight || "");
          if (b.vitals.height) vitalsFromApi.height = String(b.vitals.height || "");
          if (b.vitals.spo2 || b.vitals.spO2) vitalsFromApi.spo2 = String(b.vitals.spo2 || b.vitals.spO2 || "");
          setVitals(vitalsFromApi);
        }
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

  // localStorage: Load draft on mount (after API data is loaded)
  useEffect(() => {
    if (!id || loading || !bundle) return;
    
    try {
      const storageKey = getStorageKey(id);
      const savedDraft = localStorage.getItem(storageKey);
      if (savedDraft) {
        const draft: EncounterFormDraft = JSON.parse(savedDraft);
        // Only restore if draft is reasonably recent (< 24h)
        const isRecent = Date.now() - draft.savedAt < 24 * 60 * 60 * 1000;
        if (isRecent) {
          console.log("[EncounterPage] Restoring draft from localStorage");
          if (draft.healthHistory) setHealthHistory(draft.healthHistory);
          if (draft.vitals) setVitals(draft.vitals);
          if (draft.chiefComplaint) setChiefComplaint(draft.chiefComplaint);
          if (draft.symptoms?.length) setSymptoms(draft.symptoms);
          if (draft.diagnoses?.length) setDiagnoses(draft.diagnoses);
          if (draft.medications?.length) setMedications(draft.medications);
          if (draft.investigations) setInvestigations(draft.investigations);
          if (draft.additionalNotes) setAdditionalNotes(draft.additionalNotes);
          if (draft.followUp) setFollowUp(draft.followUp);
        }
      }
    } catch (err) {
      console.error("[EncounterPage] Error loading draft:", err);
    }
  }, [id, loading, bundle]);

  // localStorage: Save draft on form change (debounced)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!id || loading) return;
    
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce save by 1 second
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const draft: EncounterFormDraft = {
          healthHistory,
          vitals,
          chiefComplaint,
          symptoms,
          diagnoses,
          medications,
          investigations,
          additionalNotes,
          followUp,
          savedAt: Date.now(),
        };
        localStorage.setItem(getStorageKey(id), JSON.stringify(draft));
      } catch (err) {
        console.error("[EncounterPage] Error saving draft:", err);
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [id, loading, healthHistory, vitals, chiefComplaint, symptoms, diagnoses, medications, investigations, additionalNotes, followUp]);

  // Handlers
  const addSymptom = () => {
    if (symptomInput.trim()) {
      setSymptoms([...symptoms, symptomInput.trim()]);
      setSymptomInput("");
    }
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const addDiagnosis = () => {
    if (diagnosisInput.trim()) {
      setDiagnoses([...diagnoses, diagnosisInput.trim()]);
      setDiagnosisInput("");
    }
  };

  const removeDiagnosis = (index: number) => {
    setDiagnoses(diagnoses.filter((_, i) => i !== index));
  };

  const addMedication = () => {
    if (medForm.name.trim()) {
      setMedications([
        ...medications,
        {
          id: Date.now().toString(),
          ...medForm,
        },
      ]);
      setMedForm({ name: "", dosage: "", duration: "", frequency: "" });
      setShowMedForm(false);
    }
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  const handleSubmit = async () => {
    if (!bundle?.encounter?.id) {
      toast.error("Missing encounter ID");
      return;
    }
    
    if (!chiefComplaint.trim()) {
      toast.error("Chief complaint is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const data: FinalizeEncounterRequest = {
        appointmentId: id,
        chiefComplaint,
        presentingSymptoms: symptoms,
        diagnosis: diagnoses.map(d => ({ code: "", description: d, confidence: "High" })),
        medications: medications.map(m => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          instructions: ""
        })),
        vitalSigns: {
          bloodPressure: vitals.bp || "",
          heartRate: vitals.pulse || "",
          temperature: vitals.temp || "",
          respiratoryRate: "",
          oxygenSaturation: vitals.spo2 || ""
        },
        doctorRemarks: additionalNotes,
        followUpInstructions: followUp
      };

      await finalizeEncounter(bundle.encounter.id, data);
      
      // Clear localStorage draft on successful submit
      if (id) {
        localStorage.removeItem(getStorageKey(id));
      }
      
      toast.success("Encounter submitted successfully!");
      router.push("/doctor/dashboard");
    } catch (error) {
      console.error("Error submitting encounter:", error);
      toast.error("Failed to submit encounter");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    // Check if there's content to preview
    if (medications.length === 0 && !additionalNotes.trim() && !followUp.trim()) {
      toast.error('Please add medications, notes, or follow-up instructions to preview');
      return;
    }
    setShowPreview(true);
  };

  // Alfa AI - Invoke Encounter Assessment
  const handleAlfaInvoke = async () => {
    if (!chiefComplaint.trim()) {
      toast.error("Please enter a chief complaint first.");
      return;
    }
    if (!id) {
      toast.error("Missing encounter ID");
      return;
    }

    setIsAlfaLoading(true);
    try {
      const patient = bundle?.patient || {};
      const patientAge = patient.dateOfBirth || patient.date_of_birth
        ? Math.max(0, Math.floor((Date.now() - new Date(patient.dateOfBirth || patient.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)))
        : 20;

      const complaintText = `Patient: ${patientAge}yo ${patient.gender || 'unknown'}. Chief Complaint: ${chiefComplaint}. ${symptoms.length > 0 ? `Symptoms: ${symptoms.join(', ')}.` : ''}`;
      
      const response = await invokeAlfaEncounter({
        user_id: patient.id || patient.uhid || 'unknown',
        enc_id: id,
        complaint: complaintText,
        vitals: {
          bp: vitals.bloodPressure || null,
          hr: vitals.heartRate || null,
          temp: vitals.temperature || null,
          weight: vitals.weight || null,
          height: vitals.height || null,
          spo2: vitals.spO2 || null,
        },
      });

      if (response.data) {
        const data = response.data;
        setAlfaEncId(data.enc_id);
        setAlfaSummary(data.summary || data.diagnosis);
        setAlfaRecommendations(data.recommendations);

        // Prefill Diagnosis
        if (data.diagnosis) {
          setDiagnoses([data.diagnosis]);
        }
        
        // Prefill Medications
        if (data.medications?.length) {
          setMedications(data.medications.map((m, i) => ({
            id: `alfa-${i}-${Date.now()}`,
            name: m.name,
            dosage: m.dosage || '',
            frequency: m.frequency || '',
            duration: m.duration || ''
          })));
        }
        
        // Prefill Investigations/Tests
        if (data.tests?.length) {
          setInvestigations(data.tests.map(t => `${t.name}${t.reason ? ` - ${t.reason}` : ''}`).join('\n'));
        }
        
        // Prefill Additional Notes from recommendations
        const recommendations = [];
        if (data.recommendations?.lifestyle?.length) {
          recommendations.push(`Lifestyle: ${data.recommendations.lifestyle.join(', ')}`);
        }
        if (data.recommendations?.diet?.length) {
          recommendations.push(`Diet: ${data.recommendations.diet.join(', ')}`);
        }
        if (data.recommendations?.exercises?.length) {
          recommendations.push(`Exercises: ${data.recommendations.exercises.join(', ')}`);
        }
        if (recommendations.length) {
          setAdditionalNotes(recommendations.join('\n'));
        }

        // Expand AI panels after successful invocation
        setIsAiPanelExpanded(true);

        toast.success("AI suggestions applied to form!");
      }
    } catch (err: unknown) {
      console.error("Alfa Invoke error:", err);
      toast.error("Failed to get AI suggestions. Please try again.");
    } finally {
      setIsAlfaLoading(false);
    }
  };

  // Alfa AI - Chat Handler
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    if (!alfaEncId) {
      toast.error("Please invoke Alfa AI first to start a chat session.");
      return;
    }

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const resp = await invokeAlfaChat(alfaEncId, { user_query: userMessage });
      setChatMessages(prev => [...prev, { role: 'ai', text: resp.data.answer }]);
    } catch (err) {
      console.error("Chat error:", err);
      toast.error("Chat failed. Please try again.");
      setChatMessages(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't process your request. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8f4fc] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-lg text-gray-600">Loading encounter...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !bundle) {
    return (
      <div className="min-h-screen bg-[#e8f4fc] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || "Encounter not found"}</p>
          <Link
            href="/doctor/opd"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Queue
          </Link>
        </div>
      </div>
    );
  }

  const patient = bundle.patient || {};
  const patientAge = patient.dateOfBirth || patient.date_of_birth
    ? Math.max(0, Math.floor((Date.now() - new Date(patient.dateOfBirth || patient.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)))
    : 20;

  return (
    <div className="min-h-screen bg-[#e8f4fc]">
      {/* Header */}
      <header className="bg-[#e8f4fc] px-4 py-3 flex items-center justify-between border-b border-[#d0e8f5]">
        <div className="flex items-center gap-6">
          <Link
            href="/doctor/opd"
            className="flex items-center gap-1 text-red-500 font-medium hover:text-red-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Queue
          </Link>
          <div className="flex items-center gap-4">
            <div>
              <p className="font-semibold text-gray-900">
                {patient.fullName || patient.full_name || "Robert Wilson"}
              </p>
              <p className="text-xs text-gray-500">
                UHID: {patient.uhid || "UHID2024001"}
              </p>
            </div>
            <span className="text-gray-700">Age: {patientAge}</span>
            <span className="text-gray-700">Gender: {patient.gender || "M"}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isFinalized ? (
            <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium">
              ✓ Encounter Finalized
            </span>
          ) : (
            <>
              {showPreview ? (
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Edit
                </button>
              ) : (
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {isSubmitting ? "Submitting..." : showPreview ? "Finalize Encounter" : "Submit"}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      {showPreview ? (
        <div className="p-4 max-w-5xl mx-auto h-[calc(100vh-70px)] overflow-y-auto">
          <EncounterPreview
            patient={{
              name: patient.fullName || patient.full_name || "Patient",
              uhid: patient.uhid || "N/A",
              age: patientAge,
              gender: patient.gender
            }}
            vitals={{
              bp: vitals.bp || '',
              heartRate: vitals.pulse || '',
              temperature: vitals.temp || '',
              weight: vitals.weight || '',
              height: vitals.height || '',
              spO2: vitals.spo2 || ''
            }}
            clinicalNotes={{
              chiefComplaint,
              historyPresentIllness: healthHistory, // Using health history as HPI for now, or combine
              diagnosis: diagnoses.join(", "),
              treatmentPlan: additionalNotes // or followUp
            }}
            medications={medications}
          />
        </div>
      ) : (
      <div className="p-4 grid grid-cols-12 gap-4 max-h-[calc(100vh-70px)] overflow-y-auto">
        {/* Left Column - Health History */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Health History Summary</h3>
            <textarea
              value={healthHistory}
              onChange={(e) => setHealthHistory(e.target.value)}
              placeholder="health history Summary..."
              disabled={isFinalized}
              className="w-full h-48 p-3 border border-gray-200 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Middle Column - Form Sections */}
        <div className={`${isAiPanelExpanded || isAlfaLoading ? 'col-span-6' : 'col-span-10'} space-y-4`}>
          {/* Vitals */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Vitals</h3>
            {enabledVitals.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {enabledVitals.map((vital) => {
                  const IconComponent = iconMap[vital.icon || 'activity'] || Activity;
                  return (
                    <div key={vital.key} className="flex items-center gap-2">
                      <IconComponent className={`w-4 h-4 ${vital.color || 'text-gray-400'}`} />
                      <input
                        type={vital.input_type === 'text' ? 'text' : 'text'}
                        value={vitals[vital.key] || ''}
                        onChange={(e) => setVitals({ ...vitals, [vital.key]: e.target.value })}
                        placeholder={vital.name}
                        disabled={isFinalized}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={vitals.bp || ''} onChange={(e) => setVitals({ ...vitals, bp: e.target.value })} placeholder="Blood Pressure" disabled={isFinalized} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100" />
                <input type="text" value={vitals.pulse || ''} onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })} placeholder="Heart Rate" disabled={isFinalized} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                <input type="text" value={vitals.temp || ''} onChange={(e) => setVitals({ ...vitals, temp: e.target.value })} placeholder="Temperature" disabled={isFinalized} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                <input type="text" value={vitals.weight || ''} onChange={(e) => setVitals({ ...vitals, weight: e.target.value })} placeholder="Weight" disabled={isFinalized} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                <input type="text" value={vitals.height || ''} onChange={(e) => setVitals({ ...vitals, height: e.target.value })} placeholder="Height" disabled={isFinalized} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                <input type="text" value={vitals.spo2 || ''} onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })} placeholder="SpO2" disabled={isFinalized} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            )}
          </div>

          {/* Chief Complaint & Symptoms (Combined) */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Chief Complaint & Symptoms</h3>
              <button
                onClick={handleAlfaInvoke}
                disabled={isFinalized || isAlfaLoading || !chiefComplaint.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAlfaLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isAlfaLoading ? "Analyzing..." : "Alfa Invoke"}
              </button>
            </div>
            <textarea
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="Enter chief complaint and describe patient presentation..."
              disabled={isFinalized}
              className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 mb-3 disabled:bg-gray-100"
            />
            
            {/* Symptoms Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSymptom()}
                placeholder="Add symptom..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                onClick={addSymptom}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Add
              </button>
            </div>
            {symptoms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {symptom}
                    <button onClick={() => removeSymptom(index)} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Diagnosis */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Diagnosis</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={diagnosisInput}
                onChange={(e) => setDiagnosisInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addDiagnosis()}
                placeholder="Add diagnosis..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                onClick={addDiagnosis}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Add
              </button>
            </div>
            {diagnoses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {diagnoses.map((diagnosis, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                  >
                    {diagnosis}
                    <button onClick={() => removeDiagnosis(index)} className="hover:text-red-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Medications */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Medications</h3>
              <button
                onClick={() => setShowMedForm(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Add Medication
              </button>
            </div>

            {showMedForm && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={medForm.name}
                    onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                    placeholder="Medicine name"
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                  <input
                    type="text"
                    value={medForm.dosage}
                    onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                    placeholder="Dosage"
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                  <input
                    type="text"
                    value={medForm.duration}
                    onChange={(e) => setMedForm({ ...medForm, duration: e.target.value })}
                    placeholder="Duration"
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                  <input
                    type="text"
                    value={medForm.frequency}
                    onChange={(e) => setMedForm({ ...medForm, frequency: e.target.value })}
                    placeholder="Frequency"
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addMedication}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowMedForm(false)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {!showMedForm && medications.length === 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-400">
                  Medicine name
                </span>
                <span className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-400">
                  Dosage
                </span>
                <span className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-400">
                  Duration
                </span>
                <span className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-400">
                  Frequency
                </span>
              </div>
            )}

            {medications.length > 0 && (
              <div className="space-y-2">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between p-2 bg-purple-50 rounded-lg"
                  >
                    <div className="flex gap-4 text-sm">
                      <span className="font-medium text-purple-900">{med.name}</span>
                      <span className="text-purple-700">{med.dosage}</span>
                      <span className="text-purple-700">{med.duration}</span>
                      <span className="text-purple-700">{med.frequency}</span>
                    </div>
                    <button
                      onClick={() => removeMedication(med.id)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Investigations */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Investigations</h3>
            <textarea
              value={investigations}
              onChange={(e) => setInvestigations(e.target.value)}
              placeholder="List investigations to be done..."
              className="w-full h-20 p-3 border border-gray-200 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Additional Notes</h3>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Add any additional notes..."
              className="w-full h-20 p-3 border border-gray-200 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Follow Up */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Follow Up</h3>
            <input
              type="text"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="e.g., After 1 week, After 2 weeks"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Column - AI Summary & Chat (Only visible after Alfa Invoke) */}
        {(isAiPanelExpanded || isAlfaLoading) && (
          <div className="col-span-4 space-y-4">
            {/* AI Summary - Expanded */}
            <div className="bg-gradient-to-br from-[#e8f0fc] to-[#f0e8fc] rounded-xl p-4 shadow-sm min-h-[280px] transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">AI Summary Of The Suggestions</h3>
              </div>
              <div className="text-sm text-gray-600">
                {isAlfaLoading ? (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing patient data...</span>
                  </div>
                ) : alfaSummary ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-white/60 rounded-lg">
                      <p className="font-medium text-gray-800 mb-1">Diagnosis</p>
                      <p>{alfaSummary}</p>
                    </div>
                    {alfaRecommendations && (
                      <div className="space-y-2">
                        {alfaRecommendations.lifestyle?.length > 0 && (
                          <div className="p-2 bg-green-50 rounded-lg">
                            <p className="font-medium text-green-800 text-xs mb-1">Lifestyle</p>
                            <ul className="text-xs space-y-0.5">
                              {alfaRecommendations.lifestyle.map((r, i) => (
                                <li key={i}>• {r}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {alfaRecommendations.diet?.length > 0 && (
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <p className="font-medium text-orange-800 text-xs mb-1">Diet</p>
                            <ul className="text-xs space-y-0.5">
                              {alfaRecommendations.diet.map((r, i) => (
                                <li key={i}>• {r}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {alfaRecommendations.exercises?.length > 0 && (
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <p className="font-medium text-blue-800 text-xs mb-1">Exercises</p>
                            <ul className="text-xs space-y-0.5">
                              {alfaRecommendations.exercises.map((r, i) => (
                                <li key={i}>• {r}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : bundle?.aiAnalysis ? (
                  <div className="space-y-2">
                    {bundle.aiAnalysis.summary && <p>{bundle.aiAnalysis.summary}</p>}
                    {bundle.aiAnalysis.suggestions && (
                      <ul className="list-disc pl-4 space-y-1">
                        {bundle.aiAnalysis.suggestions.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    AI analysis complete. Results displayed above.
                  </p>
                )}
              </div>
            </div>

            {/* Chat Window - Expanded */}
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col transition-all duration-300" style={{ minHeight: '300px' }}>
              <div className="flex items-center gap-2 mb-3">
                <Send className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Chat with Alfa AI</h3>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-3 max-h-48">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    <span>Ask follow-up questions about the diagnosis...</span>
                  </div>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg text-sm ${
                        msg.role === 'user'
                          ? 'bg-blue-100 text-blue-900 ml-4'
                          : 'bg-gray-100 text-gray-800 mr-4'
                      }`}
                    >
                      <span className="font-medium text-xs block mb-0.5">
                        {msg.role === 'user' ? 'You' : 'Alfa AI'}
                      </span>
                      {msg.text}
                    </div>
                  ))
                )}
                {isChatLoading && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm p-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ask a follow-up question..."
                  disabled={!alfaEncId || isChatLoading}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
                <button
                  onClick={handleSendChat}
                  disabled={!alfaEncId || isChatLoading || !chatInput.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Prescription Preview Modal (Removed) */}

    </div>
  );
}
