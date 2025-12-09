"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Download, Pill, Calendar, User, AlertCircle, Loader2, Activity, FlaskConical } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { getMyPrescriptions, getMyProfile, PatientProfile, type PatientPrescription } from '@/lib/api';
import { PrescriptionPDF } from '@/components/prescriptions/PrescriptionPDF';

// Use the shared type from api.ts
type Prescription = PatientPrescription;

export default function PatientPrescriptionsWidget() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([
      fetchPrescriptions(),
      fetchPatientProfile()
    ]);
  };

  const fetchPatientProfile = async () => {
    try {
      const response = await getMyProfile();
      if (response.data && response.data.status === 'success') {
        setPatientProfile(response.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching patient profile:', err);
      // Don't set error state - profile is optional for PDF generation
    }
  };

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyPrescriptions();
      console.log('Prescriptions API response:', response);
      // Handle API response wrapper
      if (response.data && response.data.status === 'success') {
        setPrescriptions(response.data.data || []);
      } else if (response.data && Array.isArray(response.data)) {
        // Direct data array
        setPrescriptions(response.data);
      } else {
        setPrescriptions([]);
      }
    } catch (err: any) {
      console.error('Error fetching prescriptions:', err);
      setError(err.message || 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const PrescriptionCard = ({ prescription }: { prescription: Prescription }) => {
    const isExpanded = expandedId === prescription.prescriptionId;
    const hasMedications = prescription.medications && prescription.medications.length > 0;
    const hasTests = prescription.tests && prescription.tests.length > 0;

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-white border-b border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-900">{formatDate(prescription.date)}</span>
              </div>
              {prescription.encounterDate && (
                <p className="text-xs text-gray-500 ml-6">Encounter: {formatDate(prescription.encounterDate)}</p>
              )}
            </div>
            <PDFDownloadLink
              document={
                <PrescriptionPDF
                  patientName={patientProfile?.fullName || 'Patient'}
                  patientAge={patientProfile?.dateOfBirth ? calculateAge(patientProfile.dateOfBirth) : undefined}
                  patientGender={patientProfile?.gender}
                  patientUHID={patientProfile?.uhid}
                  date={prescription.date}
                  doctorName={prescription.doctor.fullName}
                  medications={prescription.medications}
                  advice={prescription.advice}
                  tests={prescription.tests}
                  followUp={prescription.followUp}
                />
              }
              fileName={`prescription_${formatDate(prescription.date).replace(/\s/g, '_')}.pdf`}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              {({ loading }) =>
                loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download PDF
                  </>
                )
              }
            </PDFDownloadLink>
          </div>

          <div className="flex items-start gap-2 ml-6">
            <User className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">{prescription.doctor.fullName}</p>
              {prescription.doctor.specialty && (
                <p className="text-xs text-gray-500">{prescription.doctor.specialty}</p>
              )}
            </div>
          </div>

          {prescription.chiefComplaint && (
            <div className="mt-2 ml-6 p-2 bg-purple-50 rounded text-xs text-gray-700">
              <span className="font-medium">Chief Complaint:</span> {prescription.chiefComplaint}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <button
            onClick={() => setExpandedId(isExpanded ? null : prescription.prescriptionId)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {hasMedications && (
                  <span className="flex items-center gap-1">
                    <Pill className="w-4 h-4" />
                    {prescription.medications.length} medication{prescription.medications.length !== 1 ? 's' : ''}
                  </span>
                )}
                {hasTests && (
                  <span className="flex items-center gap-1">
                    <FlaskConical className="w-4 h-4" />
                    {prescription.tests?.length} test{prescription.tests?.length !== 1 ? 's' : ''}
                  </span>
                )}
                {!hasMedications && !hasTests && (
                  <span className="text-gray-500">No medications or tests</span>
                )}
              </div>
              <span className="text-xs text-purple-600 font-medium">
                {isExpanded ? 'Hide Details' : 'View Details'}
              </span>
            </div>
          </button>

          {isExpanded && (
            <div className="mt-4 space-y-4">
              {/* Medications */}
              {hasMedications && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-purple-600" />
                    Medications
                  </h4>
                  <div className="space-y-2">
                    {prescription.medications.map((med, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-900 text-sm mb-1">{med.name}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">Dosage:</span> {med.dosage}
                          </div>
                          <div>
                            <span className="font-medium">Frequency:</span> {med.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {med.duration}
                          </div>
                        </div>
                        {med.instructions && (
                          <p className="mt-2 text-xs text-gray-600">
                            <span className="font-medium">Instructions:</span> {med.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tests */}
              {hasTests && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-purple-600" />
                    Laboratory Tests
                  </h4>
                  <div className="space-y-2">
                    {prescription.tests?.map((test, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="font-medium text-gray-900 text-sm">{test.name}</p>
                        {test.instructions && (
                          <p className="mt-1 text-xs text-gray-600">{test.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advice */}
              {prescription.advice && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    Doctor's Advice
                  </h4>
                  <p className="text-sm text-gray-700 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    {prescription.advice}
                  </p>
                </div>
              )}

              {/* Follow-up */}
              {prescription.followUp && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    Follow-up
                  </h4>
                  <p className="text-sm text-gray-700 p-3 bg-green-50 rounded-lg border border-green-200">
                    {prescription.followUp}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <p className="text-sm text-red-800">{error}</p>
        <button
          onClick={fetchPrescriptions}
          className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 font-medium mb-1">No Prescriptions Yet</p>
        <p className="text-sm text-gray-500">Your prescriptions will appear here after consultations</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((prescription) => (
        <PrescriptionCard key={prescription.prescriptionId} prescription={prescription} />
      ))}
    </div>
  );
}

