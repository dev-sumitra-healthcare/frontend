"use client";

import { useState, useEffect } from "react";
import { Calendar, Eye, Download, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusBadge, { CaseStatusBadge } from "@/components/doctor/StatusBadge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  searchEncounters,
  EncounterSearchResult,
  getEncounterDetails,
  getPrescriptionsByEncounter,
  downloadPrescriptionPDF,
  EncounterDataResponse
} from "@/lib/api";

// Diagnosis color mapping
function getDiagnosisColor(diagnosis: string): "diagnosis-red" | "diagnosis-orange" | "diagnosis-blue" | "diagnosis-purple" {
  const lowerDiag = (diagnosis || "").toLowerCase();
  if (lowerDiag.includes("hypertension") || lowerDiag.includes("cardiac") || lowerDiag.includes("heart") || lowerDiag.includes("fibrillation")) {
    return "diagnosis-red";
  }
  if (lowerDiag.includes("diabetes") || lowerDiag.includes("asthma")) {
    return "diagnosis-orange";
  }
  if (lowerDiag.includes("migraine") || lowerDiag.includes("neurological")) {
    return "diagnosis-purple";
  }
  return "diagnosis-blue";
}

// Map encounter status to case status
function mapStatus(status: string): "completed" | "follow-up" | "under-treatment" {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes("completed") || lowerStatus.includes("finalized")) {
    return "completed";
  }
  if (lowerStatus.includes("follow") || lowerStatus.includes("pending")) {
    return "follow-up";
  }
  return "under-treatment";
}

// Format date for display
function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-CA"); // YYYY-MM-DD format
  } catch {
    return dateString;
  }
}

export default function PastCasesPage() {
  const [cases, setCases] = useState<EncounterSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCases, setTotalCases] = useState(0);
  const [filters, setFilters] = useState({
    patientName: "",
    patientId: "",
    dateFrom: "",
    dateTo: "",
    diagnosis: "",
    medication: "",
    keywords: "",
  });

  // View Modal State
  const [selectedEncounter, setSelectedEncounter] = useState<EncounterDataResponse["data"]["bundle"] | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async (searchFilters?: typeof filters) => {
    try {
      setIsLoading(true);
      const params: Record<string, string | number> = {
        limit: 50,
      };
      
      const f = searchFilters || filters;
      if (f.patientName) params.patientName = f.patientName;
      if (f.patientId) params.patientId = f.patientId;
      if (f.dateFrom) params.dateFrom = f.dateFrom;
      if (f.dateTo) params.dateTo = f.dateTo;
      if (f.diagnosis) params.diagnosis = f.diagnosis;
      if (f.keywords) params.symptoms = f.keywords;

      const response = await searchEncounters(params);
      
      if (response.data.success) {
        setCases(response.data.data.encounters);
        setTotalCases(response.data.data.pagination.total);
      }
    } catch (error) {
      console.error("Error loading past cases:", error);
      toast.error("Failed to load past cases");
      // Keep empty array on error
      setCases([]);
      setTotalCases(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    const cleared = {
      patientName: "",
      patientId: "",
      dateFrom: "",
      dateTo: "",
      diagnosis: "",
      medication: "",
      keywords: "",
    };
    setFilters(cleared);
    loadCases(cleared);
  };

  const handleApplyFilters = () => {
    loadCases(filters);
  };

  const handleViewCase = async (caseItem: EncounterSearchResult) => {
    try {
      setIsViewOpen(true);
      setIsViewLoading(true);
      
      // Use appointmentId to get encounter bundle
      const response = await getEncounterDetails(caseItem.appointmentId);
      if (response.data.success) {
        setSelectedEncounter(response.data.data.bundle);
      } else {
        toast.error("Failed to load case details");
        setIsViewOpen(false);
      }
    } catch (error) {
      console.error("Error viewing case:", error);
      toast.error("Failed to load case details");
      setIsViewOpen(false);
    } finally {
      setIsViewLoading(false);
    }
  };

  const handleDownloadPrescription = async (caseItem: EncounterSearchResult) => {
    try {
      const toastId = toast.loading("Finding prescription...");
      
      // Get prescriptions for this encounter
      const response = await getPrescriptionsByEncounter(caseItem.id);
      
      if (response.data.success && response.data.data.prescriptions && response.data.data.prescriptions.length > 0) {
        // Download the most recent prescription
        const prescription = response.data.data.prescriptions[0];
        toast.dismiss(toastId);
        toast.loading("Downloading PDF...", { id: toastId });
        
        await downloadPrescriptionPDF(prescription.id);
        
        toast.dismiss(toastId);
        toast.success("Download started");
      } else {
        toast.dismiss(toastId);
        toast.error("No prescription found for this case");
      }
    } catch (error) {
      console.error("Error downloading prescription:", error);
      toast.dismiss();
      toast.error("Failed to download prescription");
    }
  };

  // Extract diagnosis names from the diagnosis array
  const getDiagnosisNames = (diagnosis: EncounterSearchResult["diagnosis"]): string[] => {
    if (!diagnosis || !Array.isArray(diagnosis)) return [];
    return diagnosis.map(d => d.description || "Unknown").slice(0, 3);
  };

  // Get symptoms to display (max 3)
  const getSymptomsDisplay = (symptoms: string[] | null): string[] => {
    if (!symptoms || !Array.isArray(symptoms)) return [];
    if (symptoms.length <= 2) return symptoms;
    return [...symptoms.slice(0, 2), `+${symptoms.length - 2} more`];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Past Cases</h1>
          <p className="text-sm text-red-500">Total: {totalCases} cases</p>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Patient Name
            </label>
            <Input
              placeholder="Filter by Patient name"
              value={filters.patientName}
              onChange={(e) => handleFilterChange("patientName", e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Patient ID
            </label>
            <Input
              placeholder="Filter by Patient ID"
              value={filters.patientId}
              onChange={(e) => handleFilterChange("patientId", e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Date From
            </label>
            <div className="relative">
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="bg-white"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Date To
            </label>
            <div className="relative">
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="bg-white"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Diagnosis
            </label>
            <Input
              placeholder="Filter by diagnosis"
              value={filters.diagnosis}
              onChange={(e) => handleFilterChange("diagnosis", e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Medication
            </label>
            <Input
              placeholder="Filter by Medication"
              value={filters.medication}
              onChange={(e) => handleFilterChange("medication", e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Keywords
            </label>
            <Input
              placeholder="Filter by Keywords"
              value={filters.keywords}
              onChange={(e) => handleFilterChange("keywords", e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleApplyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
            >
              Done
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 flex-1"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-2">UHID</div>
            <div className="col-span-2">Patient Name</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-2">Diagnosis</div>
            <div className="col-span-2">Symptoms</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading cases...</span>
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium">No past cases found</p>
            <p className="text-sm text-gray-400 mt-1">
              Cases will appear here after consultations are completed
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {cases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                {/* UHID */}
                <div className="col-span-2 text-sm text-gray-600">
                  {caseItem.patientUhid || caseItem.patientId?.slice(0, 12) || "N/A"}
                </div>

                {/* Patient Name */}
                <div className="col-span-2 font-medium text-gray-900">
                  {caseItem.patientName || "Unknown"}
                </div>

                {/* Date */}
                <div className="col-span-1 text-sm text-gray-600">
                  {formatDate(caseItem.createdAt)}
                </div>

                {/* Diagnosis */}
                <div className="col-span-2 flex flex-wrap gap-1">
                  {getDiagnosisNames(caseItem.diagnosis).length > 0 ? (
                    getDiagnosisNames(caseItem.diagnosis).map((diag, idx) => (
                      <StatusBadge
                        key={idx}
                        variant={getDiagnosisColor(diag)}
                        className="text-xs"
                      >
                        {diag}
                      </StatusBadge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>

                {/* Symptoms */}
                <div className="col-span-2 flex flex-wrap gap-1">
                  {getSymptomsDisplay(caseItem.symptoms).length > 0 ? (
                    getSymptomsDisplay(caseItem.symptoms).map((symptom, idx) => (
                      <StatusBadge
                        key={idx}
                        variant="symptom"
                        className="text-xs"
                      >
                        {symptom}
                      </StatusBadge>
                    ))
                  ) : caseItem.chiefComplaint ? (
                    <StatusBadge variant="symptom" className="text-xs">
                      {caseItem.chiefComplaint.slice(0, 30)}...
                    </StatusBadge>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <CaseStatusBadge status={mapStatus(caseItem.status)} />
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-center gap-2">
                  <button 
                    onClick={() => handleViewCase(caseItem)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDownloadPrescription(caseItem)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Download Prescription"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-3xl w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Case Details</DialogTitle>
          </DialogHeader>
          
          {isViewLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading details...</span>
            </div>
          ) : selectedEncounter ? (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-medium">{selectedEncounter.patient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">UHID</p>
                  <p className="font-medium">{selectedEncounter.patient.uhid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age/Gender</p>
                  <p className="font-medium">
                    {selectedEncounter.patient.demographics.age} Y / {selectedEncounter.patient.demographics.gender}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date().toLocaleDateString()} {/* Date might need to be passed or parsed from updated_at if available */}
                  </p>
                </div>
              </div>

              {/* Clinical Data */}
              <div className="space-y-4">
                {selectedEncounter.encounterForm.chiefComplaint && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Chief Complaint</h3>
                    <p className="text-gray-700 p-3 bg-white border rounded-md">
                      {selectedEncounter.encounterForm.chiefComplaint}
                    </p>
                  </div>
                )}

                {selectedEncounter.encounterForm.diagnosis && selectedEncounter.encounterForm.diagnosis.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Diagnosis</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEncounter.encounterForm.diagnosis.map((d: any, i) => {
                        const diagName = d.name || d.description || "Unknown";
                        return (
                          <StatusBadge key={i} variant={getDiagnosisColor(diagName)}>
                            {diagName}
                          </StatusBadge>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedEncounter.encounterForm.medications && selectedEncounter.encounterForm.medications.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Prescribed Medications</h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th className="px-4 py-2 font-medium">Medicine</th>
                            <th className="px-4 py-2 font-medium">Dosage</th>
                            <th className="px-4 py-2 font-medium">Frequency</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedEncounter.encounterForm.medications.map((med: any, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2">{med.name}</td>
                              <td className="px-4 py-2">{med.dosage || "-"}</td>
                              <td className="px-4 py-2">{med.frequency || med.instructions || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedEncounter.aiAnalysis && selectedEncounter.aiAnalysis.summary && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">AI Summary</h3>
                    <p className="text-sm text-gray-600 italic bg-blue-50 p-3 rounded-md border border-blue-100">
                      {selectedEncounter.aiAnalysis.summary}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No details available
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
