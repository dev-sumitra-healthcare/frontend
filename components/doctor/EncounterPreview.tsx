import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VitalsData } from "./VitalsForm";
import StatusBadge from "./StatusBadge";
import { User, Activity, FileText, Pill } from "lucide-react";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
}

interface EncounterPreviewProps {
  patient: {
    name: string;
    uhid: string;
    age?: number;
    gender?: string | null;
  };
  vitals?: {
    bp?: string | number;
    heartRate?: string | number;
    temperature?: string | number;
    weight?: string | number;
    height?: string | number;
    spO2?: string | number;
  };
  clinicalNotes: {
    chiefComplaint: string;
    historyPresentIllness: string;
    diagnosis: string;
    treatmentPlan: string;
  };
  medications: string | Medication[];
}

export default function EncounterPreview({
  patient,
  vitals,
  clinicalNotes,
  medications,
}: EncounterPreviewProps) {
  // Helper to split diagnosis string into badges (assumes comma separated or just displays)
  const diagnosisList = clinicalNotes.diagnosis
    ? clinicalNotes.diagnosis.split(",").map((d) => d.trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Patient Summary Card */}
      <Card className="border-l-4 border-l-blue-600 shadow-sm">
        <CardHeader className="pb-2">
           <div className="flex items-center gap-2 text-blue-700">
             <User className="h-5 w-5" />
             <CardTitle className="text-lg">Patient Summary</CardTitle>
           </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Name</p>
              <p className="font-medium text-gray-900">{patient.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">UHID</p>
              <p className="font-medium text-gray-900">{patient.uhid}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Age / Gender</p>
              <p className="font-medium text-gray-900">
                {patient.age ? `${patient.age} Y` : "N/A"} / {patient.gender || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
              <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vitals Review */}
      <Card className="shadow-sm">
         <CardHeader className="pb-2 border-b bg-gray-50/50">
           <div className="flex items-center gap-2 text-gray-700">
             <Activity className="h-5 w-5" />
             <CardTitle className="text-lg">Vitals Recorded</CardTitle>
           </div>
        </CardHeader>
        <CardContent className="pt-6">
          {vitals ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              <div className="space-y-1">
                <span className="text-sm text-gray-500">Blood Pressure</span>
                <p className="text-xl font-semibold text-gray-900">{vitals.bp || "--"}</p>
                <span className="text-xs text-gray-400">mmHg</span>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-gray-500">Heart Rate</span>
                <p className="text-xl font-semibold text-gray-900">{vitals.heartRate || "--"}</p>
                <span className="text-xs text-gray-400">bpm</span>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-gray-500">Temperature</span>
                <p className="text-xl font-semibold text-gray-900">{vitals.temperature || "--"}</p>
                <span className="text-xs text-gray-400">°F</span>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-gray-500">Weight</span>
                <p className="text-xl font-semibold text-gray-900">{vitals.weight || "--"}</p>
                <span className="text-xs text-gray-400">kg</span>
              </div>
               <div className="space-y-1">
                <span className="text-sm text-gray-500">Height</span>
                <p className="text-xl font-semibold text-gray-900">{vitals.height || "--"}</p>
                <span className="text-xs text-gray-400">cm</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No vitals recorded.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Clinical Notes Review */}
        <Card className="shadow-sm h-full">
          <CardHeader className="pb-2 border-b bg-gray-50/50">
             <div className="flex items-center gap-2 text-gray-700">
               <FileText className="h-5 w-5" />
               <CardTitle className="text-lg">Clinical Notes</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Diagnosis</h4>
              <div className="flex flex-wrap gap-2">
                {diagnosisList.length > 0 ? (
                  diagnosisList.map((d, i) => (
                    <StatusBadge key={i} variant="diagnosis-blue">
                      {d}
                    </StatusBadge>
                  ))
                ) : (
                  <span className="text-gray-400 italic">No diagnosis entered</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-900">Chief Complaint</h4>
              <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 p-3 rounded-md border">
                {clinicalNotes.chiefComplaint || <span className="text-gray-400 italic">None recorded</span>}
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-900">History of Present Illness</h4>
               <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 p-3 rounded-md border">
                {clinicalNotes.historyPresentIllness || <span className="text-gray-400 italic">None recorded</span>}
              </p>
            </div>

             <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-900">Treatment Plan</h4>
               <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 p-3 rounded-md border">
                {clinicalNotes.treatmentPlan || <span className="text-gray-400 italic">None recorded</span>}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Prescription Review */}
        <Card className="shadow-sm h-full">
          <CardHeader className="pb-2 border-b bg-gray-50/50">
            <div className="flex items-center gap-2 text-gray-700">
               <Pill className="h-5 w-5" />
               <CardTitle className="text-lg">Prescription</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="pt-6">
              <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                {medications ? (
                  Array.isArray(medications) ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th className="px-4 py-2 font-medium">Medicine</th>
                            <th className="px-4 py-2 font-medium">Dosage</th>
                            <th className="px-4 py-2 font-medium">Freq</th>
                            <th className="px-4 py-2 font-medium">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {medications.map((med, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2 font-medium text-gray-900">{med.name}</td>
                              <td className="px-4 py-2">{med.dosage}</td>
                              <td className="px-4 py-2">{med.frequency}</td>
                              <td className="px-4 py-2">{med.duration || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-orange-50 p-4 rounded-md border border-orange-100 text-gray-800">
                      {medications}
                    </div>
                  )
                ) : (
                  <span className="text-gray-400 italic">No medications prescribed</span>
                )}
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
