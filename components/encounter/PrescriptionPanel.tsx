"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PrescriptionViewer } from "@/components/prescriptions/PrescriptionViewer";
import dynamic from 'next/dynamic';
import {
  getTemplates,
  createPrescription,
  getPrescriptionsByEncounter,
  getDoctorProfile,
  type Prescription,
  type PrescriptionTemplate,
  type CreatePrescriptionRequest,
} from "@/lib/api";
import { toast } from "sonner";

// Dynamic import for PDF viewer
const PDFViewerWrapper = dynamic(
  () => import("@/components/pdf/PDFViewerWrapper"),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading PDF preview...</div>
  }
);

const schema = z.object({
  templateId: z.string().optional().nullable(),
  medications: z
    .array(
      z.object({
        name: z.string().min(1, "Name required"),
        dosage: z.string().min(1, "Dosage required"),
        frequency: z.string().min(1, "Frequency required"),
        duration: z.string().default(""),
        instructions: z.string().default(""),
      })
    )
    .default([]),
  advice: z.string().default(""),
  tests: z
    .array(
      z.object({
        name: z.string().min(1, "Test name required"),
        instructions: z.string().default(""),
      })
    )
    .default([]),
  followUp: z.string().default(""),
  notes: z.string().default(""),
});

export type PrescriptionFormValues = z.infer<typeof schema>;

interface PrescriptionPanelProps {
  encounterId: string;
  patient: {
    id: string;
    fullName?: string;
    full_name?: string;
    uhid?: string;
    dateOfBirth?: string;
    date_of_birth?: string;
    gender?: string;
  };
}

export default function PrescriptionPanel({ encounterId, patient }: PrescriptionPanelProps) {
  const patientId = patient.id;
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState<{ name: string; qualification?: string; registration?: string }>();
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(schema) as any, // Type assertion due to zod inference
    defaultValues: {
      templateId: undefined,
      medications: [],
      advice: "",
      tests: [],
      followUp: "",
      notes: "",
    },
  });

  const { fields: medFields, append: addMed, remove: removeMed } = useFieldArray({
    control: form.control,
    name: "medications",
  });

  const { fields: testFields, append: addTest, remove: removeTest } = useFieldArray({
    control: form.control,
    name: "tests",
  });

  const patientName = patient.fullName || patient.full_name || "Patient";
  const patientUHID = patient.uhid;
  const patientGender = patient.gender;
  const patientDOB = patient.dateOfBirth || patient.date_of_birth;

  const reload = async () => {
    const [tplRes, listRes] = await Promise.all([
      getTemplates({ page: 1, limit: 50 }).catch(() => null),
      getPrescriptionsByEncounter(encounterId).catch(() => null),
    ]);

    if (tplRes?.data?.success) {
      setTemplates(tplRes.data.data.results || []);
    }
    if (listRes?.data?.success) {
      // API may return data at data.prescriptions or data.results based on doc
      const data = listRes.data.data as any;
      setPrescriptions(data.prescriptions || data.results || []);
    }
  };

  useEffect(() => {
    reload();
    // Load doctor profile for PDF header
    getDoctorProfile()
      .then((resp) => {
        const d = resp.data.data.doctor;
        setDoctorInfo({
          name: d.fullName,
          qualification: d.qualifications?.[0]?.degree,
          registration: d.medicalRegistrationId,
        });
      })
      .catch(() => void 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encounterId]);

  const applyTemplate = (tplId?: string | null) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;
    const sections = tpl.elements?.sections || [];

    // Prepare defaults based on sections
    const next: Partial<PrescriptionFormValues> = {};

    sections.forEach((s) => {
      switch (s.type) {
        case "advice":
          next.advice = s.content || "";
          break;
        case "tests":
          // If template has content, consider it one default test entry
          if (s.content) {
            next.tests = [{ name: s.title || "Test", instructions: s.content }];
          }
          break;
        case "custom":
          // Put into notes by default
          next.notes = [next.notes, s.content].filter(Boolean).join("\n");
          break;
        case "medications":
        default:
          // Leave medications empty; template can predefine headers only
          break;
      }
    });

    form.reset({
      templateId: tplId || undefined,
      medications: form.getValues("medications") || [],
      advice: next.advice ?? form.getValues("advice"),
      tests: next.tests ?? form.getValues("tests"),
      followUp: form.getValues("followUp"),
      notes: next.notes ?? form.getValues("notes"),
    });
  };

  const onSubmit = async (values: PrescriptionFormValues) => {
    try {
      setLoading(true);
      const payload: CreatePrescriptionRequest = {
        encounterId,
        patientId,
        templateId: values.templateId || undefined,
        content: {
          medications: values.medications,
          advice: values.advice || undefined,
          tests: values.tests,
          followUp: values.followUp || undefined,
          notes: values.notes || undefined,
        },
      };

      const resp = await createPrescription(payload);
      if (resp.data.success) {
        toast.success("Prescription saved");
        form.reset({ templateId: undefined, medications: [], advice: "", tests: [], followUp: "", notes: "" });
        await reload();
      } else {
        toast.error(resp.data.message || "Failed to save prescription");
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Failed to save prescription";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Prescription</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Template selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Template</label>
              <select
                className="mt-1 w-full px-3 py-2 border rounded-md"
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

            {/* Medications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Medications</h3>
                <Button type="button" variant="outline" onClick={() => addMed({ name: "", dosage: "", frequency: "", duration: "", instructions: "" })}>
                  + Add
                </Button>
              </div>
              <div className="space-y-2">
                {medFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <Input placeholder="Name" {...form.register(`medications.${index}.name` as const)} />
                    <Input placeholder="Dosage" {...form.register(`medications.${index}.dosage` as const)} />
                    <Input placeholder="Frequency" {...form.register(`medications.${index}.frequency` as const)} />
                    <Input placeholder="Duration" {...form.register(`medications.${index}.duration` as const)} />
                    <div className="flex gap-2">
                      <Input placeholder="Instructions" className="flex-1" {...form.register(`medications.${index}.instructions` as const)} />
                      <Button type="button" variant="destructive" onClick={() => removeMed(index)}>Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
              {form.formState.errors.medications && (
                <p className="text-sm text-red-600 mt-1">Please fill all required medication fields.</p>
              )}
            </div>

            {/* Advice */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Advice</label>
              <Textarea rows={3} placeholder="General advice to patient" {...form.register("advice")} />
            </div>

            {/* Tests */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Tests / Investigations</h3>
                <Button type="button" variant="outline" onClick={() => addTest({ name: "", instructions: "" })}>
                  + Add
                </Button>
              </div>
              <div className="space-y-2">
                {testFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input placeholder="Test name" {...form.register(`tests.${index}.name` as const)} />
                    <Input placeholder="Instructions" {...form.register(`tests.${index}.instructions` as const)} />
                    <div className="flex items-center">
                      <Button type="button" variant="destructive" onClick={() => removeTest(index)}>Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-up */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Follow-up</label>
              <Input placeholder="e.g., Visit after 7 days" {...form.register("followUp")} />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <Textarea rows={3} placeholder="Additional notes" {...form.register("notes")} />
            </div>

            {/* Preview toggle */}
            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={() => setShowPreview((s) => !s)}>
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <div className="flex justify-end gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Prescription"}
                </Button>
              </div>
            </div>
          </form>

          {showPreview && (
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">Live PDF Preview</h4>
              <div className="border rounded-md overflow-hidden" style={{ height: 500 }}>
                <PDFViewerWrapper
                  width="100%"
                  height="100%"
                  showToolbar={true}
                  patientName={patientName}
                  patientAge={patientDOB ? Math.max(0, Math.floor((Date.now() - new Date(patientDOB).getTime()) / (365.25 * 24 * 60 * 60 * 1000))) : undefined}
                  patientGender={patientGender}
                  patientUHID={patientUHID}
                  date={new Date().toISOString()}
                  doctorName={doctorInfo?.name || "Doctor"}
                  doctorQualification={doctorInfo?.qualification}
                  doctorRegistration={doctorInfo?.registration}
                  medications={form.watch("medications")}
                  advice={form.watch("advice")}
                  tests={form.watch("tests")}
                  followUp={form.watch("followUp")}
                  notes={form.watch("notes")}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing prescriptions */}
      <div className="space-y-4">
        {prescriptions.length > 0 ? (
          prescriptions.map((p) => (
            <PrescriptionViewer
              key={p.id}
              prescription={p}
              doctorInfo={doctorInfo}
              clinicInfo={undefined}
            />
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No prescriptions yet for this encounter.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
