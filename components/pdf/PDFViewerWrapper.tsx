"use client";

import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { PrescriptionPDF } from '@/components/prescriptions/PrescriptionPDF';

interface PDFViewerWrapperProps {
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  patientUHID?: string;
  date: string;
  doctorName: string;
  doctorQualification?: string;
  doctorRegistration?: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  advice?: string;
  tests?: Array<{
    name: string;
    instructions?: string;
  }>;
  followUp?: string;
  notes?: string;
  width?: string;
  height?: string;
  showToolbar?: boolean;
}

const PDFViewerWrapper: React.FC<PDFViewerWrapperProps> = ({
  width = "100%",
  height = "100%",
  showToolbar = true,
  ...pdfProps
}) => {
  return (
    <PDFViewer width={width} height={height} showToolbar={showToolbar}>
      <PrescriptionPDF {...pdfProps} />
    </PDFViewer>
  );
};

export default PDFViewerWrapper;
