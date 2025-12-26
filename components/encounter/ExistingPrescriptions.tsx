"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrescriptionViewer } from "@/components/prescriptions/PrescriptionViewer";
import { getPrescriptionsByEncounter, type Prescription, getDoctorProfile } from "@/lib/api";

interface ExistingPrescriptionsProps {
  encounterId: string;
}

export default function ExistingPrescriptions({ encounterId }: ExistingPrescriptionsProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [doctorInfo, setDoctorInfo] = useState<{ name: string; qualification?: string; registration?: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        setLoading(true);
        
        const [listRes, doctorRes] = await Promise.all([
          getPrescriptionsByEncounter(encounterId).catch(() => null),
          getDoctorProfile().catch(() => null)
        ]);

        if (listRes?.data?.success) {
          const data = listRes.data.data as any;
          setPrescriptions(data.prescriptions || data.results || []);
        }
        
        if (doctorRes?.data?.success) {
          const d = doctorRes.data.data.doctor;
          setDoctorInfo({
            name: d.fullName,
            qualification: d.qualifications?.[0]?.degree,
            registration: d.medicalRegistrationId,
          });
        }
      } catch (error) {
        console.error('Error loading prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPrescriptions();
  }, [encounterId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading existing prescriptions...</p>
        </CardContent>
      </Card>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Existing Prescriptions</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          No prescriptions created yet for this encounter.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Existing Prescriptions</h2>
      {prescriptions.map((prescription) => (
        <PrescriptionViewer
          key={prescription.id}
          prescription={prescription}
          doctorInfo={doctorInfo}
          clinicInfo={undefined}
        />
      ))}
    </div>
  );
}
