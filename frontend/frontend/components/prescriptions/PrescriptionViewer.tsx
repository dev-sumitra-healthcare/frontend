"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PrescriptionPDF } from "./PrescriptionPDF";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Prescription } from "@/lib/api";

interface PrescriptionViewerProps {
  prescription: Prescription;
  doctorInfo?: {
    name: string;
    qualification?: string;
    registration?: string;
  };
  clinicInfo?: {
    name?: string;
    address?: string;
    phone?: string;
  };
}

export const PrescriptionViewer: React.FC<PrescriptionViewerProps> = ({
  prescription,
  doctorInfo,
  clinicInfo,
}) => {
  const patient = prescription.patients;
  
  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fileName = `prescription_${patient?.full_name.replace(/\s+/g, "_")}_${new Date(prescription.created_at).toISOString().split("T")[0]}.pdf`;

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">
              Prescription for {patient?.full_name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Created on {new Date(prescription.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <PDFDownloadLink
          document={
            <PrescriptionPDF
              patientName={patient?.full_name || "N/A"}
              patientAge={patient?.date_of_birth ? calculateAge(patient.date_of_birth) : undefined}
              patientGender={patient?.gender}
              patientUHID={patient?.uhid}
              date={prescription.created_at}
              doctorName={doctorInfo?.name || "Doctor"}
              doctorQualification={doctorInfo?.qualification}
              doctorRegistration={doctorInfo?.registration}
              clinicName={clinicInfo?.name}
              clinicAddress={clinicInfo?.address}
              clinicPhone={clinicInfo?.phone}
              medications={prescription.content.medications}
              advice={prescription.content.advice}
              tests={prescription.content.tests}
              followUp={prescription.content.followUp}
              notes={prescription.content.notes}
            />
          }
          fileName={fileName}
        >
          {({ loading }) => (
            <Button disabled={loading}>
              <Download className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Download PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      {/* Prescription Summary */}
      <div className="space-y-4">
        {prescription.content.medications && prescription.content.medications.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Medications</h4>
            <div className="space-y-2">
              {prescription.content.medications.map((med, index) => (
                <div key={index} className="text-sm border-l-2 border-primary pl-3 py-1">
                  <div className="font-medium">{med.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {med.dosage} • {med.frequency} • {med.duration}
                    {med.instructions && ` • ${med.instructions}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {prescription.content.advice && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Advice</h4>
            <p className="text-sm text-muted-foreground">{prescription.content.advice}</p>
          </div>
        )}

        {prescription.content.tests && prescription.content.tests.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Tests</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              {prescription.content.tests.map((test, index) => (
                <li key={index}>
                  {test.name}
                  {test.instructions && ` - ${test.instructions}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {prescription.content.followUp && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Follow-up</h4>
            <p className="text-sm text-muted-foreground">{prescription.content.followUp}</p>
          </div>
        )}
      </div>
    </div>
  );
};
