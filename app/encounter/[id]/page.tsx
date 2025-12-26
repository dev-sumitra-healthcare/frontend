"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, Check, X, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getEncounterDetails, finalizeEncounter, FinalizeEncounterRequest, getDoctorProfile } from "@/lib/api";
import dynamic from "next/dynamic";
import { PrescriptionPDF } from "@/components/prescriptions/PrescriptionPDF";

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
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
  spO2: string;
}

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

  // Form State
  const [healthHistory, setHealthHistory] = useState("");
  const [vitals, setVitals] = useState<Vitals>({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    height: "",
    spO2: "",
  });
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

  // Load encounter data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        
        // Fetch encounter and doctor profile in parallel
        const [resp, doctorResp] = await Promise.all([
          getEncounterDetails(id),
          getDoctorProfile().catch(() => null)
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
          setVitals({
            bloodPressure: b.vitals.bp || b.vitals.bloodPressure || "",
            heartRate: b.vitals.pulse || b.vitals.heartRate || "",
            temperature: b.vitals.temp || b.vitals.temperature || "",
            weight: b.vitals.weight || "",
            height: b.vitals.height || "",
            spO2: b.vitals.spo2 || b.vitals.spO2 || "",
          });
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
          bloodPressure: vitals.bloodPressure,
          heartRate: vitals.heartRate,
          temperature: vitals.temperature,
          respiratoryRate: "",
          oxygenSaturation: vitals.spO2
        },
        doctorRemarks: additionalNotes,
        followUpInstructions: followUp
      };

      await finalizeEncounter(bundle.encounter.id, data);
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
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <div className="p-4 grid grid-cols-12 gap-4 max-h-[calc(100vh-70px)] overflow-y-auto">
        {/* Left Column - Health History */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Health History Summary</h3>
            <textarea
              value={healthHistory}
              onChange={(e) => setHealthHistory(e.target.value)}
              placeholder="health history Summary..."
              className="w-full h-48 p-3 border border-gray-200 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Middle Column - Form Sections */}
        <div className="col-span-6 space-y-4">
          {/* Vitals */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Vitals</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={vitals.bloodPressure}
                onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                placeholder="Blood Pressure"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                type="text"
                value={vitals.heartRate}
                onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                placeholder="Heart Rate"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                type="text"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                placeholder="Temperature"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                type="text"
                value={vitals.weight}
                onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                placeholder="Weight"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                type="text"
                value={vitals.height}
                onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
                placeholder="Height"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                type="text"
                value={vitals.spO2}
                onChange={(e) => setVitals({ ...vitals, spO2: e.target.value })}
                placeholder="SpO2"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <textarea
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="Enter chief complaint..."
              className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <p className="text-sm font-medium text-gray-700 mt-2">Chief Complaint</p>
          </div>

          {/* Symptoms */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Symptoms</h3>
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

        {/* Right Column - AI Summary & Chat */}
        <div className="col-span-4 space-y-4">
          {/* AI Summary */}
          <div className="bg-[#e8f0fc] rounded-xl p-4 shadow-sm min-h-[280px]">
            <h3 className="font-semibold text-gray-900 mb-3">AI Summary Of The Suggestions</h3>
            <div className="text-sm text-gray-600">
              {bundle.aiAnalysis ? (
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
                  AI suggestions will appear here based on the entered symptoms and diagnosis...
                </p>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Chat Window</h3>
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
              Chat Window
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Prescription Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* PDF Preview */}
            <div className="flex-1 overflow-hidden">
              <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
                <PrescriptionPDF
                  patientName={patient.fullName || patient.full_name || patient.name || 'Patient'}
                  patientAge={patientAge}
                  patientGender={patient.gender || patient.demographics?.gender}
                  patientUHID={patient.uhid}
                  date={new Date().toISOString()}
                  doctorName={doctorInfo?.name || 'Doctor'}
                  doctorQualification={doctorInfo?.qualification}
                  doctorRegistration={doctorInfo?.registration}
                  medications={medications.map(m => ({
                    name: m.name,
                    dosage: m.dosage,
                    frequency: m.frequency,
                    duration: m.duration,
                    instructions: ''
                  }))}
                  advice={additionalNotes}
                  tests={investigations ? investigations.split('\n').filter(t => t.trim()).map(t => ({ name: t.trim(), instructions: '' })) : []}
                  followUp={followUp}
                  notes={chiefComplaint ? `Chief Complaint: ${chiefComplaint}` : ''}
                />
              </PDFViewer>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
