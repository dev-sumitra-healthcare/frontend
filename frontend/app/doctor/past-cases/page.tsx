"use client";

import { useState, useEffect } from "react";
import { Calendar, Eye, Download, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusBadge, { CaseStatusBadge } from "@/components/doctor/StatusBadge";
import { searchEncounters, EncounterSearchResult } from "@/lib/api";
import { toast } from "sonner";

// Diagnosis color mapping
function getDiagnosisColor(diagnosis: string): "diagnosis-red" | "diagnosis-orange" | "diagnosis-blue" | "diagnosis-purple" {
  const lowerDiag = diagnosis.toLowerCase();
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
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
