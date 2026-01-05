
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import dynamic from 'next/dynamic';
import { finalizeEncounter, FinalizeEncounterRequest, createPrescription, CreatePrescriptionRequest, getTemplates, type PrescriptionTemplate, getDoctorProfile } from "@/lib/api";

// Dynamic import for PDF components
const PDFViewerWrapper = dynamic(
  () => import("@/components/pdf/PDFViewerWrapper"),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading PDF preview...</div>
  }
);

// Define the unified schema for encounter and prescription
const encounterFormSchema = z.object({
  chiefComplaint: z.string().min(1, "Chief complaint is required"),
  presentingSymptoms: z.array(z.string()).default([]),
  diagnosis: z.array(z.object({ 
    code: z.string(), 
    description: z.string(),
    confidence: z.string().default("High")
  })).default([]),
  medications: z.array(
    z.object({
      name: z.string(),
      dosage: z.string(),
      frequency: z.string(),
      duration: z.string().default(""),
      instructions: z.string().default("")
    })
  ).default([]),
  vitalSigns: z.object({
    bloodPressure: z.string().default(""),
    heartRate: z.string().default(""),
    temperature: z.string().default(""),
    respiratoryRate: z.string().default(""),
    oxygenSaturation: z.string().default(""),
    weight: z.string().default(""),
    height: z.string().default("")
  }).default({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: ''
  }),
  doctorRemarks: z.string().default(""),
  followUpInstructions: z.string().default(""),
  // Prescription-specific fields
  templateId: z.string().optional().nullable(),
  advice: z.string().default(""),
  tests: z.array(
    z.object({
      name: z.string().min(1, "Test name required"),
      instructions: z.string().default("")
    })
  ).default([]),
  notes: z.string().default(""),
});

type EncounterFormValues = z.infer<typeof encounterFormSchema>;

interface EncounterFormProps {
  data?: Partial<EncounterFormValues>;
  encounterId?: string;
  appointmentId?: string;
  patientName?: string;
  patientId?: string;
  patient?: {
    id: string;
    fullName?: string;
    full_name?: string;
    uhid?: string;
    dateOfBirth?: string;
    date_of_birth?: string;
    gender?: string;
  };
}

export default function EncounterForm({ data = {}, encounterId, appointmentId, patientName, patientId, patient }: EncounterFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
  const [doctorInfo, setDoctorInfo] = useState<{ name: string; qualification?: string; registration?: string }>();
  const [showPrescriptionPreview, setShowPrescriptionPreview] = useState(false);
  const [isPrescriptionReady, setIsPrescriptionReady] = useState(false);
  
  // Dynamic section ordering based on doctor preferences
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'vitals', 'diagnosis', 'medications', 'remarks', 'prescription'
  ]);
  
  // Vitals order from doctor preferences
  const [vitalsOrder, setVitalsOrder] = useState<string[]>([
    'bp', 'pulse', 'temp', 'weight', 'height', 'spo2'
  ]);
  
  // Vitals field configuration
  const vitalsConfig: Record<string, { label: string; field: keyof typeof form.getValues.arguments[0]['vitalSigns']; placeholder: string }> = {
    bp: { label: 'Blood Pressure', field: 'bloodPressure', placeholder: '120/80 mmHg' },
    pulse: { label: 'Pulse Rate', field: 'heartRate', placeholder: '72 bpm' },
    temp: { label: 'Temperature', field: 'temperature', placeholder: '98.6°F' },
    weight: { label: 'Weight', field: 'weight' as any, placeholder: 'kg' },
    height: { label: 'Height', field: 'height' as any, placeholder: 'cm' },
    spo2: { label: 'O2 Saturation', field: 'oxygenSaturation', placeholder: '98%' },
    respiratory: { label: 'Respiratory Rate', field: 'respiratoryRate', placeholder: '16/min' },
  };

  const form = useForm<EncounterFormValues>({
    resolver: zodResolver(encounterFormSchema) as any, // Type assertion due to zod inference
    defaultValues: {
      chiefComplaint: data.chiefComplaint || '',
      presentingSymptoms: data.presentingSymptoms || [],
      diagnosis: data.diagnosis || [],
      medications: data.medications || [],
      vitalSigns: data.vitalSigns || {
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        respiratoryRate: '',
        oxygenSaturation: '',
        weight: '',
        height: ''
      },
      doctorRemarks: data.doctorRemarks || '',
      followUpInstructions: data.followUpInstructions || '',
      // Prescription fields
      templateId: data.templateId || undefined,
      advice: data.advice || '',
      tests: data.tests || [],
      notes: data.notes || '',
    },
  });

  const { fields: medicationFields, append: appendMedication, remove: removeMedication } = useFieldArray({
    control: form.control,
    name: "medications",
  });

  const { fields: diagnosisFields, append: appendDiagnosis, remove: removeDiagnosis } = useFieldArray({
    control: form.control,
    name: "diagnosis",
  });

  const { fields: testFields, append: appendTest, remove: removeTest } = useFieldArray({
    control: form.control,
    name: "tests",
  });

  // Load templates and doctor info
  useEffect(() => {
    const loadData = async () => {
      try {
        const [templatesRes, doctorRes] = await Promise.all([
          getTemplates({ page: 1, limit: 50 }).catch(() => null),
          getDoctorProfile().catch(() => null)
        ]);

        if (templatesRes?.data?.success) {
          setTemplates(templatesRes.data.data.results || []);
        }
        
        if (doctorRes?.data?.success) {
          const d = doctorRes.data.data.doctor;
          setDoctorInfo({
            name: d.fullName,
            qualification: d.qualifications?.[0]?.degree,
            registration: d.medicalRegistrationId,
          });
          
          // Load section order from preferences
          const prefs = (d as any).ui_preferences;
          if (prefs?.encounterFormOrder?.length) {
            setSectionOrder(prefs.encounterFormOrder);
          }
          // Load vitals order from preferences
          if (prefs?.vitalsOrder?.length) {
            setVitalsOrder(prefs.vitalsOrder);
          }
        }
      } catch (error) {
        console.error('Error loading templates/doctor info:', error);
      }
    };
    
    loadData();
  }, []);

  // Apply template logic
  const applyTemplate = (tplId?: string | null) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;
    const sections = tpl.elements?.sections || [];

    // Prepare defaults based on sections
    const updates: Partial<EncounterFormValues> = {};

    sections.forEach((s) => {
      switch (s.type) {
        case "advice":
          updates.advice = s.content || "";
          break;
        case "tests":
          // If template has content, consider it one default test entry
          if (s.content) {
            updates.tests = [{ name: s.title || "Test", instructions: s.content }];
          }
          break;
        case "custom":
          // Put into notes by default
          updates.notes = [form.getValues("notes"), s.content].filter(Boolean).join("\n");
          break;
        case "medications":
        default:
          // Leave medications as is; template can predefine headers only
          break;
      }
    });

    // Apply updates
    if (updates.advice !== undefined) form.setValue("advice", updates.advice);
    if (updates.tests !== undefined) {
      form.setValue("tests", updates.tests);
    }
    if (updates.notes !== undefined) form.setValue("notes", updates.notes);
  };

  // Helper function to check if prescription has content
  const hasPrescriptionContent = () => {
    const values = form.getValues();
    const hasAdvice = values.advice?.trim();
    const hasTests = values.tests && values.tests.length > 0 && values.tests.some(t => t.name?.trim());
    const hasNotes = values.notes?.trim();
    const hasMedications = values.medications && values.medications.length > 0 && values.medications.some(m => m.name?.trim());
    return hasAdvice || hasTests || hasNotes || hasMedications;
  };

  // Handle prescription preview
  const handlePrescriptionPreview = () => {
    if (!showPrescriptionPreview && hasPrescriptionContent()) {
      setShowPrescriptionPreview(true);
      setIsPrescriptionReady(true);
    } else if (showPrescriptionPreview) {
      setShowPrescriptionPreview(false);
    } else {
      toast.error('Please add some prescription content (medications, advice, tests, or notes) to preview.');
    }
  };

  // Get patient info for PDF
  const patientInfo = patient || {
    id: patientId || '',
    fullName: patientName,
    full_name: patientName,
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      const values = form.getValues();

      // Dynamically import PDF components
      const { PrescriptionPDF } = await import('@/components/prescriptions/PrescriptionPDF');
      const { pdf } = await import('@react-pdf/renderer');

      const pdfDoc = (
        <PrescriptionPDF
          patientName={patientInfo.fullName || patientInfo.full_name || 'Patient'}
          patientAge={
            patientInfo.dateOfBirth || patientInfo.date_of_birth
              ? Math.max(
                  0,
                  Math.floor(
                    (Date.now() - new Date(patientInfo.dateOfBirth || patientInfo.date_of_birth!).getTime()) /
                    (365.25 * 24 * 60 * 60 * 1000)
                  )
                )
              : undefined
          }
          patientGender={patientInfo.gender}
          patientUHID={patientInfo.uhid}
          date={new Date().toISOString()}
          doctorName={doctorInfo?.name || 'Doctor'}
          doctorQualification={doctorInfo?.qualification}
          doctorRegistration={doctorInfo?.registration}
          medications={values.medications}
          advice={values.advice}
          tests={values.tests}
          followUp={values.followUpInstructions}
          notes={values.notes}
        />
      );

      const blob = await pdf(pdfDoc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription-${patientInfo.fullName || 'patient'}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Prescription PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download prescription PDF.');
    }
  };

  const onSubmit = async (values: EncounterFormValues) => {
    if (!encounterId) {
      console.error('No encounter ID provided');
      setSubmitError('Cannot finalize encounter: missing encounter ID');
      return;
    }

    if (!patientId) {
      console.error('No patient ID provided');
      setSubmitError('Cannot create prescription: missing patient ID');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Transform form data to match API expectations
      const finalizeData: FinalizeEncounterRequest = {
        appointmentId,
        chiefComplaint: values.chiefComplaint,
        presentingSymptoms: values.presentingSymptoms,
        diagnosis: values.diagnosis,
        medications: values.medications,
        vitalSigns: values.vitalSigns,
        doctorRemarks: values.doctorRemarks,
        followUpInstructions: values.followUpInstructions
      };
      
      // Finalize encounter
      await finalizeEncounter(encounterId, finalizeData);

      // Create prescription if there is prescription content (medications, tests, or advice)
      if (hasPrescriptionContent()) {
        try {
          const prescriptionData: CreatePrescriptionRequest = {
            encounterId,
            patientId,
            templateId: values.templateId || undefined,
            content: {
              medications: values.medications.filter(m => m.name?.trim()),
              advice: values.advice || undefined,
              tests: values.tests.filter(t => t.name?.trim()),
              followUp: values.followUpInstructions || undefined,
              notes: values.notes || undefined,
            },
          };

          await createPrescription(prescriptionData);
          toast.success('Encounter finalized and prescription created successfully!');
        } catch (prescriptionError) {
          console.error('Error creating prescription:', prescriptionError);
          // Encounter was finalized but prescription failed
          toast.warning('Encounter finalized, but prescription creation failed. You can create the prescription separately.');
        }
      } else {
        toast.success('Encounter finalized successfully!');
      }

      // Success - navigate back to dashboard
      router.push('/doctor/dashboard');
    } catch (error) {
      console.error('Error finalizing encounter:', error);
      // Check if it's a prescription error (409 conflict)
      if (error instanceof Error && error.message.includes('409')) {
        setSubmitError('A prescription already exists for this encounter. Please update the existing prescription instead.');
      } else {
        setSubmitError('Failed to finalize encounter. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    const values = form.getValues();
    console.log('Saving draft:', values);
    // In a real application, you would save this as a draft
    alert('Draft saved successfully!');
  };

  // Section definitions for dynamic rendering
  const sectionDefinitions: Record<string, { id: string; label: string }> = {
    vitals: { id: 'vitals', label: 'Vital Signs' },
    diagnosis: { id: 'diagnosis', label: 'Diagnosis' },
    medications: { id: 'medications', label: 'Medications' },
    symptoms: { id: 'symptoms', label: 'Symptoms & History' },
    remarks: { id: 'remarks', label: 'Doctor\'s Remarks' },
    notes: { id: 'notes', label: 'Clinical Notes' },
    prescription: { id: 'prescription', label: 'Prescription' },
  };

  // Helper to render sections in preference order
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'vitals':
        return (
          <div key="vitals">
            <h3 className="text-lg font-medium mb-3">Vital Signs</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {vitalsOrder.map((vitalId) => {
                const config = vitalsConfig[vitalId];
                if (!config) return null;
                // Map vital IDs to form field names
                const fieldMap: Record<string, string> = {
                  bp: 'vitalSigns.bloodPressure',
                  pulse: 'vitalSigns.heartRate',
                  temp: 'vitalSigns.temperature',
                  weight: 'vitalSigns.weight',
                  height: 'vitalSigns.height',
                  spo2: 'vitalSigns.oxygenSaturation',
                  respiratory: 'vitalSigns.respiratoryRate',
                };
                const fieldName = fieldMap[vitalId];
                return (
                  <div key={vitalId}>
                    <label className="block text-sm font-medium text-gray-700">{config.label}</label>
                    <Input {...form.register(fieldName as any)} placeholder={config.placeholder} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      
      case 'diagnosis':
        return (
          <div key="diagnosis">
            <h3 className="text-lg font-medium mb-3">Diagnosis</h3>
            {diagnosisFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <Input {...form.register(`diagnosis.${index}.code`)} placeholder="ICD Code" />
                <Input {...form.register(`diagnosis.${index}.description`)} placeholder="Diagnosis" />
                <div className="flex space-x-2">
                  <select {...form.register(`diagnosis.${index}.confidence`)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <Button type="button" onClick={() => removeDiagnosis(index)} variant="destructive" size="sm">Remove</Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => appendDiagnosis({ code: "", description: "", confidence: "High" })}
              variant="outline"
              className="mt-2"
            >
              + Add Diagnosis
            </Button>
          </div>
        );
      
      case 'medications':
        return (
          <div key="medications">
            <h3 className="text-lg font-medium mb-3">Medications</h3>
            {medicationFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
                <Input {...form.register(`medications.${index}.name`)} placeholder="Medication" />
                <Input {...form.register(`medications.${index}.dosage`)} placeholder="Dosage" />
                <Input {...form.register(`medications.${index}.frequency`)} placeholder="Frequency" />
                <Input {...form.register(`medications.${index}.duration`)} placeholder="Duration" />
                <div className="flex space-x-2">
                  <Input {...form.register(`medications.${index}.instructions`)} placeholder="Instructions" className="flex-1" />
                  <Button type="button" onClick={() => removeMedication(index)} variant="destructive" size="sm">Remove</Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => appendMedication({ name: "", dosage: "", frequency: "", duration: "", instructions: "" })}
              variant="outline"
              className="mt-2"
            >
              + Add Medication
            </Button>
          </div>
        );
      
      case 'remarks':
      case 'notes':
        return (
          <div key={sectionId}>
            <label className="block text-sm font-medium text-gray-700">Doctor's Remarks & Assessment</label>
            <Textarea {...form.register("doctorRemarks")} className="mt-1 block w-full" rows={4} />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encounter Form{patientName && ` - ${patientName}`}</CardTitle>
      </CardHeader>
      <CardContent>
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Chief Complaint */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Chief Complaint *</label>
            <Textarea 
              {...form.register("chiefComplaint")} 
              className="mt-1 block w-full" 
              placeholder="Patient's primary concern..."
              rows={3}
            />
            {form.formState.errors.chiefComplaint && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.chiefComplaint.message}</p>
            )}
          </div>

          {/* Dynamic Sections - rendered based on doctor preferences */}
          {sectionOrder.map((sectionId) => renderSection(sectionId))}

          {/* Follow-up Instructions (always shown) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Follow-up Instructions</label>
            <Textarea {...form.register("followUpInstructions")} className="mt-1 block w-full" rows={3} />
          </div>

          {/* Prescription Section */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Prescription (Optional)</h2>
            
            {/* Template selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Prescription Template</label>
              <select
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                value={form.watch("templateId") || ""}
                onChange={(e) => {
                  const v = e.target.value || undefined;
                  form.setValue("templateId", v);
                  applyTemplate(v);
                }}
              >
                <option value="">No template</option>
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Advice */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">General Advice</label>
              <Textarea {...form.register("advice")} className="mt-1 block w-full" rows={3} placeholder="General advice for the patient..." />
            </div>

            {/* Tests */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Tests / Investigations</h3>
                <Button
                  type="button"
                  onClick={() => appendTest({ name: "", instructions: "" })}
                  variant="outline"
                  size="sm"
                >
                  + Add Test
                </Button>
              </div>
              {testFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                  <Input {...form.register(`tests.${index}.name`)} placeholder="Test name" />
                  <Input {...form.register(`tests.${index}.instructions`)} placeholder="Instructions" />
                  <div className="flex items-center">
                    <Button type="button" onClick={() => removeTest(index)} variant="destructive" size="sm">Remove</Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <Textarea {...form.register("notes")} className="mt-1 block w-full" rows={3} placeholder="Additional prescription notes..." />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              {hasPrescriptionContent() && (
                <Button type="button" variant="secondary" onClick={handlePrescriptionPreview}>
                  {showPrescriptionPreview ? 'Hide Preview' : 'Preview Prescription'}
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Finalizing...' : 'Save & Finalize Encounter'}
              </Button>
            </div>
          </div>
        </form>

        {/* Prescription Preview Section */}
        {showPrescriptionPreview && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Prescription Preview</h3>
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleDownloadPDF}
                >
                  Download PDF
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowPrescriptionPreview(false)}
                >
                  Hide Preview
                </Button>
              </div>
            </div>
            <div className="border rounded-md overflow-hidden" style={{ height: '600px' }}>
              <PDFViewerWrapper
                width="100%"
                height="100%"
                showToolbar={true}
                patientName={patientInfo.fullName || patientInfo.full_name || 'Patient'}
                patientAge={
                  patientInfo.dateOfBirth || patientInfo.date_of_birth
                    ? Math.max(
                        0,
                        Math.floor(
                          (Date.now() - new Date(patientInfo.dateOfBirth || patientInfo.date_of_birth!).getTime()) /
                          (365.25 * 24 * 60 * 60 * 1000)
                        )
                      )
                    : undefined
                }
                patientGender={patientInfo.gender}
                patientUHID={patientInfo.uhid}
                date={new Date().toISOString()}
                doctorName={doctorInfo?.name || 'Doctor'}
                doctorQualification={doctorInfo?.qualification}
                doctorRegistration={doctorInfo?.registration}
                medications={form.watch('medications')}
                advice={form.watch('advice')}
                tests={form.watch('tests')}
                followUp={form.watch('followUpInstructions')}
                notes={form.watch('notes')}
              />
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Please review the prescription above. If everything looks correct, 
                click "Save & Finalize Encounter" to save both the encounter and prescription.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
